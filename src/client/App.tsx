import { FunctionComponent } from 'preact';

import SocketContextProvider from './components/SocketContext/SocketContext';
import ServerStatus from './components/ServerStatus/ServerStatus';

import './style.css';

const App: FunctionComponent = () => (
  <SocketContextProvider>
    <div>Hello World</div>
    <ServerStatus />
  </SocketContextProvider>
);

export default App;
