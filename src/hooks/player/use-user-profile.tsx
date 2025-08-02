import { QUERY_KEYS } from '#/lib/query-enum';
import { sdk } from '#/lib/sdk';
import { useQuery } from '@tanstack/react-query';

export default function useUserProfile() {
  const userQuery = useQuery({
    queryKey: [QUERY_KEYS.user.PROFILE, 'me'],
    queryFn: () => sdk.currentUser.profile(),
    staleTime: Infinity
  });

  return userQuery;
}
