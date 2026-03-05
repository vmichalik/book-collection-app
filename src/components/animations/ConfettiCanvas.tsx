import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { launchConfetti } from '@/lib/confetti';
import { getMilestoneMessage } from '@/lib/milestones';

interface ConfettiCanvasProps {
  milestone: number | null;
  onDone: () => void;
}

export function ConfettiCanvas({ milestone, onDone }: ConfettiCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (milestone && canvasRef.current) {
      launchConfetti(canvasRef.current, 2500);
      const timer = setTimeout(onDone, 3000);
      return () => clearTimeout(timer);
    }
  }, [milestone, onDone]);

  const message = milestone ? getMilestoneMessage(milestone) : null;

  return (
    <AnimatePresence>
      {milestone && (
        <>
          <canvas
            ref={canvasRef}
            className="fixed inset-0 z-[100] pointer-events-none"
          />
          {message && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="fixed z-[101] bottom-32 left-1/2 -translate-x-1/2 pointer-events-none"
            >
              <div className="bg-foreground text-background px-6 py-3 rounded-full shadow-2xl text-sm font-medium whitespace-nowrap">
                {milestone} books! {message}
              </div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}
