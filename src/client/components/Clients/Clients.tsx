import { FunctionComponent } from 'preact';
import { useContext } from 'preact/compat';
import { Flex, Text } from '@chakra-ui/react';

import { SocketContext } from '../SocketContext/SocketContext';
import Chip from '../Chip/Chip';
import BoxList from '../BoxList/BoxList';
import Status from './Status';

const Clients: FunctionComponent = () => {
  const {
    clients,
    sockClients,
    id,
    status,
  } = useContext(SocketContext);

  const externalClients = clients.filter((c) => sockClients.indexOf(c) === -1);

  return (
    <>
      <BoxList title="Connected Clients">
        {status !== 'connected' && (
          <Status>Waiting...</Status>
        )}
        {status === 'connected' && externalClients.length === 0 && (
          <Status>No connected clients yet.</Status>
        )}
        {externalClients.map((c) => (
          <Flex w="100%" alignItems="center" justifyContent="space-between" key={c} px={3}>
            <Text fontWeight={c === id ? 'medium' : 'normal'}>
              {c}
            </Text>
          </Flex>
        ))}
      </BoxList>
      <BoxList title="Server Clients">
        {status !== 'connected' && (
          <Status>Waiting...</Status>
        )}
        {sockClients.map((c) => (
          <Flex w="100%" alignItems="center" justifyContent="space-between" key={c} px={3}>
            <Text fontWeight={c === id ? 'medium' : 'normal'}>
              {c}
            </Text>
            {c === id && (
              <Chip color="green" text="You" />
            )}
          </Flex>
        ))}
      </BoxList>
    </>
  );
};

export default Clients;
