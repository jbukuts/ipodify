import Screen from '../shared/screen';
import useSavedPlaylists from '#/hooks/player/use-saved-playlists';
import PlaylistItem from '../shared/playlist-item';

export default function PlayLists() {
  const { playlists } = useSavedPlaylists({ enabled: true });

  return (
    <Screen>
      {playlists.map((playlist) => (
        <PlaylistItem key={playlist.id} playlist={playlist} />
      ))}
    </Screen>
  );
}
