import { createContext, FunctionComponent } from 'preact';
import { useEffect, useRef } from 'preact/compat';

import { OutMessage } from '../../../types/messages';

import getEnv from '../../helpers/getEnv';

import useSocketContext, { SocketContextProps } from './useSocketContext';

const defaultContext: SocketContextProps = {
  status: 'idle',
  clients: [],
  sockClients: [],
};

export const SocketContext = createContext<SocketContextProps>(defaultContext);

const SocketContextProvider: FunctionComponent = ({ children }) => {
  const { value, actions } = useSocketContext(defaultContext);
  const socketRef = useRef<WebSocket>();

  useEffect(() => {
    console.log(socketRef.current);

    if (value.status === 'idle') {
      actions.serverConnect();

      socketRef.current = new WebSocket(getEnv('SOCK_SERVER'));

      const sendMessage = (message: OutMessage) => {
        socketRef.current?.send(JSON.stringify(message));
      };

      socketRef.current.onopen = () => {
        actions.serverConnectSuccess();
      };

      socketRef.current.onclose = () => {
        actions.serverDisconnect();
      };

      socketRef.current.onerror = () => {
        actions.serverError(new Error('Error happened on the server'));
      };

      socketRef.current.onmessage = (ev) => {
        try {
          const action: OutMessage = JSON.parse(ev.data);

          switch (action.type) {
            case 'SOCK_CONNECTED':
              // update state
              actions.receiveId(action.payload.id);

              // send message to server for verification
              sendMessage({ type: 'CONNECT_SOCK', payload: { id: action.payload.id } });
              break;
            case 'BROADCAST_CLIENTS':
              // update the state
              actions.receiveClients(action.payload.clients, action.payload.sockClients);
              break;
            default: {
              console.info(`Unknown action ${action.type}`);
            }
          }
        } catch (e) {
          // ignore parse error as we can skip these messages
        }
      };
    }

    if (value.status === 'disconnected') {
      actions.serverReconnect();
    }
  }, [actions, value.status]);

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContextProvider;
