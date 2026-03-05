import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { gridItemVariants } from '@/lib/animations';
import { getRarity } from '@/lib/rarity';
import { Book3D } from './Book3D';
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
  const rarity = getRarity(book.genre);

  const handleTap = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const clientX = 'touches' in e ? e.changedTouches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.changedTouches[0].clientY : e.clientY;
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      setHearts(prev => [...prev, { id: now, x, y }]);
      onToggleFavorite(book.id);
      if (navigator.vibrate) navigator.vibrate(10);
      lastTap.current = 0;
    } else {
      lastTap.current = now;
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
      className="inventory-slot group cursor-pointer text-left w-full rounded-lg bg-surface p-3 pb-2.5"
      style={{ '--slot-glow': rarity.color } as React.CSSProperties}
    >
      {/* 3D Book */}
      <div className="relative flex items-center justify-center mb-2 h-[160px] sm:h-[180px]">
        <div className="scale-[0.65] sm:scale-75 pointer-events-none">
          <Book3D book={book} size="md" autoRotate={false} />
        </div>
        <FavoriteBadge favorited={!!book.favorited} />

        {/* Hearts */}
        {hearts.map(h => (
          <HeartReaction key={h.id} x={h.x} y={h.y} onDone={() => removeHeart(h.id)} />
        ))}
      </div>

      {/* Info */}
      <div className="space-y-1">
        <h3 className="text-[11px] font-medium leading-tight line-clamp-1 text-foreground">
          {book.title}
        </h3>
        <p className="text-[10px] text-muted-foreground line-clamp-1">
          {book.author}
        </p>
        {/* Rarity tag */}
        <div className="flex items-center gap-1.5 pt-0.5">
          <span
            className="rarity-tag inline-block w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: rarity.color }}
          />
          <span
            className="text-[9px] font-mono uppercase tracking-wider"
            style={{ color: rarity.color }}
          >
            {rarity.label}
          </span>
        </div>
      </div>
    </motion.button>
  );
}
