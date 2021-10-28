import { FunctionComponent } from 'preact';
import { useContext } from 'preact/compat';
import { Flex, Text } from '@chakra-ui/react';

import { SocketContext } from '../SocketContext/SocketContext';
import Chip from '../Chip/Chip';
import BoxList from '../BoxList/BoxList';

const Clients: FunctionComponent = () => {
  const { sockClients, id } = useContext(SocketContext);

  return (
    <BoxList title="Sock Clients">
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
  );
};

export default Clients;
