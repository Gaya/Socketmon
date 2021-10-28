import { FunctionComponent } from 'preact';
import { Flex, Text } from '@chakra-ui/react';

const Status: FunctionComponent = ({ children }) => (
  <Flex px={3} alignItems="center" w="100%" justifyContent="center">
    <Text color="gray.500">{children}</Text>
  </Flex>
);

export default Status;
