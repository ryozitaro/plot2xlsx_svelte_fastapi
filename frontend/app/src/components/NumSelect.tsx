import { SelectProps } from '@radix-ui/react-select';

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from '@/components/ui/select';

type NumSelectProps = {
  className?: string;
  options: string[] | { label: string; value: string }[];
  placeholder?: React.ReactNode;
};

const Items: React.FC<NumSelectProps> = ({ options }) => {
  if (options.length > 0) {
    return (
      <>
        {options.map((option, index) => {
          const isString = typeof option === 'string';
          const label = isString ? option : option.label;
          const value = isString ? option : option.value;
          return (
            <SelectItem key={index} value={value}>
              {label}
            </SelectItem>
          );
        })}
      </>
    );
  } else {
    return (
      <SelectGroup>
        <SelectLabel>No data</SelectLabel>
      </SelectGroup>
    );
  }
};

export const NumSelect: React.FC<NumSelectProps & SelectProps> = ({
  options,
  placeholder,
  className,
  ...props
}) => {
  return (
    <Select {...props}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <Items options={options} />
      </SelectContent>
    </Select>
  );
};
