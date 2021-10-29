import { FunctionComponent } from 'preact';
import {
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'preact/compat';
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
} from '@chakra-ui/react';

import { SocketContext } from '../SocketContext/SocketContext';

const SendMessage: FunctionComponent = () => {
  const { externalClients, selectedClient, sendMessage } = useContext(SocketContext);
  const [selected, setSelected] = useState<string>();
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    if (selectedClient) {
      setSelected(selectedClient);
    } else {
      setSelected(undefined);
    }
  }, [selectedClient]);

  const handleSubmit = useCallback((e: Event) => {
    e.preventDefault();

    if (message !== '') {
      sendMessage(selected || 'all', message);
    }
  }, [message, selected, sendMessage]);

  return (
    <form style={{ width: '100%' }} onSubmit={handleSubmit}>
      <Flex borderTopWidth={1} borderColor="gray.200" w="100%">
        <FormControl display="flex" px={3} py={2} bg="gray.50">
          <FormLabel display="none">
            Message
          </FormLabel>
          <Select
            display="block"
            flexGrow={0}
            bg="white"
            w="xs"
            maxWidth={130}
            onChange={(event: Event) => setSelected((event.target as HTMLSelectElement).value)}
          >
            <option value="all">All</option>
            {externalClients.map((c) => (
              <option selected={selected === c} key={c} value={c}>{c}</option>
            ))}
          </Select>
          <Input
            display="block"
            mx={3}
            flexGrow={1}
            type="text"
            placeholder="Send message..."
            bg="white"
            isFullWidth
            value={message}
            onChange={(event: Event) => setMessage((event.target as HTMLInputElement).value)}
          />
          <Button colorScheme="blue" flexShrink={0} type="submit">
            Send
          </Button>
        </FormControl>
      </Flex>
    </form>
  );
};

export default SendMessage;
