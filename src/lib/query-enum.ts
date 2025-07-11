enum TrackKey {
  SAVED_LIST = 'track_saved',
  IS_SAVED = 'track_is_saved'
}

enum AlbumKey {
  GET = 'ablum',
  TRACKS = 'album_tracks',
  SAVED_LIST = 'album_saved',
  IS_SAVED = 'album_is_saved'
}

enum ArtistKey {
  TRACKS = 'artist_tracks',
  ALBUMS = 'artist_albums',
  SAVED_LIST = 'artist_saved'
}

enum PlaylistKey {
  GET = 'playlist',
  TRACKS = 'playlist_tracks',
  SAVED_LIST = 'playlist_saved'
}

enum DeviceKey {
  LIST = 'device_list'
}

enum UserKey {
  PROFILE = 'user_profile'
}

enum PlayerKey {
  QUEUE = 'player_queue',
  RECENTLY_PLAYED = 'player_recently_played',
  PLAYBACK_STATE = 'player_playback_state'
}

export const QUERY_KEYS = {
  track: TrackKey,
  album: AlbumKey,
  artist: ArtistKey,
  playlist: PlaylistKey,
  user: UserKey,
  player: PlayerKey,
  device: DeviceKey
};
