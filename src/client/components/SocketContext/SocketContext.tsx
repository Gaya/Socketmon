import { createContext, FunctionComponent } from 'preact';
import { useCallback, useEffect, useRef } from 'preact/compat';

import { OutMessage } from '../../../types/messages';

import getEnv from '../../helpers/getEnv';

import useSocketContext, { SocketContextProps, SocketContextPropsAndCalculated } from './useSocketContext';

const defaultContext: SocketContextProps = {
  status: 'idle',
  clients: [],
  sockClients: [],
  messages: [],
};

export const SocketContext = createContext<SocketContextPropsAndCalculated>({
  ...defaultContext,
  externalClients: [],
  selectClient: () => undefined,
  deselectClient: () => undefined,
  sendMessage: () => undefined,
});

const SocketContextProvider: FunctionComponent = ({ children }) => {
  const { value, actions } = useSocketContext(defaultContext);
  const socketRef = useRef<WebSocket>();

  const sendMessageToServer = useCallback((message: OutMessage) => {
    socketRef.current?.send(JSON.stringify(message));
  }, []);

  useEffect(() => {
    if (value.status === 'idle') {
      actions.serverConnect();

      socketRef.current = new WebSocket(getEnv('SOCK_SERVER'));

      socketRef.current.onopen = () => {
        sendMessageToServer({ type: 'CONNECT_SOCK' });
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
              sendMessageToServer({ type: 'CONNECT_SOCK_CONFIRM', payload: { id: action.payload.id } });
              break;
            case 'BROADCAST_CLIENTS':
              // update the state
              actions.receiveClients(action.payload.clients, action.payload.sockClients);
              break;
            case 'SENT_MESSAGE':
              actions.sentMessage(
                action.payload.from,
                action.payload.destination,
                action.payload.message,
              );
              break;
            default: {
              // eslint-disable-next-line no-console
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
  }, [actions, sendMessageToServer, value.status]);

  const sendMessage = useCallback((destination: string, message: string) => {
    sendMessageToServer({
      type: 'SEND_MESSAGE',
      payload: {
        destination,
        message,
      },
    });
  }, [sendMessageToServer]);

  return (
    <SocketContext.Provider
      value={{
        ...value,
        sendMessage,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContextProvider;
