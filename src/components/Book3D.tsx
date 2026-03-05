import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Book } from '../types/book';

interface Book3DProps {
  book: Book;
  size?: 'small' | 'medium' | 'large';
  autoRotate?: boolean;
  interactive?: boolean;
  className?: string;
}

export function Book3D({ 
  book, 
  size = 'medium', 
  autoRotate = false,
  interactive = true,
  className = '' 
}: Book3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: -15, y: 25 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const startRotation = useRef({ x: -15, y: 25 });

  const dimensions = {
    small: { width: 100, height: 150, depth: 20 },
    medium: { width: 160, height: 240, depth: 30 },
    large: { width: 220, height: 330, depth: 40 },
  }[size];

  // Auto rotation effect
  useEffect(() => {
    if (!autoRotate || isDragging) return;
    
    let angle = 0;
    const interval = setInterval(() => {
      angle += 0.5;
      setRotation({ x: -15, y: 25 + Math.sin(angle * 0.02) * 20 });
    }, 16);
    
    return () => clearInterval(interval);
  }, [autoRotate, isDragging]);

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (!interactive) return;
    setIsDragging(true);
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    dragStart.current = { x: clientX, y: clientY };
    startRotation.current = { ...rotation };
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging || !interactive) return;
    e.preventDefault();
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const deltaX = clientX - dragStart.current.x;
    const deltaY = clientY - dragStart.current.y;
    
    setRotation({
      x: Math.max(-45, Math.min(45, startRotation.current.x - deltaY * 0.5)),
      y: startRotation.current.y + deltaX * 0.5,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div 
      ref={containerRef}
      className={`book-3d-container ${className}`}
      style={{ 
        width: dimensions.width, 
        height: dimensions.height,
        perspective: '1000px',
      }}
      onMouseDown={handleTouchStart}
      onMouseMove={handleTouchMove}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <motion.div
        className="book-3d"
        animate={{
          rotateX: rotation.x,
          rotateY: rotation.y,
        }}
        transition={{
          type: isDragging ? 'tween' : 'spring',
          stiffness: 200,
          damping: 20,
        }}
        style={{
          width: dimensions.width,
          height: dimensions.height,
          transformStyle: 'preserve-3d',
          position: 'relative',
        }}
      >
        {/* Front Cover */}
        <div
          className="book-face book-front"
          style={{
            position: 'absolute',
            width: dimensions.width,
            height: dimensions.height,
            transform: `translateZ(${dimensions.depth / 2}px)`,
            borderRadius: '4px 8px 8px 4px',
            overflow: 'hidden',
            boxShadow: 'inset 4px 0 10px rgba(0,0,0,0.1)',
          }}
        >
          {book.coverImage ? (
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-full object-cover"
              draggable={false}
            />
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center p-4 text-center"
              style={{ background: book.spineColor || '#1a1a2e' }}
            >
              <div>
                <p className="text-white font-bold text-sm leading-tight">{book.title}</p>
                <p className="text-white/70 text-xs mt-1">{book.author}</p>
              </div>
            </div>
          )}
          {/* Cover shine effect */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)',
              borderRadius: '4px 8px 8px 4px',
            }}
          />
        </div>

        {/* Back Cover */}
        <div
          className="book-face book-back"
          style={{
            position: 'absolute',
            width: dimensions.width,
            height: dimensions.height,
            transform: `rotateY(180deg) translateZ(${dimensions.depth / 2}px)`,
            background: book.spineColor || '#1a1a2e',
            borderRadius: '8px 4px 4px 8px',
          }}
        />

        {/* Spine */}
        <div
          className="book-face book-spine"
          style={{
            position: 'absolute',
            width: dimensions.depth,
            height: dimensions.height,
            transform: `rotateY(-90deg) translateZ(${dimensions.depth / 2}px)`,
            background: book.spineColor || '#1a1a2e',
            left: -dimensions.depth / 2,
            borderRadius: '4px',
          }}
        >
          <div className="w-full h-full flex items-center justify-center px-1">
            <p 
              className="text-white text-xs font-medium whitespace-nowrap"
              style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
            >
              {book.title.length > 30 ? book.title.slice(0, 30) + '...' : book.title}
            </p>
          </div>
        </div>

        {/* Pages (right edge) */}
        <div
          className="book-face book-pages-right"
          style={{
            position: 'absolute',
            width: dimensions.depth - 4,
            height: dimensions.height - 8,
            transform: `rotateY(90deg) translateZ(${dimensions.width - dimensions.depth / 2}px)`,
            background: book.pageColor || '#f5f5f0',
            top: 4,
            right: -dimensions.depth / 2 + 2,
            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(0,0,0,0.03) 1px, rgba(0,0,0,0.03) 2px)',
            borderRadius: '2px',
          }}
        />

        {/* Pages (top edge) */}
        <div
          className="book-face book-pages-top"
          style={{
            position: 'absolute',
            width: dimensions.width - 4,
            height: dimensions.depth - 4,
            transform: `rotateX(90deg) translateZ(${dimensions.depth / 2 - 2}px)`,
            background: book.pageColor || '#f5f5f0',
            top: -dimensions.depth / 2 + 2,
            left: 2,
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.03) 1px, rgba(0,0,0,0.03) 2px)',
            borderRadius: '2px',
          }}
        />

        {/* Pages (bottom edge) */}
        <div
          className="book-face book-pages-bottom"
          style={{
            position: 'absolute',
            width: dimensions.width - 4,
            height: dimensions.depth - 4,
            transform: `rotateX(-90deg) translateZ(${dimensions.height - dimensions.depth / 2 + 2}px)`,
            background: book.pageColor || '#f5f5f0',
            bottom: -dimensions.depth / 2 + 2,
            left: 2,
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.03) 1px, rgba(0,0,0,0.03) 2px)',
            borderRadius: '2px',
          }}
        />
      </motion.div>

      {/* Shadow */}
      <div
        className="book-shadow"
        style={{
          position: 'absolute',
          bottom: -dimensions.depth / 2,
          left: '10%',
          width: '80%',
          height: '20px',
          background: 'radial-gradient(ellipse, rgba(0,0,0,0.3) 0%, transparent 70%)',
          transform: `rotateX(90deg) translateZ(-${dimensions.height / 2}px)`,
          filter: 'blur(8px)',
          opacity: isDragging ? 0.6 : 1,
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Interactive hint */}
      {interactive && !isDragging && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-white/40 whitespace-nowrap"
        >
          Drag to rotate
        </motion.div>
      )}
    </div>
  );
}
