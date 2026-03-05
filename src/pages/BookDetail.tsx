import { useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Trash2, ArrowLeft } from 'lucide-react';
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') onBack();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, onBack]);

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
      {/* Simple top bar */}
      <header className="fixed top-0 left-0 right-0 z-20 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="flex items-center gap-2 text-[#666666] hover:text-[#1a1a1a] transition-colors bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Library</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 text-[#999999] hover:text-red-600 transition-colors bg-white/80 backdrop-blur-sm rounded-full shadow-sm"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </header>

      {/* Main Content - Vertically centered */}
      <main className="min-h-screen flex items-center">
        <div className="w-full max-w-6xl mx-auto px-6 py-24">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            
            {/* Left: Floating 3D Book */}
            <div className="flex justify-center items-center order-1 lg:order-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, x: direction * 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -direction * 60 }}
                  transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <Book3D book={book} size="large" autoRotate={true} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right: Book Info */}
            <div className="order-2 lg:order-2 lg:pl-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                  className="text-center lg:text-left"
                >
                  {/* Title - Large but not overwhelming */}
                  <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1a1a1a] leading-[1.15] mb-3">
                    {book.title}
                  </h1>
                  
                  {/* Author */}
                  <p className="text-base sm:text-lg text-[#666666] font-light mb-6">
                    by <span className="text-[#1a1a1a] font-normal">{book.author || 'Unknown Author'}</span>
                  </p>

                  {/* Description */}
                  {book.description && (
                    <div className="mb-8 max-w-md mx-auto lg:mx-0">
                      <p className="text-[15px] text-[#666666] leading-relaxed font-light">
                        {book.description}
                      </p>
                    </div>
                  )}

                  {/* Meta */}
                  <p className="text-xs text-[#999999] font-light tracking-wide uppercase mb-8">
                    Added {new Date(book.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>

                  {/* Navigation - Integrated with content */}
                  <div className="flex items-center justify-center lg:justify-start gap-4">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handlePrev}
                      disabled={!prevBook}
                      className="flex items-center gap-2 px-4 py-2.5 border border-black/[0.08] rounded-full text-[#666666] hover:text-[#1a1a1a] hover:border-black/[0.15] disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-white/50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span className="text-sm font-medium hidden sm:inline">Previous</span>
                    </motion.button>

                    <span className="text-sm text-[#999999] font-light px-2">
                      {prevBook ? '◀' : '○'} swipe {nextBook ? '▶' : '○'}
                    </span>

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handleNext}
                      disabled={!nextBook}
                      className="flex items-center gap-2 px-4 py-2.5 border border-black/[0.08] rounded-full text-[#666666] hover:text-[#1a1a1a] hover:border-black/[0.15] disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-white/50"
                    >
                      <span className="text-sm font-medium hidden sm:inline">Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-xl p-8 max-w-sm w-full shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="font-serif text-2xl text-[#1a1a1a] mb-2">Remove book?</h3>
              <p className="text-[#666666] text-sm font-light mb-8">
                &ldquo;{book.title}&rdquo; will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-3 text-[#666666] hover:text-[#1a1a1a] text-sm font-medium transition-colors rounded-full"
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
