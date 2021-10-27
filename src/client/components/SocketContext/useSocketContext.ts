import { useCallback, useReducer } from 'preact/compat';

export interface SocketContextProps {
  status: 'idle' | 'connected' | 'connecting' | 'error' | 'disconnected';
  id?: string;
  error?: Error;
  clients: string[];
  sockClients: string[];
}

interface ServerConnectAction {
  type: 'SERVER_CONNECT',
}

interface ServerDisconnectAction {
  type: 'SERVER_DISCONNECT',
}

interface ServerConnectSuccessAction {
  type: 'SERVER_CONNECT_SUCCESS',
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

type SocketContextActions = ServerConnectAction | ServerConnectSuccessAction
  | ServerErrorAction | ServerDisconnectAction | ServerReceiveId | ServerReceiveClients;

interface UseSocketContextProps {
  value: SocketContextProps;
  actions: {
    serverConnect: () => void;
    serverDisconnect: () => void;
    serverConnectSuccess: () => void;
    serverError: (error: Error) => void;
    receiveId: (id: string) => void;
    receiveClients: (clients: string[], sockClients: string[]) => void;
  };
}

function useSocketContext(defaultContext: SocketContextProps): UseSocketContextProps {
  const [value, dispatch] = useReducer<SocketContextProps, SocketContextActions>(
    (state, action) => {
      switch (action.type) {
        case 'SERVER_CONNECT':
          return {
            ...state,
            status: 'connecting',
          };
        case 'SERVER_DISCONNECT':
          return {
            ...state,
            status: 'disconnected',
          };
        case 'SERVER_CONNECT_SUCCESS':
          return {
            ...state,
            status: 'connected',
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
            id: action.payload.id,
          };
        case 'RECEIVE_CLIENTS':
          return {
            ...state,
            clients: action.payload.clients,
            sockClients: action.payload.sockClients,
          };
        default:
          return state;
      }
    },
    defaultContext,
  );

  const serverConnect = useCallback(() => {
    dispatch({ type: 'SERVER_CONNECT' });
  }, []);

  const serverDisconnect = useCallback(() => {
    dispatch({ type: 'SERVER_DISCONNECT' });
  }, []);

  const serverConnectSuccess = useCallback(() => {
    dispatch({ type: 'SERVER_CONNECT_SUCCESS' });
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

  return {
    value,
    actions: {
      serverConnect,
      serverDisconnect,
      serverConnectSuccess,
      serverError,
      receiveId,
      receiveClients,
    },
  };
}

export default useSocketContext;
