import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Book } from '../types/book';

interface BookCardProps {
  book: Book;
  onClick: () => void;
  index?: number;
}

export function BookCard({ book, onClick, index = 0 }: BookCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      layoutId={`book-card-${book.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 30,
        delay: index * 0.05,
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="cursor-pointer group"
    >
      {/* Card Container */}
      <div className="relative bg-white/[0.04] rounded-2xl overflow-hidden border border-white/[0.06] transition-all duration-300 hover:bg-white/[0.06] hover:border-white/[0.10]">
        {/* Book Cover Image */}
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-black/20">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-white/[0.05] animate-pulse" />
          )}
          
          {book.coverImage && !imageError ? (
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              style={{ opacity: imageLoaded ? 1 : 0 }}
            />
          ) : (
            <div 
              className="w-full h-full flex flex-col items-center justify-center p-4 text-center"
              style={{ background: book.spineColor || '#1a1a2e' }}
            >
              <p className="text-white font-semibold text-sm leading-snug line-clamp-3">{book.title}</p>
              <p className="text-white/60 text-xs mt-2">{book.author}</p>
            </div>
          )}
          
          {/* Gradient overlay at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* Book Info - positioned over the gradient */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-semibold text-white text-[15px] leading-snug line-clamp-2 drop-shadow-lg">
            {book.title}
          </h3>
          <p className="text-white/70 text-[13px] mt-1 line-clamp-1">
            {book.author}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
