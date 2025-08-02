import { useState } from 'react';

export default function useCycler<T>(items: T[]) {
  const [idx, setIdx] = useState(0);

  const handleCycle = () => {
    setIdx((old) => {
      if (old === items.length - 1) return 0;
      return old + 1;
    });
  };

  return { value: items[idx], handleCycle, idx };
}
