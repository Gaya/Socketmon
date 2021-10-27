import { createContext, FunctionComponent } from 'preact';
import { useEffect, useRef } from 'preact/compat';

import getEnv from '../../helpers/getEnv';

import useSocketContext, { SocketContextProps } from './useSocketContext';

const defaultContext: SocketContextProps = {
  status: 'idle',
};

export const SocketContext = createContext<SocketContextProps>(defaultContext);

const SocketContextProvider: FunctionComponent = ({ children }) => {
  const { value, actions } = useSocketContext(defaultContext);
  const socketRef = useRef<WebSocket>();

  useEffect(() => {
    if (value.status === 'idle') {
      actions.serverConnect();

      socketRef.current = new WebSocket(getEnv('SOCK_SERVER'));

      socketRef.current.onopen = () => {
        actions.serverConnectSuccess();
      };

      socketRef.current.onclose = () => {
        actions.serverDisconnect();
      };

      socketRef.current.onerror = () => {
        actions.serverError(new Error('Error happened on the server'));
      };
    }
  }, [actions, value.status]);

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContextProvider;
