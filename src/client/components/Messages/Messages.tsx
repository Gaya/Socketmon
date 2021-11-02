import { FunctionComponent, useContext } from 'react';
import { Divider, VStack } from '@chakra-ui/react';

import { SocketContext } from '../SocketContext/SocketContext';
import Message from './Message';

const Messages: FunctionComponent = () => {
  const { messages, selectedClient } = useContext(SocketContext);

  const filteredMessages = messages
    .filter((message) => {
      if (!selectedClient || selectedClient === 'all') {
        return true;
      }

      return message.from === selectedClient || message.destination === selectedClient;
    });

  return (
    <VStack
      w="100%"
      align="flex-start"
      divider={<Divider borderColor="gray.200" m={0} />}
      pb={2}
    >
      {filteredMessages.map(({
        d,
        from,
        destination,
        message,
      }) => (
        <Message
          key={+d}
          d={d}
          from={from}
          destination={destination}
          message={message}
        />
      ))}
    </VStack>
  );
};

export default Messages;
