import { useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBooks } from '@/hooks/useBooks';
import { Book3D } from '@/components/Book3D';

interface BookDetailProps {
  bookId: string;
  onBack: () => void;
  onNavigate?: (bookId: string) => void;
}

export function BookDetail({ bookId, onBack, onNavigate }: BookDetailProps) {
  const { getBook, getNextBook, getPrevBook, deleteBook } = useBooks();
  const [direction, setDirection] = useState(0);
  const [showDelete, setShowDelete] = useState(false);

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
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') onBack();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleNext, handlePrev, onBack]);

  const [touchStart, setTouchStart] = useState<number | null>(null);
  
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? handleNext() : handlePrev();
    }
    setTouchStart(null);
  };

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Book not found</p>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-background"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 p-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowDelete(true)}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-4xl">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            
            {/* 3D Book */}
            <div className="flex justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, x: direction * 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -direction * 40 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <Book3D book={book} size="lg" autoRotate />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Info */}
            <div className="text-center md:text-left">
              <AnimatePresence mode="wait">
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium leading-tight mb-3">
                    {book.title}
                  </h1>
                  
                  <p className="text-lg text-muted-foreground mb-6">
                    by <span className="text-foreground">{book.author || 'Unknown Author'}</span>
                  </p>

                  {book.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-md mx-auto md:mx-0">
                      {book.description}
                    </p>
                  )}

                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-8">
                    Added {new Date(book.createdAt).toLocaleDateString('en-US', {
                      month: 'long', day: 'numeric', year: 'numeric'
                    })}
                  </p>

                  {/* Navigation */}
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrev}
                      disabled={!prevBook}
                      className="gap-1"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Prev
                    </Button>
                    
                    <span className="text-xs text-muted-foreground px-2">
                      Use arrows
                    </span>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNext}
                      disabled={!nextBook}
                      className="gap-1"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Dialog */}
      <AnimatePresence>
        {showDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowDelete(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-background rounded-lg p-6 max-w-sm w-full shadow-xl border"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-serif text-xl font-medium mb-2">Remove book?</h3>
              <p className="text-sm text-muted-foreground mb-6">
                &ldquo;{book.title}&rdquo; will be permanently removed from your collection.
              </p>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowDelete(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  className="flex-1"
                  onClick={() => {
                    deleteBook(bookId);
                    onBack();
                  }}
                >
                  Remove
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
