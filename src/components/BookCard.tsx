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
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      onClick={onClick}
      className="group cursor-pointer"
    >
      {/* Book Cover Container */}
      <div className="relative aspect-[2/3] mb-4 overflow-hidden bg-[#e8e4dc] rounded-sm shadow-[0_2px_8px_rgba(0,0,0,0.06)] group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-shadow duration-500">
        {/* Loading State */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-[#e8e4dc] animate-pulse" />
        )}
        
        {/* Book Cover Image */}
        {book.coverImage && !imageError ? (
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            style={{ opacity: imageLoaded ? 1 : 0 }}
          />
        ) : (
          /* Fallback Cover */
          <div 
            className="w-full h-full flex flex-col items-center justify-center p-6 text-center"
            style={{ background: book.spineColor || '#8b7355' }}
          >
            <p className="font-serif text-white text-lg leading-snug line-clamp-3">
              {book.title}
            </p>
            <p className="text-white/70 text-xs mt-2 font-light tracking-wide uppercase">
              {book.author}
            </p>
          </div>
        )}

        {/* Subtle Overlay on Hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.02] transition-colors duration-500" />
      </div>

      {/* Book Info - Below Cover */}
      <div className="space-y-1">
        <h3 className="font-serif text-[17px] leading-snug text-[#1a1a1a] line-clamp-2 group-hover:text-[#8b7355] transition-colors duration-300">
          {book.title}
        </h3>
        <p className="text-[13px] text-[#666666] font-light">
          {book.author}
        </p>
      </div>
    </motion.div>
  );
}
