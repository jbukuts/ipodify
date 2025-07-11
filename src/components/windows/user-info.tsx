import { sdk } from '#/lib/sdk';
import Screen from '#/components/shared/screen';
import MenuItem from '#/components/shared/menu-item';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '#/lib/query-enum';

export default function UserInfoScreen() {
  const userQuery = useQuery({
    queryKey: [QUERY_KEYS.user.PROFILE, 'me'],
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
