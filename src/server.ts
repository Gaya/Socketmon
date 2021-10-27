import WebSocket from 'ws';
import { nanoid } from 'nanoid';

const wss = new WebSocket.Server({ port: 5000 });

const clients: Record<string, WebSocket>  = {};

wss.on('connection', (ws) => {
  const id = nanoid();
  clients[id] = ws;

  function sendMessage(obj: any) {
    ws.send(JSON.stringify(obj));
  }

  sendMessage({
    type: 'CONNECTED',
    payload: {
      id,
    },
  });
});

console.info('Server started');
