import { FunctionComponent } from 'preact';
import { useContext } from 'preact/compat';

import { SocketContext } from '../SocketContext/SocketContext';

const Clients: FunctionComponent = () => {
  const { clients } = useContext(SocketContext);

  return (
    <div>
      {clients.map((c) => (
        <div key={c}>
          {c}
        </div>
      ))}
    </div>
  );
};

export default Clients;
