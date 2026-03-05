import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, LayoutGroup } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { BookGrid } from '@/components/book/BookGrid';
import { Tray } from '@/components/tray/Tray';
import { TrayBackdrop } from '@/components/tray/TrayBackdrop';
import { BookDetailTray } from '@/components/features/BookDetailTray';
import type { Book } from '@/types/book';

type LoadState = 'loading' | 'error' | 'ready';

export function PublicShelf() {
  const [books, setBooks] = useState<Book[]>([]);
  const [state, setState] = useState<LoadState>('loading');
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/book-collection-app/library.json')
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data: Book[]) => {
        setBooks(data);
        setState('ready');
      })
      .catch(() => setState('error'));
  }, []);

  const close = useCallback(() => setSelectedBookId(null), []);
  const noop = useCallback(() => {}, []);

  if (state === 'loading') {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-background">
        <div className="w-6 h-6 border-2 border-muted-foreground/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-background px-6">
        <div className="text-center max-w-sm">
          <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-lg font-semibold mb-2">Shelf not published yet</h1>
          <p className="text-sm text-muted-foreground">
            The owner hasn't published their library. Ask them to export and deploy their collection.
          </p>
        </div>
      </div>
    );
  }

  const activeBook = selectedBookId ? books.find((b) => b.id === selectedBookId) : undefined;

  return (
    <LayoutGroup>
      <div className="min-h-dvh bg-background pb-4">
        <Header bookCount={books.length} />

        <BookGrid
          books={books}
          onBookSelect={setSelectedBookId}
          onToggleFavorite={noop}
        />

        <AnimatePresence>
          {selectedBookId && activeBook && (
            <>
              <TrayBackdrop onClose={close} />
              <Tray height="85vh" onClose={close}>
                <BookDetailTray
                  book={activeBook}
                  onClose={close}
                  onDelete={noop}
                  onToggleFavorite={noop}
                  readOnly
                />
              </Tray>
            </>
          )}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  );
}
