import * as React from 'react';
import Big from 'big.js';

import { Input, InputProps } from '@/components/ui/input';

export type ChangeProps = { value: string; isBig: boolean };
export interface BigInputProps
  extends Omit<InputProps, 'onChange' | 'type' | 'inputMode' | 'value'> {
  value: string;
  onChange: ({ value, isBig }: ChangeProps) => void;
}

const BigInput = React.forwardRef<HTMLInputElement, BigInputProps>(
  ({ value, onChange, ...props }, ref) => {
    // 全角入力のとき、入力終了かどうか
    const isCompositionEnd = React.useRef(true);
    const [localValue, setLocalValue] = React.useState(value);

    const onChangeHandler = (inputValue: string) => {
      if (isCompositionEnd.current) {
        // 全角は半角に
        const newValue = inputValue.normalize('NFKC');
        let isBig = true;
        try {
          Big(newValue).toFixed();
        } catch {
          isBig = false;
        }
        onChange({ value: newValue, isBig });
      }
      setLocalValue(inputValue);
    };

    React.useEffect(() => {
      setLocalValue(value);
    }, [value]);

    return (
      <Input
        ref={ref}
        type='text'
        value={localValue}
        onChange={(e) => onChangeHandler(e.currentTarget.value)}
        onCompositionStart={() => (isCompositionEnd.current = false)}
        onCompositionEnd={(e) => {
          isCompositionEnd.current = true;
          onChangeHandler(e.currentTarget.value);
        }}
        {...props}
      />
    );
  },
);

BigInput.displayName = 'BigInput';

export { BigInput };
