import { motion, AnimatePresence } from 'framer-motion';

interface TextMorphProps {
  text: string;
  className?: string;
}

export function TextMorph({ text, className }: TextMorphProps) {
  return (
    <span className={className} aria-label={text}>
      <AnimatePresence mode="popLayout">
        {text.split('').map((char, i) => (
          <motion.span
            key={`${char}-${i}-${text}`}
            initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
            transition={{ duration: 0.25, delay: i * 0.02 }}
            className="inline-block"
            style={{ whiteSpace: char === ' ' ? 'pre' : undefined }}
          >
            {char}
          </motion.span>
        ))}
      </AnimatePresence>
    </span>
  );
}
