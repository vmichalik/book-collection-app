import { AnimatePresence, LayoutGroup } from 'framer-motion';
import { useBooks } from '@/hooks/useBooks';
import { useTray } from '@/hooks/useTray';
import { Header } from '@/components/layout/Header';
import { TabBar } from '@/components/layout/TabBar';
import { BookGrid } from '@/components/book/BookGrid';
import { Tray } from '@/components/tray/Tray';
import { TrayBackdrop } from '@/components/tray/TrayBackdrop';
import { BookDetailTray } from '@/components/features/BookDetailTray';
import { AddBookTray } from '@/components/features/AddBookTray';
import { SettingsTray } from '@/components/features/SettingsTray';
import { ConfettiCanvas } from '@/components/animations/ConfettiCanvas';

function App() {
  const {
    books,
    isLoaded,
    milestone,
    clearMilestone,
    addBook,
    deleteBook,
    getBook,
    toggleFavorite,
  } = useBooks();

  const {
    trayType,
    trayBookId,
    isOpen,
    openDetail,
    openAdd,
    openSettings,
    close,
  } = useTray();

  if (!isLoaded) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-background">
        <div className="w-6 h-6 border-2 border-muted-foreground/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const activeBook = trayBookId ? getBook(trayBookId) : undefined;

  return (
    <LayoutGroup>
      <div className="min-h-dvh bg-background pb-20">
        <Header bookCount={books.length} />

        <BookGrid
          books={books}
          onBookSelect={openDetail}
          onToggleFavorite={toggleFavorite}
        />

        <TabBar
          activeTab={trayType === 'settings' ? 'settings' : 'library'}
          onLibrary={close}
          onAdd={openAdd}
          onSettings={openSettings}
        />

        {/* Tray Portal */}
        <AnimatePresence>
          {isOpen && (
            <>
              <TrayBackdrop onClose={close} />

              {trayType === 'detail' && activeBook && (
                <Tray height="85vh" onClose={close}>
                  <BookDetailTray
                    book={activeBook}
                    onClose={close}
                    onDelete={(id) => { deleteBook(id); close(); }}
                    onToggleFavorite={toggleFavorite}
                  />
                </Tray>
              )}

              {trayType === 'add' && (
                <Tray height="70vh" onClose={close}>
                  <AddBookTray onClose={close} onAdd={addBook} />
                </Tray>
              )}

              {trayType === 'settings' && (
                <Tray height="60vh" onClose={close}>
                  <SettingsTray onClose={close} bookCount={books.length} />
                </Tray>
              )}
            </>
          )}
        </AnimatePresence>

        {/* Milestone confetti */}
        <ConfettiCanvas milestone={milestone} onDone={clearMilestone} />
      </div>
    </LayoutGroup>
  );
}

export default App;
