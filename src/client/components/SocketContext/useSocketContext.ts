import { useCallback, useReducer } from 'preact/compat';

export interface SocketContextProps {
  status: 'idle' | 'connected' | 'connecting' | 'error' | 'disconnected';
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

type SocketContextActions = ServerConnectAction | ServerConnectSuccessAction
  | ServerErrorAction | ServerDisconnectAction;

interface UseSocketContextProps {
  value: SocketContextProps;
  actions: {
    serverConnect: () => void;
    serverDisconnect: () => void;
    serverConnectSuccess: () => void;
    serverError: (error: Error) => void;
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

  return {
    value,
    actions: {
      serverConnect,
      serverDisconnect,
      serverConnectSuccess,
      serverError,
    },
  };
}

export default useSocketContext;
