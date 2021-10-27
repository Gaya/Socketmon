import { useCallback, useReducer } from 'preact/compat';

export interface SocketContextProps {
  status: 'idle' | 'connected' | 'connecting' | 'error' | 'disconnected';
  id?: string;
  error?: Error;
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

type SocketContextActions = ServerConnectAction | ServerConnectSuccessAction
  | ServerErrorAction | ServerDisconnectAction | ServerReceiveId;

interface UseSocketContextProps {
  value: SocketContextProps;
  actions: {
    serverConnect: () => void;
    serverDisconnect: () => void;
    serverConnectSuccess: () => void;
    serverError: (error: Error) => void;
    receiveId: (id: string) => void;
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

  return {
    value,
    actions: {
      serverConnect,
      serverDisconnect,
      serverConnectSuccess,
      serverError,
      receiveId,
    },
  };
}

export default useSocketContext;
