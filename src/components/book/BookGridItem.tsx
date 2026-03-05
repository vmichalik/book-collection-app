import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { gridItemVariants } from '@/lib/animations';
import { BookCoverImage } from './BookCoverImage';
import { FavoriteBadge } from './FavoriteBadge';
import { HeartReaction } from './HeartReaction';
import type { Book } from '@/types/book';

interface BookGridItemProps {
  book: Book;
  index: number;
  onSelect: (bookId: string) => void;
  onToggleFavorite: (bookId: string) => void;
}

export function BookGridItem({ book, index, onSelect, onToggleFavorite }: BookGridItemProps) {
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const lastTap = useRef(0);
  const containerRef = useRef<HTMLButtonElement>(null);

  const handleTap = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      // Double tap
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const clientX = 'touches' in e ? e.changedTouches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.changedTouches[0].clientY : e.clientY;
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      setHearts(prev => [...prev, { id: now, x, y }]);
      onToggleFavorite(book.id);
      // Haptic
      if (navigator.vibrate) navigator.vibrate(10);
      lastTap.current = 0;
    } else {
      lastTap.current = now;
      // Single tap with delay
      setTimeout(() => {
        if (lastTap.current === now) {
          onSelect(book.id);
        }
      }, 300);
    }
  }, [book.id, onSelect, onToggleFavorite]);

  const removeHeart = useCallback((id: number) => {
    setHearts(prev => prev.filter(h => h.id !== id));
  }, []);

  return (
    <motion.button
      ref={containerRef}
      type="button"
      custom={index}
      variants={gridItemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={handleTap}
      aria-label={`View ${book.title} by ${book.author}`}
      className="group cursor-pointer text-left w-full relative"
    >
      {/* Cover */}
      <div className="relative aspect-[2/3] mb-3 rounded-md ring-1 ring-black/5 group-hover:ring-black/10 shadow-sm group-hover:shadow-md transition-all duration-300 overflow-hidden">
        <BookCoverImage book={book} className="w-full h-full rounded-md" />
        <FavoriteBadge favorited={!!book.favorited} />

        {/* Heart reactions */}
        {hearts.map(h => (
          <HeartReaction key={h.id} x={h.x} y={h.y} onDone={() => removeHeart(h.id)} />
        ))}
      </div>

      {/* Info */}
      <div className="space-y-0.5 px-0.5">
        <h3 className="font-serif text-sm font-medium leading-tight line-clamp-2 group-hover:text-muted-foreground transition-colors">
          {book.title}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-1">
          {book.author}
        </p>
      </div>
    </motion.button>
  );
}
