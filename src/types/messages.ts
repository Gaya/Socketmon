interface SockConnected {
  type: 'SOCK_CONNECTED';
  payload: {
    id: string;
  };
}

interface ConnectSock {
  type: 'CONNECT_SOCK';
}

interface ConnectSockConfirm {
  type: 'CONNECT_SOCK_CONFIRM',
  payload: {
    id: string;
  };
}

interface BroadcastClients {
  type: 'BROADCAST_CLIENTS';
  payload: {
    clients: string[];
    sockClients: string[];
  };
}

interface SendMessage {
  type: 'SEND_MESSAGE';
  payload: {
    destination: string;
    message: string;
  };
}

interface SentMessage {
  type: 'SENT_MESSAGE';
  payload: {
    from: string;
    destination: string;
    message: string;
  };
}

export type OutMessage = SockConnected | ConnectSock | ConnectSockConfirm | BroadcastClients
  | SendMessage | SentMessage;
