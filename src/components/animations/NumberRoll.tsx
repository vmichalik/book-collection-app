import { motion, AnimatePresence } from 'framer-motion';

interface NumberRollProps {
  value: number;
  className?: string;
}

export function NumberRoll({ value, className }: NumberRollProps) {
  const digits = String(value).split('');

  return (
    <span className={`inline-flex overflow-hidden ${className || ''}`} aria-label={String(value)}>
      <AnimatePresence mode="popLayout">
        {digits.map((digit, i) => (
          <motion.span
            key={`${i}-${digit}`}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 30,
              delay: i * 0.05,
            }}
            className="inline-block tabular-nums"
          >
            {digit}
          </motion.span>
        ))}
      </AnimatePresence>
    </span>
  );
}
