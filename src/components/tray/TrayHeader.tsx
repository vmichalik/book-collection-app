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
    <div className="relative flex items-center justify-between px-5 pt-4 pb-3">
      {/* Drag indicator */}
      <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-foreground/10" />

      <div className="flex items-center gap-2">
        <AnimatePresence mode="wait">
          {showBack && onBack ? (
            <motion.button
              key="back"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              onClick={onBack}
              className="p-1 -ml-1 rounded hover:bg-muted transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4 text-muted-foreground" />
            </motion.button>
          ) : null}
        </AnimatePresence>
        {title && (
          <h2 className="text-[11px] font-mono font-medium uppercase tracking-widest text-muted-foreground">
            {title}
          </h2>
        )}
      </div>

      <button
        onClick={onClose}
        className="p-1 rounded hover:bg-muted transition-colors"
        aria-label="Close"
      >
        <X className="h-4 w-4 text-muted-foreground" />
      </button>
    </div>
  );
}
