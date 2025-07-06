/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import type { MenuType } from '#/components/windows';
import type { ComponentProps } from 'react';
import type SCREEN_MAP from '#/components/windows';

type WindowItem = [MenuType, ComponentProps<any>, string];

interface WindowStore {
  windows: WindowItem[];
  windowTitles: string[];
  addWindow: <T extends MenuType>(
    title: string,
    comp: T,
    props?: ComponentProps<(typeof SCREEN_MAP)[T]>
  ) => void;
  removeWindow: (n?: number) => void;
}

const useWindowStore = create<WindowStore>((set, get) => ({
  windows: [['MainMenu', {}, crypto.randomUUID()]],
  windowTitles: ['Your iPod'],
  addWindow: (title, comp, props) => {
    const w: WindowItem = [comp, props, crypto.randomUUID()];

    set((s) => ({
      windows: [...s.windows, w],
      windowTitles: [...s.windowTitles, title]
    }));
  },
  removeWindow: (n = 1) => {
    if (get().windowTitles.length - n <= 0) return;

    set((s) => ({
      windowTitles: s.windowTitles.slice(0, -n)
    }));

    setTimeout(() => {
      set((s) => ({
        windows: s.windows.slice(0, -n)
      }));
    }, 200);
  }
}));

export default useWindowStore;
