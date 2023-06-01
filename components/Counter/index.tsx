import { Group, Text, UnstyledButton } from "@mantine/core";
import { useState } from "react";

interface CounterProps {
  value: number,
  onChange: any,
}

export default function Counter({value, onChange}: CounterProps) {
  const [count, setCount] = useState(value);

  const onChangeLocal = (newValue: number) => {
    setCount(newValue)

    onChange?.(newValue)
  }

  const onDecreaseButtonPress = () => {
    onChangeLocal(Math.max(0, count - 1));
  }

  const onIncreaseButtonPress = () => {
    onChangeLocal(count + 1);
  }

  return (
    //<Group position="center" sx={{width: '40%', border: '0.1rem solid gray', borderRadius: '0.4rem'}}>
    <Group position="center">
      {count == 1 ? 
        <Text c='#9A9A9A' fz={30}>-</Text>
      :
        <UnstyledButton onClick={onDecreaseButtonPress} disabled={ count == 1 ? true : false }>
          <Text c='#4AC4F3' fz={30}>-</Text>
        </UnstyledButton>
      }
      <Text c='#9A9A9A'>{count}</Text>
      <UnstyledButton onClick={onIncreaseButtonPress}>
        <Text c='#4AC4F3' fz={30}>+</Text>
      </UnstyledButton>
    </Group>
  );
}