import createPalette from '#/lib/palette';
import { useEffect, useState } from 'react';

export default function usePalette(imgURL?: string) {
  const [palette, setPalette] = useState<[number, number, number][]>([]);

  useEffect(() => {
    if (!imgURL) return;
    createPalette(imgURL, 7).then((p) => setPalette(p));
  }, [imgURL]);

  return palette;
}
