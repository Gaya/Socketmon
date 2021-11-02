import { useCallback, useReducer } from 'react';

export interface SocketContextProps {
  status: 'idle' | 'connected' | 'connecting' | 'error' | 'disconnected';
  id?: string;
  error?: Error;
  selectedClient?: string;
  clients: string[];
  sockClients: string[];
  messages: { d: Date; from: string; destination: string; message: string; }[];
}

export interface SocketContextPropsAndCalculated extends SocketContextProps{
  // calculated
  externalClients: string[];

  // actions
  selectClient: (id: string) => void;
  deselectClient: () => void;
  sendMessage: (destination: string, message: string) => void;
}

interface ServerConnectAction {
  type: 'SERVER_CONNECT',
}

interface ServerReconnectAction {
  type: 'SERVER_RECONNECT',
}

interface ServerDisconnectAction {
  type: 'SERVER_DISCONNECT',
}

interface ServerErrorAction {
  type: 'SERVER_ERROR',
  payload: {
    error: Error,
  },
}

interface ServerReceiveId {
  type: 'RECEIVE_ID',
  payload: {
    id: string;
  };
}

interface ServerReceiveClients {
  type: 'RECEIVE_CLIENTS';
  payload: {
    clients: string[];
    sockClients: string[];
  };
}

interface ClientSelectAction {
  type: 'SELECT_CLIENT',
  payload: {
    id: string;
  };
}

interface ClientDeselectAction {
  type: 'DESELECT_CLIENT',
}

interface ServerSentMessage {
  type: 'SENT_MESSAGE',
  payload: {
    from: string;
    destination: string;
    message: string;
  };
}

type SocketContextActions = ServerConnectAction | ServerReconnectAction | ServerErrorAction
  | ServerDisconnectAction | ServerReceiveId | ServerReceiveClients | ClientSelectAction
  | ClientDeselectAction | ServerSentMessage;

interface UseSocketContextProps {
  value: SocketContextPropsAndCalculated;
  actions: {
    serverConnect: () => void;
    serverReconnect: () => void;
    serverDisconnect: () => void;
    serverError: (error: Error) => void;
    receiveId: (id: string) => void;
    receiveClients: (clients: string[], sockClients: string[]) => void;
    sentMessage: (from: string, destination: string, message: string) => void;
  };
}

function useSocketContext(defaultContext: SocketContextProps): UseSocketContextProps {
  const [value, dispatch] = useReducer(
    (state: SocketContextProps, action: SocketContextActions): SocketContextProps => {
      switch (action.type) {
        case 'SERVER_CONNECT':
          return {
            ...state,
            status: 'connecting',
          };
        case 'SERVER_RECONNECT':
          return {
            ...state,
            status: 'idle',
          };
        case 'SERVER_DISCONNECT':
          return {
            ...state,
            status: 'disconnected',
            clients: [],
            sockClients: [],
          };
        case 'SERVER_ERROR':
          return {
            ...state,
            status: 'error',
            error: action.payload.error,
          };
        case 'RECEIVE_ID':
          return {
            ...state,
            status: 'connected',
            id: action.payload.id,
          };
        case 'RECEIVE_CLIENTS':
          return {
            ...state,
            clients: action.payload.clients,
            sockClients: action.payload.sockClients,
          };
        case 'SELECT_CLIENT':
          return {
            ...state,
            selectedClient: action.payload.id,
          };
        case 'DESELECT_CLIENT':
          return {
            ...state,
            selectedClient: undefined,
          };
        case 'SENT_MESSAGE':
          return {
            ...state,
            messages: [
              {
                d: new Date(),
                from: action.payload.from,
                destination: action.payload.destination,
                message: action.payload.message,
              },
              ...state.messages,
            ],
          };
        default:
          return state;
      }
    },
    defaultContext,
  );

  const externalClients = value.clients.filter((c) => value.sockClients.indexOf(c) === -1);

  const serverConnect = useCallback(() => {
    dispatch({ type: 'SERVER_CONNECT' });
  }, []);

  const serverReconnect = useCallback(() => {
    dispatch({ type: 'SERVER_RECONNECT' });
  }, []);

  const serverDisconnect = useCallback(() => {
    dispatch({ type: 'SERVER_DISCONNECT' });
  }, []);

  const serverError = useCallback((error: Error) => {
    dispatch({ type: 'SERVER_ERROR', payload: { error } });
  }, []);

  const receiveId = useCallback((id: string) => {
    dispatch({ type: 'RECEIVE_ID', payload: { id } });
  }, []);

  const receiveClients = useCallback((clients: string[], sockClients: string[]) => {
    dispatch({ type: 'RECEIVE_CLIENTS', payload: { clients, sockClients } });
  }, []);

  const selectClient = useCallback((id: string) => {
    dispatch({ type: 'SELECT_CLIENT', payload: { id } });
  }, []);

  const deselectClient = useCallback(() => {
    dispatch({ type: 'DESELECT_CLIENT' });
  }, []);

  const sentMessage = useCallback((from: string, destination: string, message: string) => {
    dispatch({ type: 'SENT_MESSAGE', payload: { from, destination, message } });
  }, []);

  return {
    value: {
      ...value,
      externalClients,
      selectClient,
      deselectClient,
      sendMessage: () => undefined,
    },
    actions: {
      serverConnect,
      serverReconnect,
      serverDisconnect,
      serverError,
      receiveId,
      receiveClients,
      sentMessage,
    },
  };
}

export default useSocketContext;
