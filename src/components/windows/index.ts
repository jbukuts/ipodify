import { lazy } from 'react';

const SCREEN_MAP = {
  Test: lazy(() => import('./test')),
  Album: lazy(() => import('./album')),
  Artist: lazy(() => import('./artist')),
  Devices: lazy(() => import('./devices')),
  Library: lazy(() => import('./library')),
  MainMenu: lazy(() => import('./main-menu')),
  NowPlaying: lazy(() => import('./now-playing')),
  Playlist: lazy(() => import('./playlist')),
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
