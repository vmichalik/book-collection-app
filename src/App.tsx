import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Home } from './pages/Home';
import { BookDetail } from './pages/BookDetail';
import type { Book } from './types/book';

function App() {
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

  const handleBookSelect = (book: Book) => {
    setSelectedBookId(book.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setSelectedBookId(null);
  };

  const handleNavigate = (bookId: string) => {
    setSelectedBookId(bookId);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      <AnimatePresence mode="wait">
        {selectedBookId ? (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <BookDetail
              bookId={selectedBookId}
              onBack={handleBack}
              onNavigate={handleNavigate}
            />
          </motion.div>
        ) : (
          <motion.div
            key="home"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <Home onBookSelect={handleBookSelect} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
