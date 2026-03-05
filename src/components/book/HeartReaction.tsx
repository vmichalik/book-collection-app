import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { heartVariants } from '@/lib/animations';

interface HeartReactionProps {
  x: number;
  y: number;
  onDone: () => void;
}

export function HeartReaction({ x, y, onDone }: HeartReactionProps) {
  return (
    <motion.div
      className="absolute z-20 pointer-events-none"
      style={{ left: x - 16, top: y - 16 }}
      variants={heartVariants}
      initial="initial"
      animate="animate"
      onAnimationComplete={onDone}
    >
      <Heart className="h-8 w-8 fill-red-500 text-red-500 drop-shadow-lg" />
    </motion.div>
  );
}
