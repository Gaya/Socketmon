import { FunctionComponent } from 'preact';
import { useContext } from 'preact/compat';

import { SocketContext } from '../SocketContext/SocketContext';
import Chip from '../Chip/Chip';
import BoxList from '../BoxList/BoxList';

const Clients: FunctionComponent = () => {
  const { clients, sockClients, id } = useContext(SocketContext);

  return (
    <BoxList title="Connected Clients">
      {clients.map((c) => (
        <div key={c} className="py-2 px-3 flex justify-between">
          <span>
            {c}
          </span>
          {c === id && (
            <Chip color="green" text="You" />
          )}
          {c !== id && sockClients.indexOf(c) > -1 && (
            <Chip color="blue" text="Sock" />
          )}
          {c !== id && sockClients.indexOf(c) === -1 && (
            <Chip color="default" text="Client" />
          )}
        </div>
      ))}
    </BoxList>
  );
};

export default Clients;
