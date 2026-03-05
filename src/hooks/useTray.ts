import { useState, useCallback } from 'react';

export type TrayType = 'detail' | 'add' | 'settings' | null;

interface TrayState {
  type: TrayType;
  bookId: string | null;
}

export function useTray() {
  const [tray, setTray] = useState<TrayState>({ type: null, bookId: null });

  const openDetail = useCallback((bookId: string) => {
    setTray({ type: 'detail', bookId });
  }, []);

  const openAdd = useCallback(() => {
    setTray({ type: 'add', bookId: null });
  }, []);

  const openSettings = useCallback(() => {
    setTray({ type: 'settings', bookId: null });
  }, []);

  const close = useCallback(() => {
    setTray({ type: null, bookId: null });
  }, []);

  return {
    trayType: tray.type,
    trayBookId: tray.bookId,
    isOpen: tray.type !== null,
    openDetail,
    openAdd,
    openSettings,
    close,
  };
}
