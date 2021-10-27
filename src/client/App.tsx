import { FunctionComponent } from 'preact';

import SocketContextProvider from './components/SocketContext/SocketContext';
import ServerStatus from './components/ServerStatus/ServerStatus';

import './style.css';

const App: FunctionComponent = () => (
  <SocketContextProvider>
    <div className="min-h-screen bg-gray-50">
      <div className="shadow-md bg-gray-800 py-2 md:py-3 px-2 sm:px-6 lg:px-8 text-gray-50">
        <div className="relative flex items-center justify-between">
          <h1>Sock in the Middle</h1>
          <ServerStatus />
        </div>
      </div>
    </div>
  </SocketContextProvider>
);

export default App;
