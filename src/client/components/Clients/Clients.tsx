import { FunctionComponent } from 'preact';
import { useContext } from 'preact/compat';
import { Badge, Flex, Text } from '@chakra-ui/react';

import { SocketContext } from '../SocketContext/SocketContext';
import BoxList from '../BoxList/BoxList';
import Status from './Status';

const Clients: FunctionComponent = () => {
  const {
    sockClients,
    externalClients,
    id,
    status,
    selectClient,
    selectedClient,
    deselectClient,
  } = useContext(SocketContext);

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
          <Flex
            w="100%"
            alignItems="center"
            justifyContent="space-between"
            key={c}
            px={3}
            py={2}
            my={-2}
            cursor="pointer"
            bg={selectedClient === c ? 'gray.200' : 'white'}
            onClick={() => {
              if (selectedClient === c) {
                deselectClient();
              } else {
                selectClient(c);
              }
            }}
            _hover={{ bg: 'gray.100' }}
          >
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
              <Badge colorScheme="green">
                You
              </Badge>
            )}
          </Flex>
        ))}
      </BoxList>
    </>
  );
};

export default Clients;
