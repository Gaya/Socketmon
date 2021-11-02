import WebSocket from 'ws';
import { nanoid } from 'nanoid';
import express from 'express';

import { OutMessage } from '../types/messages';

const serverPort = parseInt(process.env.SERVER_PORT || '5000', 10);
const clientHost = process.env.CLIENT_HOST || 'localhost:8080';
const clientPort = process.env.PORT || '8080';
const staticServer = process.argv.includes('--with-static');

const wss = new WebSocket.Server({ port: serverPort });

const clients: Record<string, WebSocket> = {};
const sockClients: Record<string, boolean> = {};

function log(message: string): void {
  // eslint-disable-next-line no-console
  console.log(message);
}

function info(message: string): void {
  // eslint-disable-next-line no-console
  console.info(message);
}

function sendMessage(ws: WebSocket, obj: OutMessage) {
  ws.send(JSON.stringify(obj));
}

function sendPlainMessage(ws: WebSocket, message: string) {
  ws.send(message);
}

function sentMessage(from: string, destination: string, message: string) {
  Object.keys(sockClients).forEach((key) => {
    const ws = clients[key];

    sendMessage(ws, {
      type: 'SENT_MESSAGE',
      payload: {
        from,
        destination,
        message,
      },
    });
  });
}

function broadcastClients() {
  info('Broadcasting client list');

  Object.keys(sockClients).forEach((key) => {
    const ws = clients[key];

    sendMessage(ws, {
      type: 'BROADCAST_CLIENTS',
      payload: {
        clients: Object.keys(clients),
        sockClients: Object.keys(sockClients),
      },
    });
  });
}

function handleMessageSend(destination: string, message: string) {
  const clientKeys = Object.keys(clients);
  const externalClients = clientKeys.filter((c) => !sockClients[c]);
  const receivers = destination === 'all' ? externalClients : [destination];

  receivers.forEach((receiver) => {
    const dest = clients[receiver];

    if (dest) {
      sendPlainMessage(dest, message);
      sentMessage('server', receiver, message);
    }
  });
}

wss.on('connection', (ws, req) => {
  const id = nanoid(8);
  clients[id] = ws;

  info(`Connecting (${id})`);

  broadcastClients();

  const { origin } = req.headers;
  const isSockClient = (origin || '').indexOf(clientHost) > -1;

  ws.on('message', (message: string) => {
    if (isSockClient) {
      try {
        const action: OutMessage = JSON.parse(message);

        // handle message
        switch (action.type) {
          case 'SEND_MESSAGE':
            handleMessageSend(action.payload.destination, action.payload.message);
            break;
          case 'CONNECT_SOCK':
            sendMessage(ws, {
              type: 'SOCK_CONNECTED',
              payload: {
                id,
              },
            });

            sockClients[id] = true;

            broadcastClients();
            break;
          case 'CONNECT_SOCK_CONFIRM':
            if (action.payload.id !== id) {
              sockClients[id] = false;
            }

            broadcastClients();
            break;
          default:
            info(`(${id}): Unknown action ${action.type}`);
        }
      } catch (e) {
        // fail silently
      }
    } else {
      sentMessage(id, 'server', message.toString());
    }

    // log message
    log(`(${id}): ${message}`);
  });

  ws.on('close', () => {
    info(`Disconnecting (${id})`);

    // remove client
    delete clients[id];

    if (sockClients[id]) {
      delete sockClients[id];
    }

    // update lists
    broadcastClients();
  });
});

info(`WebSocket server started on port ${serverPort}`);

if (staticServer) {
  const app = express();

  app.use(express.static(`${__dirname}/../../build`));

  app.listen(clientPort);

  info(`Serving client on ${clientHost}`);
}
