import { useCallback, useReducer } from 'preact/compat';

export interface SocketContextProps {
  status: 'idle' | 'connected' | 'connecting' | 'error' | 'disconnected';
  id?: string;
  error?: Error;
  selectedClient?: string;
  clients: string[];
  sockClients: string[];
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

interface ClientSelectAction {
  type: 'SELECT_CLIENT',
  payload: {
    id: string;
  };
}

interface ClientDeselectAction {
  type: 'DESELECT_CLIENT',
}

type SocketContextActions = ServerConnectAction | ServerReconnectAction | ServerConnectSuccessAction
  | ServerErrorAction | ServerDisconnectAction | ServerReceiveId | ServerReceiveClients
  | ClientSelectAction | ClientDeselectAction;

interface UseSocketContextProps {
  value: SocketContextPropsAndCalculated;
  actions: {
    serverConnect: () => void;
    serverReconnect: () => void;
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
        case 'SERVER_RECONNECT':
          return {
            ...state,
            status: 'idle',
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

  const selectClient = useCallback((id: string) => {
    dispatch({ type: 'SELECT_CLIENT', payload: { id } });
  }, []);

  const deselectClient = useCallback(() => {
    dispatch({ type: 'DESELECT_CLIENT' });
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
      serverConnectSuccess,
      serverError,
      receiveId,
      receiveClients,
    },
  };
}

export default useSocketContext;
