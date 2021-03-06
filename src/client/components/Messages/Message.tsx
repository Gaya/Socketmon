import { FunctionComponent } from 'react';
import { Badge, Flex, Text } from '@chakra-ui/react';

interface MessageProps {
  d: Date;
  from: string;
  destination: string;
  message: string;
}

const Message: FunctionComponent<MessageProps> = ({
  d,
  from,
  destination,
  message,
}) => {
  const date = d.toLocaleString();

  return (
    <Flex px={3} py={1} flexDirection="column">
      <Flex alignItems="center">
        <Text textColor="gray.500" whiteSpace="nowrap">{date}</Text>
        <Badge mx={2}>{from}</Badge>
        <Text fontSize={10}>❯</Text>
        <Badge mx={2}>{destination}</Badge>
      </Flex>
      <Text my={2} fontFamily="monospace">{message}</Text>
    </Flex>
  );
};

export default Message;
