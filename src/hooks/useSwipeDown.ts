import { useRef, useCallback, type RefObject } from 'react';

interface UseSwipeDownOptions {
  onDismiss: () => void;
  threshold?: number;
}

export function useSwipeDown({ onDismiss, threshold = 100 }: UseSwipeDownOptions) {
  const startY = useRef(0);
  const currentY = useRef(0);
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const el = containerRef.current;
    // Only start swipe if scrolled to top
    if (el && el.scrollTop > 0) return;
    startY.current = e.touches[0].clientY;
    currentY.current = 0;
    isDragging.current = true;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const diff = e.touches[0].clientY - startY.current;
    if (diff < 0) {
      currentY.current = 0;
      return;
    }
    currentY.current = diff;
    const el = containerRef.current;
    if (el) {
      el.style.transform = `translateY(${diff * 0.5}px)`;
      el.style.transition = 'none';
    }
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const el = containerRef.current;
    if (el) {
      el.style.transition = 'transform 0.3s cubic-bezier(0.19, 1, 0.22, 1)';
      if (currentY.current > threshold) {
        el.style.transform = 'translateY(100%)';
        setTimeout(onDismiss, 200);
      } else {
        el.style.transform = 'translateY(0)';
      }
    }
    currentY.current = 0;
  }, [onDismiss, threshold]);

  return {
    containerRef: containerRef as RefObject<HTMLDivElement>,
    handlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    },
  };
}
