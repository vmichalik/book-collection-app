import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { useBooks } from '../hooks/useBooks';
import { Book3D } from '../components/Book3D';

interface BookDetailProps {
  bookId: string;
  onBack: () => void;
  onNavigate?: (bookId: string) => void;
}

export function BookDetail({ bookId, onBack, onNavigate }: BookDetailProps) {
  const { getBook, getNextBook, getPrevBook, deleteBook } = useBooks();
  const [direction, setDirection] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const book = getBook(bookId);
  const nextBook = getNextBook(bookId);
  const prevBook = getPrevBook(bookId);

  // Handle swipe navigation
  const handleNext = useCallback(() => {
    if (nextBook && onNavigate) {
      setDirection(1);
      onNavigate(nextBook.id);
    }
  }, [nextBook, onNavigate]);

  const handlePrev = useCallback(() => {
    if (prevBook && onNavigate) {
      setDirection(-1);
      onNavigate(prevBook.id);
    }
  }, [prevBook, onNavigate]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') onBack();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, onBack]);

  // Touch/swipe handling
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY });
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY });
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart.x - touchEnd.x;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) handleNext();
    if (isRightSwipe) handlePrev();
  };

  const handleDelete = () => {
    deleteBook(bookId);
    onBack();
  };

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white/40">Book not found</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Header */}
      <header className="sticky top-0 z-20 backdrop-blur-xl bg-[#0a0a0f]/80">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </motion.button>

          <motion.h1
            layoutId={`book-title-${book.id}`}
            className="text-lg font-semibold text-white truncate max-w-xs"
          >
            {book.title}
          </motion.h1>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 -mr-2 rounded-full hover:bg-red-500/20 text-red-400 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </motion.button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* 3D Book */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={book.id}
              initial={{ opacity: 0, x: direction * 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * 50 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="flex justify-center py-8"
            >
              <Book3D book={book} size="large" autoRotate={true} />
            </motion.div>
          </AnimatePresence>

          {/* Book Info */}
          <AnimatePresence mode="wait">
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              <div>
                <motion.h2
                  layoutId={`book-title-${book.id}`}
                  className="text-3xl lg:text-4xl font-bold text-white leading-tight"
                >
                  {book.title}
                </motion.h2>
                <motion.p
                  layoutId={`book-author-${book.id}`}
                  className="text-lg text-white/60 mt-2"
                >
                  by {book.author || 'Unknown Author'}
                </motion.p>
              </div>

              {book.description && (
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <h3 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-3">
                    About
                  </h3>
                  <p className="text-white/80 leading-relaxed">{book.description}</p>
                </div>
              )}

              {/* Meta info */}
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="px-4 py-2 bg-white/5 rounded-full border border-white/10">
                  <span className="text-white/40">Added</span>
                  <span className="text-white ml-2">
                    {new Date(book.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation arrows (desktop) */}
        <div className="hidden lg:flex items-center justify-center gap-8 mt-12">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrev}
            disabled={!prevBook}
            className="p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </motion.button>

          <span className="text-white/40 text-sm">
            Swipe or use arrows to navigate
          </span>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNext}
            disabled={!nextBook}
            className="p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </motion.button>
        </div>
      </main>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1a1a1f] rounded-2xl p-6 max-w-sm w-full border border-white/10"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-white mb-2">Delete Book?</h3>
              <p className="text-white/60 text-sm mb-6">
                This will permanently remove &quot;{book.title}&quot; from your collection.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-3 bg-white/5 rounded-xl text-white font-medium hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-3 bg-red-500/20 text-red-400 rounded-xl font-medium hover:bg-red-500/30 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
