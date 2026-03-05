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
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 30,
        delay: index * 0.06,
      }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
      onClick={onClick}
      className="book-card group cursor-pointer"
    >
      {/* Card with elevated premium feel */}
      <div className="relative bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-xl rounded-2xl overflow-hidden border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        {/* Subtle top highlight */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        {/* Hover glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/[0.08] via-transparent to-cyan-500/[0.08]" />
        </div>

        {/* 3D Book Display */}
        <div className="relative pt-6 pb-4 flex justify-center">
          <Book3D book={book} size="small" autoRotate={false} />
        </div>

        {/* Book Info */}
        <div className="relative px-4 pb-5">
          <motion.h3 
            className="font-semibold text-[15px] leading-snug text-white/95 line-clamp-2"
            layoutId={`book-title-${book.id}`}
          >
            {book.title}
          </motion.h3>
          <motion.p 
            className="text-white/45 text-[13px] mt-1.5 font-medium"
            layoutId={`book-author-${book.id}`}
          >
            {book.author}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
