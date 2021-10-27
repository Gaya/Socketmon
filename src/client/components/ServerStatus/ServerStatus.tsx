import { FunctionComponent } from 'preact';
import { useContext } from 'preact/compat';
import classNames from 'classnames';

import { SocketContext } from '../SocketContext/SocketContext';

const ServerStatus: FunctionComponent = () => {
  const { status } = useContext(SocketContext);

  return (
    <div
      className={classNames(
        'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
        {
          'bg-green-100': status === 'connected',
          'text-green-800': status === 'connected',
          'bg-red-100': status === 'error' || status === 'disconnected',
          'text-red-800': status === 'error' || status === 'disconnected',
          'bg-gray-100': status === 'idle',
          'text-gray-800': status === 'idle',
          'bg-blue-100': status === 'connecting',
          'text-blue-800': status === 'connecting',
        },
      )}
    >
      {status}
    </div>
  );
};

export default ServerStatus;
