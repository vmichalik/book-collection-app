import { X, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TrayHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  onClose: () => void;
}

export function TrayHeader({ title, showBack = false, onBack, onClose }: TrayHeaderProps) {
  return (
    <div className="flex items-center justify-between px-5 pt-3 pb-2">
      {/* Drag indicator */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-muted-foreground/20" />

      <div className="flex items-center gap-2 mt-2">
        <AnimatePresence mode="wait">
          {showBack && onBack ? (
            <motion.button
              key="back"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onClick={onBack}
              className="p-1.5 -ml-1.5 rounded-full hover:bg-muted transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5 text-muted-foreground" />
            </motion.button>
          ) : null}
        </AnimatePresence>
        {title && (
          <h2 className="font-serif text-lg font-medium mt-0.5">{title}</h2>
        )}
      </div>

      <button
        onClick={onClose}
        className="p-1.5 rounded-full hover:bg-muted transition-colors mt-2"
        aria-label="Close"
      >
        <X className="h-5 w-5 text-muted-foreground" />
      </button>
    </div>
  );
}
