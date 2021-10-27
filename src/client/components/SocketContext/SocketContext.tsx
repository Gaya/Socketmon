import { createContext, FunctionComponent } from 'preact';
import { useEffect } from 'preact/compat';
import WebSocket from 'ws';

import getEnv from '../../helpers/getEnv';

import useSocketContext, { SocketContextProps } from './useSocketContext';

const defaultContext: SocketContextProps = {
  status: 'idle',
};

const SocketContext = createContext<SocketContextProps>(defaultContext);

const SocketContextProvider: FunctionComponent = ({ children }) => {
  const { value, actions } = useSocketContext(defaultContext);

  useEffect(() => {
    if (value.status === 'idle') {
      actions.serverConnect();

      const ws = new WebSocket(getEnv('SOCK_SERVER'));

      ws.on('open', () => {
        actions.serverConnectSuccess();
      });

      ws.on('close', () => {
        actions.serverDisconnect();
      });

      ws.on('error', (err) => {
        actions.serverError(err);
      });
    }
  }, [actions, value.status]);

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContextProvider;
