import useAppSettings from './use-app-settings';

export default function useTheme() {
  const [{ theme }] = useAppSettings();
  return theme;
}
