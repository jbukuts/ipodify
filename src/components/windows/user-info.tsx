import Screen from '#/components/shared/screen';
import MenuItem from '#/components/shared/menu-item';
import useUserProfile from '#/hooks/player/use-user-profile';

export default function UserInfoScreen() {
  const { isLoading, data } = useUserProfile();

  return (
    <Screen loading={isLoading}>
      {data && (
        <>
          <MenuItem text={data?.display_name}>Name</MenuItem>
          <MenuItem text={data?.email}>Email</MenuItem>
          <MenuItem text={data?.country}>Country</MenuItem>
          <MenuItem text={data?.product}>Product</MenuItem>
        </>
      )}
    </Screen>
  );
}
