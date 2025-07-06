import { useState } from 'react';
import { useInterval } from 'usehooks-ts';

export default function useTime(cycle: number | false = 1000) {
  const [date, setDate] = useState(new Date());
  useInterval(() => setDate(new Date()), cycle === false ? null : cycle);
  return date;
}
