import useAppSettings from '#/hooks/useAppSettings';
import MenuItem from '../shared/menu-item';
import Screen from '../shared/screen';
import useAddWindow from '#/hooks/useAddWindow';
import json from '../../../package.json';

export default function Settings() {
  const [{ clock, theme }, setSettings] = useAppSettings();

  const goTo = useAddWindow();
  const toggleClock = () => {
    setSettings((o) => ({ ...o, clock: !o.clock }));
  };

  const toggleTheme = () => {
    setSettings((o) => ({
      ...o,
      theme: o.theme === 'dark' ? 'light' : 'dark'
    }));
  };

  return (
    <Screen>
      <MenuItem text={json.version}>Version</MenuItem>
      <MenuItem text={clock ? 'true' : 'false'} onClick={toggleClock}>
        Show Clock
      </MenuItem>
      <MenuItem text={theme} onClick={toggleTheme}>
        Theme
      </MenuItem>
      <MenuItem onClick={goTo('Devices', 'Devices')}>Select Device</MenuItem>
    </Screen>
  );
}
