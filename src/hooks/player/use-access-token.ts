import type { AccessToken } from '@spotify/web-api-ts-sdk';
import useReadLocalStorage from './use-read-local-storage';

const TOKEN_KEY = 'spotify-sdk:AuthorizationCodeWithPKCEStrategy:token';

export default function useAccessToken() {
  const token = useReadLocalStorage<AccessToken | undefined>(TOKEN_KEY);
  return token;
}
