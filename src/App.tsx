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
    <div className="min-h-screen bg-[#f7f5f2]">
      <AnimatePresence mode="wait">
        {selectedBookId ? (
          <motion.div
            key="detail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Home onBookSelect={handleBookSelect} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
