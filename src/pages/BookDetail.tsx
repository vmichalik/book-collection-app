import { useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Trash2 } from 'lucide-react';
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
  const [touchStart, setTouchStart] = useState<{ x: number } | null>(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart({ x: e.targetTouches[0].clientX });
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const distance = touchStart.x - e.changedTouches[0].clientX;
    if (distance > minSwipeDistance) handleNext();
    if (distance < -minSwipeDistance) handlePrev();
    setTouchStart(null);
  };

  const handleDelete = () => {
    deleteBook(bookId);
    onBack();
  };

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f5f2]">
        <p className="text-[#999999] font-light">Book not found</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#f7f5f2]"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-20 bg-[#f7f5f2]/90 backdrop-blur-md border-b border-black/[0.06]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="flex items-center gap-2 text-[#666666] hover:text-[#1a1a1a] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 text-[#999999] hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </motion.button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-12 min-h-screen">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[calc(100vh-160px)]">
            
            {/* Left: 3D Floating Book */}
            <AnimatePresence mode="wait">
              <motion.div
                key={book.id}
                initial={{ opacity: 0, x: direction * 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -direction * 50 }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                className="flex justify-center items-center py-12"
              >
                <Book3D book={book} size="medium" autoRotate={true} />
              </motion.div>
            </AnimatePresence>

            {/* Right: Book Info */}
            <AnimatePresence mode="wait">
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="lg:pl-8"
              >
                {/* Title */}
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#1a1a1a] leading-[1.1] mb-4">
                  {book.title}
                </h1>
                
                {/* Author */}
                <p className="text-lg md:text-xl text-[#666666] font-light mb-8">
                  by <span className="text-[#1a1a1a] font-normal">{book.author || 'Unknown Author'}</span>
                </p>

                {/* Divider */}
                <div className="w-16 h-px bg-[#1a1a1a]/20 mb-8" />

                {/* Description */}
                {book.description && (
                  <div className="mb-10">
                    <p className="text-[15px] text-[#666666] leading-relaxed font-light max-w-md">
                      {book.description}
                    </p>
                  </div>
                )}

                {/* Meta */}
                <div className="text-sm text-[#999999] font-light">
                  <p>Added {new Date(book.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-16 pt-8 border-t border-black/[0.06]">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handlePrev}
              disabled={!prevBook}
              className="flex items-center gap-3 text-[#666666] hover:text-[#1a1a1a] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Previous</span>
            </motion.button>

            <span className="text-sm text-[#999999] font-light">
              Use arrow keys or swipe
            </span>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              disabled={!nextBook}
              className="flex items-center gap-3 text-[#666666] hover:text-[#1a1a1a] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <span className="text-sm font-medium">Next</span>
              <ChevronLeft className="w-5 h-5 rotate-180" />
            </motion.button>
          </div>
        </div>
      </main>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg p-8 max-w-sm w-full shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="font-serif text-2xl text-[#1a1a1a] mb-2">Remove this volume?</h3>
              <p className="text-[#666666] text-sm font-light mb-8">
                &ldquo;{book.title}&rdquo; will be permanently removed from your collection.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-3 text-[#666666] hover:text-[#1a1a1a] text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-3 bg-[#1a1a1a] text-white rounded-full text-sm font-medium hover:bg-[#333333] transition-colors"
                >
                  Remove
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
