import { useState } from 'react';

export default function useToggle(def = true) {
  const [state, setState] = useState(def);
  return {
    state,
    toggle: () => {
      setState((o) => !o);
    }
  };
}
