import { FunctionComponent } from 'preact';

import SocketContextProvider from './components/SocketContext/SocketContext';

import './style.css';

const App: FunctionComponent = () => (
  <SocketContextProvider>
    <div>Hello World</div>
  </SocketContextProvider>
);

export default App;
