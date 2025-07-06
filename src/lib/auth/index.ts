import {
  GenericCache,
  Scopes,
  SpotifyApi,
  type ICacheStore,
  type IResponseDeserializer
} from '@spotify/web-api-ts-sdk';

const CLIENT_ID = '0981792b5bc94457a102687309d0beb6';
const REDIRECT_URI = 'http://localhost:5173';

export interface AuthRes {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token: string;
}

interface ErrorAuthRes {
  error: string;
  error_description: string;
}

export const getToken = async (
  code: string
): Promise<AuthRes | ErrorAuthRes> => {
  // stored in the previous step
  const codeVerifier = localStorage.getItem('code_verifier');
  if (!codeVerifier) throw new Error('No code verifier');

  const url = 'https://accounts.spotify.com/api/token';
  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      code_verifier: codeVerifier
    })
  };

  return fetch(url, payload).then((b) => b.json());
};

export const STORAGE_EVENT_KEY = 'custom-storage-event';

export class ExtendedCacheStrategy extends GenericCache {
  constructor() {
    super(new CustomCacheStore());
  }
}

class CustomCacheStore implements ICacheStore {
  public get(key: string): string | null {
    return localStorage.getItem(key);
  }

  public set(key: string, value: string): void {
    localStorage.setItem(key, value);
    window.dispatchEvent(
      new CustomEvent(STORAGE_EVENT_KEY, { detail: { key, value } })
    );
  }

  public remove(key: string): void {
    localStorage.removeItem(key);
    window.dispatchEvent(
      new CustomEvent(STORAGE_EVENT_KEY, { detail: { key, value: undefined } })
    );
  }
}

class CustomResponseDeserializer implements IResponseDeserializer {
  public async deserialize<TReturnType>(
    response: Response
  ): Promise<TReturnType> {
    const text = await response.text();

    try {
      if (text.length > 0) {
        const json = JSON.parse(text);
        return json as TReturnType;
      }

      return null as TReturnType;
    } catch {
      return null as TReturnType;
    }
  }
}

export const sdk = SpotifyApi.withUserAuthorization(
  CLIENT_ID,
  REDIRECT_URI,
  Scopes.all,
  {
    deserializer: new CustomResponseDeserializer(),
    cachingStrategy: new ExtendedCacheStrategy()
  }
);
