import { FunctionComponent } from 'react';
import { ChakraProvider, Flex } from '@chakra-ui/react';

import SocketContextProvider from './components/SocketContext/SocketContext';
import ServerStatus from './components/ServerStatus/ServerStatus';
import Clients from './components/Clients/Clients';
import Messages from './components/Messages/Messages';
import SendMessage from './components/SendMessage/SendMessage';
import Logo from './components/Logo/Logo';

import theme from './helpers/theme';

const App: FunctionComponent = () => (
  <SocketContextProvider>
    <ChakraProvider theme={theme}>
      <Flex flexDirection="column" flexGrow={1} height="100vh">
        <Flex flexGrow={0} p={4} px={6} bg="gray.700" textColor="gray.50">
          <Flex flexGrow={1} justifyContent="space-between" alignItems="center">
            <Logo />
            <ServerStatus />
          </Flex>
        </Flex>
        <Flex flexGrow={1} height="calc(100vh - 56px)">
          <Flex flexGrow={1} flexDirection="column">
            <Flex flexGrow={1} overflow="scroll">
              <Messages />
            </Flex>
            <Flex flexGrow={0}>
              <SendMessage />
            </Flex>
          </Flex>
          <Flex flexGrow={0} w="xs" shadow="lg" flexDirection="column" justifyContent="space-between">
            <Clients />
          </Flex>
        </Flex>
      </Flex>
    </ChakraProvider>
  </SocketContextProvider>
);

export default App;
