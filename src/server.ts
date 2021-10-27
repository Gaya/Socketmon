import WebSocket from 'ws';
import { nanoid } from 'nanoid';

import { OutMessage } from './types/messages';

const serverPort = parseInt(process.env.SERVER_PORT || '5000', 10);

const wss = new WebSocket.Server({ port: serverPort });

const clients: Record<string, WebSocket> = {};
const sockClients: Record<string, boolean> = {};

function sendMessage(ws: WebSocket, obj: OutMessage) {
  ws.send(JSON.stringify(obj));
}

function broadcastClients() {
  Object.values(clients).forEach((ws) => {
    sendMessage(ws, {
      type: 'BROADCAST_CLIENTS',
      payload: {
        clients: Object.keys(clients),
        sockClients: Object.keys(sockClients),
      },
    });
  });
}

wss.on('connection', (ws) => {
  const id = nanoid();
  clients[id] = ws;

  console.info(`Connecting (${id})`);

  sendMessage(ws, {
    type: 'SOCK_CONNECTED',
    payload: {
      id,
    },
  });

  ws.on('message', (message: string) => {
    try {
      const action: OutMessage = JSON.parse(message);

      // handle message
      switch (action.type) {
        case 'CONNECT_SOCK':
          if (action.payload.id === id) {
            sockClients[id] = true;
          }
          break;
        default:
          console.info(`(${id}): Unknown action ${action.type}`);
      }

      // send updates
      switch (action.type) {
        case 'CONNECT_SOCK':
          broadcastClients();
          break;
        default:
      }
    } catch (e) {
      // silence catch
    }

    // log message
    console.log(`(${id}): ${message}`);
  });

  ws.on('close', () => {
    console.info(`Disconnecting (${id})`);

    // remove client
    delete clients[id];

    if (sockClients[id]) {
      delete sockClients[id];
    }

    // update lists
    broadcastClients();
  });
});

console.info(`Server started on port ${serverPort}`);
