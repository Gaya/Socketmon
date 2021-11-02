import { FunctionComponent, useContext, useMemo } from 'react';
import { Badge } from '@chakra-ui/react';

import { SocketContext } from '../SocketContext/SocketContext';

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
    <Badge colorScheme={color}>
      {status}
    </Badge>
  );
};

export default ServerStatus;
