import { useCallback, useEffect, useState } from 'react';

export default function useDebouncedState<T>(value: T, delay: number = 500) {
  const [deboucedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  const immediateSetValue = useCallback((v: T) => {
    setDebouncedValue(v);
  }, []);

  return [deboucedValue, immediateSetValue] as const;
}
