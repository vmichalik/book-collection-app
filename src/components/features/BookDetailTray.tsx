import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2, Calendar, BookOpen } from 'lucide-react';
import { TrayHeader } from '@/components/tray/TrayHeader';
import { BookCoverImage } from '@/components/book/BookCoverImage';
import { Book3D } from '@/components/book/Book3D';
import { Button } from '@/components/ui/button';
import type { Book } from '@/types/book';

interface BookDetailTrayProps {
  book: Book;
  onClose: () => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export function BookDetailTray({ book, onClose, onDelete, onToggleFavorite }: BookDetailTrayProps) {
  const [showDelete, setShowDelete] = useState(false);
  const [show3D, setShow3D] = useState(false);

  return (
    <div className="flex flex-col min-h-0">
      <TrayHeader onClose={onClose} />

      <div className="flex-1 overflow-y-auto px-5 pb-8">
        {/* Cover */}
        <div className="flex justify-center my-4">
          {show3D ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="cursor-pointer"
              onClick={() => setShow3D(false)}
            >
              <Book3D book={book} size="lg" autoRotate />
            </motion.div>
          ) : (
            <motion.div
              className="cursor-pointer"
              onClick={() => setShow3D(true)}
              whileTap={{ scale: 0.97 }}
            >
              <BookCoverImage
                book={book}
                className="w-44 h-64 rounded-lg shadow-xl"
                enableLayout
              />
            </motion.div>
          )}
        </div>

        {/* Title + Author */}
        <div className="text-center mb-6">
          <h2 className="font-serif text-2xl md:text-3xl font-medium leading-tight mb-1.5 text-balance">
            {book.title}
          </h2>
          <p className="text-base text-muted-foreground">
            by {book.author || 'Unknown Author'}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <Button
            variant={book.favorited ? 'default' : 'outline'}
            size="sm"
            onClick={() => onToggleFavorite(book.id)}
            className="gap-1.5"
          >
            <Heart className={`h-4 w-4 ${book.favorited ? 'fill-current' : ''}`} />
            {book.favorited ? 'Favorited' : 'Favorite'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDelete(true)}
            className="gap-1.5 text-muted-foreground hover:text-destructive hover:border-destructive"
          >
            <Trash2 className="h-4 w-4" />
            Remove
          </Button>
        </div>

        {/* Meta */}
        <div className="space-y-4 mb-6">
          {book.genre && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="h-4 w-4" />
              <span>{book.genre}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              Added {new Date(book.createdAt).toLocaleDateString('en-US', {
                month: 'long', day: 'numeric', year: 'numeric'
              })}
            </span>
          </div>
        </div>

        {/* Description */}
        {book.description && (
          <div className="border-t pt-5">
            <p className="text-sm text-muted-foreground leading-relaxed text-pretty">
              {book.description}
            </p>
          </div>
        )}
      </div>

      {/* Delete confirmation */}
      <AnimatePresence>
        {showDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end justify-center"
            onClick={() => setShowDelete(false)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              className="bg-background rounded-t-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-serif text-xl font-medium mb-2">Remove Book?</h3>
              <p className="text-sm text-muted-foreground mb-6 text-pretty">
                &ldquo;{book.title}&rdquo; will be permanently removed from your collection.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowDelete(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" className="flex-1" onClick={() => onDelete(book.id)}>
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
