import Screen from '#/components/shared/screen';
import MenuItem from '#/components/shared/menu-item';
import useUserProfile from '#/hooks/player/use-user-profile';

export default function UserInfoScreen() {
  const userQuery = useUserProfile();

  return (
    <Screen>
      {!userQuery.isLoading && (
        <>
          <MenuItem>{userQuery.data?.email}</MenuItem>
        </>
      )}
    </Screen>
  );
}
