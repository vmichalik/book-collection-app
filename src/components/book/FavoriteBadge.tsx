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
          className="absolute top-1.5 right-1.5 z-10"
        >
          <Heart className="h-3 w-3 fill-accent text-accent drop-shadow-sm" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
