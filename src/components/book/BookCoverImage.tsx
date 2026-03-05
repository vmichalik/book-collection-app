import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { Book } from '@/types/book';

interface BookCoverImageProps {
  book: Book;
  className?: string;
}

export function BookCoverImage({ book, className }: BookCoverImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={cn('relative overflow-hidden bg-muted', className)}>
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
          className="w-full h-full flex flex-col items-center justify-center p-3 text-center text-white"
          style={{ background: book.spineColor || '#525252' }}
        >
          <p className="text-[11px] font-medium leading-snug line-clamp-3">{book.title}</p>
          <p className="text-[9px] text-white/60 mt-1 line-clamp-1">{book.author}</p>
        </div>
      )}
    </div>
  );
}
