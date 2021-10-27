import { FunctionComponent } from 'preact';

import BoxList from '../BoxList/BoxList';

const Messages: FunctionComponent = () => {
  const messages = [];

  return (
    <BoxList title="Communication">
      Communication
    </BoxList>
  );
};

export default Messages;
