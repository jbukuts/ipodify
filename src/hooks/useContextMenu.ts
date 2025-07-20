import { useEffect, useState } from 'react';

export default function useContextMenu() {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextPos, setContextPos] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    const handleClickOutside = () => setShowContextMenu(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleContextMenu = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault(); // Prevent default browser context menu
    setContextPos([event.pageX, event.pageY]);
    setShowContextMenu(true);
  };

  return {
    contextPos,
    showContextMenu,
    handleContextMenu
  };
}
