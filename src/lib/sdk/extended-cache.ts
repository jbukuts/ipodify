import { GenericCache, type ICacheStore } from '@spotify/web-api-ts-sdk';
import { STORAGE_EVENT_KEY } from './constants';

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
