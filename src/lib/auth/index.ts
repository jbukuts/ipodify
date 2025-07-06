import {
  GenericCache,
  Scopes,
  SpotifyApi,
  type ICacheStore,
  type IResponseDeserializer
} from '@spotify/web-api-ts-sdk';

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_TARGET as string;
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
