import { lazy } from 'react';
import MainMenu from './main-menu';

const SCREEN_MAP = {
  Test: lazy(() => import('./test')),
  Album: lazy(() => import('./album')),
  Artist: lazy(() => import('./artist')),
  Devices: lazy(() => import('./devices')),
  Library: lazy(() => import('./library')),
  MainMenu: MainMenu,
  NowPlaying: lazy(() => import('./now-playing')),
  Playlist: lazy(() => import('./playlist')),
  Profile: lazy(() => import('./user-info')),
  Queue: lazy(() => import('./queue')),
  Recents: lazy(() => import('./recently-played')),
  Settings: lazy(() => import('./settings')),
  SavedAlbums: lazy(() => import('./saved-albums')),
  SavedArtists: lazy(() => import('./saved-artists')),
  SavedPlaylists: lazy(() => import('./saved-playlists')),
  SavedTracks: lazy(() => import('./saved-tracks')),
  Search: lazy(() => import('./search'))
};

export type MenuType = keyof typeof SCREEN_MAP;
export default SCREEN_MAP;
