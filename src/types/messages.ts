interface SockConnected {
  type: 'SOCK_CONNECTED',
  payload: {
    id: string;
  };
}

interface ConnectSock {
  type: 'CONNECT_SOCK',
  payload: {
    id: string;
  };
}

interface BroadcastClients {
  type: 'BROADCAST_CLIENTS',
  payload: {
    clients: string[];
    sockClients: string[];
  }
}

export type OutMessage = SockConnected | ConnectSock | BroadcastClients;
