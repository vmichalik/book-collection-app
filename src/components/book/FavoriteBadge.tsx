import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

interface FavoriteBadgeProps {
  favorited: boolean;
}

export function FavoriteBadge({ favorited }: FavoriteBadgeProps) {
  return (
    <AnimatePresence>
      {favorited && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          className="absolute top-2 right-2 z-10 p-1 rounded-full bg-white/90 shadow-sm"
        >
          <Heart className="h-3 w-3 fill-red-500 text-red-500" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
