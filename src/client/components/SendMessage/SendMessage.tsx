import {
  FormEvent,
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
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
  const {
    externalClients,
    selectedClient,
    sendMessage,
    status,
  } = useContext(SocketContext);
  const [selected, setSelected] = useState<string>();
  const [message, setMessage] = useState<string>('');

  const isEnabled = status === 'connected';

  useEffect(() => {
    if (selectedClient) {
      setSelected(selectedClient);
    } else {
      setSelected(undefined);
    }
  }, [selectedClient]);

  const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isEnabled && message !== '') {
      sendMessage(selected || 'all', message);
      setMessage('');
    }
  }, [isEnabled, message, selected, sendMessage]);

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
            maxWidth={150}
            isDisabled={!isEnabled}
            onChange={(event) => setSelected(event.target.value)}
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
            isDisabled={!isEnabled}
            type="text"
            placeholder="Send message..."
            bg="white"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
          <Button colorScheme="blue" flexShrink={0} type="submit" isDisabled={!isEnabled}>
            Send
          </Button>
        </FormControl>
      </Flex>
    </form>
  );
};

export default SendMessage;
