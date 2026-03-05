import { motion } from 'framer-motion';
import { BACKDROP_TRANSITION } from '@/lib/animations';

interface TrayBackdropProps {
  onClose: () => void;
}

export function TrayBackdrop({ onClose }: TrayBackdropProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={BACKDROP_TRANSITION}
      className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs"
      onClick={onClose}
      aria-hidden="true"
    />
  );
}
