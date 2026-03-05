import { useState } from 'react';
import { motion } from 'framer-motion';
import { SHARED_ELEMENT_TRANSITION } from '@/lib/animations';
import { cn } from '@/lib/utils';
import type { Book } from '@/types/book';

interface BookCoverImageProps {
  book: Book;
  className?: string;
  sizes?: string;
  enableLayout?: boolean;
}

export function BookCoverImage({ book, className, enableLayout = true }: BookCoverImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const layoutProps = enableLayout
    ? { layoutId: `cover-${book.id}`, transition: SHARED_ELEMENT_TRANSITION }
    : {};

  return (
    <motion.div
      {...layoutProps}
      className={cn(
        'relative overflow-hidden bg-muted',
        className,
      )}
    >
      {!loaded && !error && (
        <div className="absolute inset-0 shimmer" />
      )}

      {book.coverImage && !error ? (
        <img
          src={book.coverImage}
          alt={`Cover of ${book.title}`}
          loading="lazy"
          draggable={false}
          className="w-full h-full object-cover"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.3s' }}
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
    </motion.div>
  );
}
