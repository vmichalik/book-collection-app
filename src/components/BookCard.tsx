import { motion } from 'framer-motion';
import type { Book } from '../types/book';
import { Book3D } from './Book3D';

interface BookCardProps {
  book: Book;
  onClick: () => void;
  index?: number;
}

export function BookCard({ book, onClick, index = 0 }: BookCardProps) {
  return (
    <motion.div
      layoutId={`book-card-${book.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 25,
        delay: index * 0.05,
      }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="book-card group cursor-pointer"
    >
      {/* Card Container with premium glass effect */}
      <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/20">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        
        {/* Glow effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/10" />
        </div>

        {/* 3D Book Display */}
        <div className="relative p-6 pb-4 flex justify-center">
          <Book3D book={book} size="small" autoRotate={false} />
        </div>

        {/* Book Info */}
        <div className="relative px-5 pb-5">
          <motion.h3 
            className="font-semibold text-white text-base leading-tight line-clamp-2"
            layoutId={`book-title-${book.id}`}
          >
            {book.title}
          </motion.h3>
          <motion.p 
            className="text-white/50 text-sm mt-1"
            layoutId={`book-author-${book.id}`}
          >
            {book.author}
          </motion.p>
          
          {/* Date badge */}
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs text-white/30">
              Added {new Date(book.createdAt).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </motion.div>
  );
}
