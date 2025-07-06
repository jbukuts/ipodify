import { Scopes, SpotifyApi } from '@spotify/web-api-ts-sdk';
import { ExtendedCacheStrategy } from './extended-cache';
import { CustomResponseDeserializer } from './custom-deserializer';

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_TARGET as string;

export const sdk = SpotifyApi.withUserAuthorization(
  CLIENT_ID,
  REDIRECT_URI,
  Scopes.all,
  {
    deserializer: new CustomResponseDeserializer(),
    cachingStrategy: new ExtendedCacheStrategy()
  }
);
