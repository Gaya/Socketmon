import { FunctionComponent } from 'preact';
import { ChakraProvider, Flex, Heading } from '@chakra-ui/react';

import SocketContextProvider from './components/SocketContext/SocketContext';
import ServerStatus from './components/ServerStatus/ServerStatus';
import Clients from './components/Clients/Clients';
import Messages from './components/Messages/Messages';

import theme from './helpers/theme';

import './style.css';

const App: FunctionComponent = () => (
  <SocketContextProvider>
    <ChakraProvider theme={theme}>
      <Flex flexDirection="column" flexGrow={1} minH="100vh">
        <Flex flexGrow={0} p={4} px={6} bg="gray.700" textColor="gray.50">
          <Flex flexGrow={1} justifyContent="space-between" alignItems="center">
            <Heading as="h1" size="md">Sock in the Middle</Heading>
            <ServerStatus />
          </Flex>
        </Flex>
        <Flex flexGrow={1}>
          <Flex flexGrow={1}>
            <Messages />
          </Flex>
          <Flex flexGrow={0} w="sm" shadow="lg">
            <Clients />
          </Flex>
        </Flex>
      </Flex>
    </ChakraProvider>
  </SocketContextProvider>
);

export default App;
