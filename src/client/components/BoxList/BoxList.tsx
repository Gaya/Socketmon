import { FunctionComponent } from 'preact';
import { Heading, Divider, VStack } from '@chakra-ui/react';

interface BoxListProps {
  title: string;
}

const BoxList: FunctionComponent<BoxListProps> = ({ children, title }) => (
  <VStack
    w="100%"
    align="flex-start"
    divider={<Divider borderColor="gray.200" m={0} />}
  >
    <Heading as="h2" size="sm" px={3} py={2}>
      {title}
    </Heading>
    {children}
  </VStack>
);

export default BoxList;