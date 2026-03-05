import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Book } from '@/types/book';

interface BookCardProps {
  book: Book;
  onClick: () => void;
  index?: number;
}

export function BookCard({ book, onClick, index = 0 }: BookCardProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <motion.button
      type="button"
      layoutId={`book-${book.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
      onClick={onClick}
      aria-label={`View ${book.title} by ${book.author}`}
      className="group cursor-pointer text-left w-full"
    >
      {/* Cover */}
      <div className={cn(
        "relative aspect-[2/3] mb-3 rounded-md overflow-hidden bg-muted",
        "shadow-sm group-hover:shadow-md transition-shadow duration-300",
        "ring-1 ring-black/5 group-hover:ring-black/10"
      )}>
        {!loaded && !error && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}
        
        {book.coverImage && !error ? (
          <img
            src={book.coverImage}
            alt={`Cover of ${book.title}`}
            loading="lazy"
            width={200}
            height={300}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
            style={{ opacity: loaded ? 1 : 0 }}
          />
        ) : (
          <div 
            className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-white"
            style={{ background: book.spineColor || '#525252' }}
          >
            <p className="font-serif text-sm leading-snug line-clamp-3">{book.title}</p>
            <p className="text-xs text-white/70 mt-2 line-clamp-1">{book.author}</p>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="space-y-0.5">
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
