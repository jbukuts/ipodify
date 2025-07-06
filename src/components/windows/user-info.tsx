import { sdk } from '#/lib/sdk';
import Screen from '#/components/shared/screen';
import MenuItem from '#/components/shared/menu-item';
import { useQuery } from '@tanstack/react-query';

export default function UserInfoScreen() {
  const userQuery = useQuery({
    queryKey: ['current-user-profile'],
    queryFn: () => sdk.currentUser.profile()
  });

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
