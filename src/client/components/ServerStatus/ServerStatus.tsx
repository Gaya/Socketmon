import { FunctionComponent } from 'preact';
import { useContext, useMemo } from 'preact/compat';

import { SocketContext } from '../SocketContext/SocketContext';
import Chip from '../Chip/Chip';

const ServerStatus: FunctionComponent = () => {
  const { status } = useContext(SocketContext);

  const color = useMemo(() => {
    switch (status) {
      case 'connected':
        return 'green';
      case 'error':
      case 'disconnected':
        return 'red';
      case 'connecting':
        return 'blue';
      case 'idle':
      default:
        return 'default';
    }
  }, [status]);

  return (
    <Chip text={status} color={color} />
  );
};

export default ServerStatus;
