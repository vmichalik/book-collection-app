import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { TRAY_TRANSITION } from '@/lib/animations';
import { useSwipeDown } from '@/hooks/useSwipeDown';
import { cn } from '@/lib/utils';

interface TrayProps {
  children: React.ReactNode;
  height?: string;
  onClose: () => void;
  className?: string;
}

export function Tray({ children, height = '85vh', onClose, className }: TrayProps) {
  const { containerRef, handlers } = useSwipeDown({ onDismiss: onClose });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <motion.div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={TRAY_TRANSITION}
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50',
        'bg-card rounded-t-xl border-t border-border',
        'overflow-y-auto overscroll-contain',
        className,
      )}
      style={{ maxHeight: height }}
      onClick={(e) => e.stopPropagation()}
      {...handlers}
    >
      {children}
    </motion.div>
  );
}
