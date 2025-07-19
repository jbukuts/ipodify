import useAppSettings from '#/hooks/useAppSettings';
import MenuItem from '../shared/menu-item';
import Screen from '../shared/screen';
import useAddWindow from '#/hooks/useAddWindow';
import { version, repository } from '../../../package.json';

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

  const goToSource = () => {
    window.open(repository);
  };

  return (
    <Screen>
      <MenuItem text={version} onClick={goToSource}>
        Version
      </MenuItem>
      <MenuItem text={clock ? 'true' : 'false'} onClick={toggleClock}>
        Show Clock
      </MenuItem>
      <MenuItem text={theme} onClick={toggleTheme}>
        Theme
      </MenuItem>
      <MenuItem onClick={goTo('Devices', 'Devices')}>Select Device</MenuItem>
      <MenuItem onClick={goTo('Test Menu', 'Test')}>Test Menu</MenuItem>
    </Screen>
  );
}
