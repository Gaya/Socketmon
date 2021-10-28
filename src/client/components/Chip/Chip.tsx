import { FunctionComponent } from 'preact';
import { Badge } from '@chakra-ui/react';

interface ChipProps {
  text: string;
  color?: 'red' | 'blue' | 'green' | 'default';
}

const Chip: FunctionComponent<ChipProps> = ({ text, color = 'default' }) => {
  return (
    <Badge colorScheme={color}>
      {text}
    </Badge>
  );
};

export default Chip;
