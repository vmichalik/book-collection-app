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
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="fixed z-[101] bottom-24 left-1/2 -translate-x-1/2 pointer-events-none"
            >
              <div className="bg-foreground text-background px-4 py-2 rounded-md text-xs font-mono whitespace-nowrap shadow-lg">
                {milestone} books — {message}
              </div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}
