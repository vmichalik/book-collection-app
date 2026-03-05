import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2 } from 'lucide-react';
import { TrayHeader } from '@/components/tray/TrayHeader';
import { Book3D } from '@/components/book/Book3D';
import type { Book } from '@/types/book';

interface BookDetailTrayProps {
  book: Book;
  onClose: () => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export function BookDetailTray({ book, onClose, onDelete, onToggleFavorite }: BookDetailTrayProps) {
  const [showDelete, setShowDelete] = useState(false);

  return (
    <div className="flex flex-col min-h-0">
      <TrayHeader onClose={onClose} />

      <div className="flex-1 overflow-y-auto px-5 pb-10">
        {/* 3D Book */}
        <div className="flex justify-center my-2">
          <Book3D book={book} size="lg" autoRotate />
        </div>

        {/* Title + Author */}
        <div className="text-center mb-5">
          <h2 className="text-lg font-semibold leading-tight mb-1 tracking-tight">
            {book.title}
          </h2>
          <p className="text-sm text-muted-foreground mb-2">
            {book.author || 'Unknown Author'}
          </p>
          {book.genre && (
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              {book.genre}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <button
            onClick={() => onToggleFavorite(book.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              book.favorited
                ? 'bg-accent text-white'
                : 'bg-muted text-foreground hover:bg-border'
            }`}
          >
            <Heart className={`h-3.5 w-3.5 ${book.favorited ? 'fill-current' : ''}`} />
            {book.favorited ? 'Favorited' : 'Favorite'}
          </button>
          <button
            onClick={() => setShowDelete(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-muted text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Discard
          </button>
        </div>

        {/* Meta */}
        <div className="space-y-2 mb-6 rounded-lg border border-border bg-surface p-3">
          {book.genre && (
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Genre</span>
              <span>{book.genre}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Acquired</span>
            <span>
              {new Date(book.createdAt).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
              })}
            </span>
          </div>
        </div>

        {/* Description */}
        {book.description && (
          <div className="border-t border-border pt-4">
            <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground mb-2">Lore</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
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
            className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end justify-center"
            onClick={() => setShowDelete(false)}
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              className="bg-card rounded-t-xl border-t border-border p-5 w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-sm font-medium mb-1">Discard "{book.title}"?</p>
              <p className="text-xs text-muted-foreground mb-5">
                This item will be permanently removed.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDelete(false)}
                  className="flex-1 py-2 text-xs font-medium rounded-md border border-border hover:bg-muted transition-colors"
                >
                  Keep
                </button>
                <button
                  onClick={() => onDelete(book.id)}
                  className="flex-1 py-2 text-xs font-medium rounded-md bg-destructive text-white hover:bg-destructive/90 transition-colors"
                >
                  Discard
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
