import useAppSettings from '#/hooks/use-app-settings';
import MenuItem from '../shared/menu-item';
import Screen from '../shared/screen';
import useAddWindow from '#/hooks/use-add-window';
import { version, repository } from '../../../package.json';

export default function Settings() {
  const [{ clock, theme, enableAnimation }, updateSettings] = useAppSettings();

  const goTo = useAddWindow();
  const toggleClock = () => {
    updateSettings((o) => ({ clock: !o.clock }));
  };

  const toggleTheme = () => {
    updateSettings((o) => ({
      theme: o.theme === 'dark' ? 'light' : 'dark'
    }));
  };

  const toggleAnimations = () => {
    updateSettings((o) => ({ enableAnimation: !o.enableAnimation }));
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
      <MenuItem
        text={enableAnimation ? 'true' : 'false'}
        onClick={toggleAnimations}>
        Background Animation
      </MenuItem>
      <MenuItem text={theme} onClick={toggleTheme}>
        Theme
      </MenuItem>
      <MenuItem onClick={goTo('Devices', 'Devices')}>Select Device</MenuItem>
      <MenuItem onClick={goTo('Test Menu', 'Test')}>Test Menu</MenuItem>
    </Screen>
  );
}
