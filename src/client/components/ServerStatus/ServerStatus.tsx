import { FunctionComponent } from 'preact';
import { useContext } from 'preact/compat';

import { SocketContext } from '../SocketContext/SocketContext';

const ServerStatus: FunctionComponent = () => {
  const { status } = useContext(SocketContext);

  return (
    <div>
      {status}
    </div>
  );
};

export default ServerStatus;
