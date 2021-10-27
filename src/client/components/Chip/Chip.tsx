import { FunctionComponent } from 'preact';
import classNames from 'classnames';

interface ChipProps {
  text: string;
  color?: 'red' | 'blue' | 'green' | 'default';
}

const Chip: FunctionComponent<ChipProps> = ({ text, color = 'default' }) => {
  return (
    <div
      className={classNames(
        'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
        {
          'bg-green-100': color === 'green',
          'text-green-800': color === 'green',
          'bg-red-100': color === 'red',
          'text-red-800': color === 'red',
          'bg-gray-100': color === 'default',
          'text-gray-800': color === 'default',
          'bg-blue-100': color === 'blue',
          'text-blue-800': color === 'blue',
        },
      )}
    >
      {text}
    </div>
  );
};

export default Chip;
