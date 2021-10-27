import { FunctionComponent } from 'preact';

import SocketContextProvider from './components/SocketContext/SocketContext';
import ServerStatus from './components/ServerStatus/ServerStatus';
import Clients from './components/Clients/Clients';
import Messages from './components/Messages/Messages';

import './style.css';

const App: FunctionComponent = () => (
  <SocketContextProvider>
    <div className="min-h-screen bg-gray-50">
      <div className="shadow bg-gray-800 text-gray-50 py-2 md:py-3 px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between">
          <h1>Sock in the Middle</h1>
          <ServerStatus />
        </div>
      </div>
      <div className="flex">
        <div className="flex-1 flex-grow p-2 md:p-3">
          <Messages />
        </div>
        <div className="w-80 p-2 md:p-3">
          <Clients />
        </div>
      </div>
    </div>
  </SocketContextProvider>
);

export default App;
