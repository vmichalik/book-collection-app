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
  const [rotation, setRotation] = useState({ x: -5, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const startRotation = useRef({ x: -5, y: 20 });

  const dimensions = {
    small: { width: 85, height: 130, depth: 18, spine: 12 },
    medium: { width: 140, height: 210, depth: 28, spine: 18 },
    large: { width: 200, height: 300, depth: 38, spine: 24 },
  }[size];

  // Auto rotation effect
  useEffect(() => {
    if (!autoRotate || isDragging) return;
    
    let angle = 0;
    const interval = setInterval(() => {
      angle += 0.5;
      setRotation({ x: -5, y: 20 + Math.sin(angle * 0.02) * 15 });
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
      x: Math.max(-25, Math.min(25, startRotation.current.x - deltaY * 0.3)),
      y: startRotation.current.y + deltaX * 0.4,
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
        height: dimensions.height + 20,
        perspective: '1200px',
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
          stiffness: 180,
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
            borderRadius: '2px 6px 6px 2px',
            overflow: 'hidden',
            background: book.spineColor || '#1a1a2e',
          }}
        >
          {book.coverImage ? (
            <>
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-full object-cover"
                draggable={false}
                onLoad={() => setImageLoaded(true)}
                style={{ opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.3s' }}
              />
              {!imageLoaded && (
                <div 
                  className="absolute inset-0 animate-pulse"
                  style={{ background: book.spineColor || '#1a1a2e' }}
                />
              )}
            </>
          ) : (
            <div 
              className="w-full h-full flex flex-col items-center justify-center p-4 text-center"
              style={{ background: book.spineColor || '#1a1a2e' }}
            >
              <p className="text-white font-bold text-sm leading-tight line-clamp-3">{book.title}</p>
              <p className="text-white/60 text-xs mt-2">{book.author}</p>
            </div>
          )}
          {/* Cover lighting */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(115deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 30%, transparent 50%, rgba(0,0,0,0.1) 100%)',
              borderRadius: '2px 6px 6px 2px',
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
            borderRadius: '6px 2px 2px 6px',
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
            borderRadius: '2px',
            backgroundImage: `linear-gradient(90deg, rgba(255,255,255,0.1) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.2) 100%)`,
          }}
        >
          <div className="w-full h-full flex items-center justify-center px-1">
            <p 
              className="text-white/90 text-xs font-medium whitespace-nowrap tracking-wide"
              style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
            >
              {book.title.length > 35 ? book.title.slice(0, 35) + '...' : book.title}
            </p>
          </div>
        </div>

        {/* Pages - Right edge */}
        <div
          className="book-face book-pages-right"
          style={{
            position: 'absolute',
            width: dimensions.depth - 4,
            height: dimensions.height - 6,
            transform: `rotateY(90deg) translateZ(${dimensions.width - dimensions.depth / 2}px)`,
            background: book.pageColor || '#f5f5f0',
            top: 3,
            right: -dimensions.depth / 2 + 2,
            backgroundImage: `
              repeating-linear-gradient(90deg, 
                #f5f5f0 0px, 
                #f5f5f0 1px, 
                #e8e8e0 1px, 
                #e8e8e0 2px
              )
            `,
            borderRadius: '1px',
            boxShadow: 'inset 0 0 5px rgba(0,0,0,0.1)',
          }}
        />

        {/* Pages - Top edge */}
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
            backgroundImage: `
              repeating-linear-gradient(0deg, 
                #f5f5f0 0px, 
                #f5f5f0 1px, 
                #e8e8e0 1px, 
                #e8e8e0 2px
              )
            `,
            borderRadius: '1px',
          }}
        />

        {/* Pages - Bottom edge */}
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
            backgroundImage: `
              repeating-linear-gradient(0deg, 
                #f5f5f0 0px, 
                #f5f5f0 1px, 
                #e8e8e0 1px, 
                #e8e8e0 2px
              )
            `,
            borderRadius: '1px',
          }}
        />
      </motion.div>

      {/* Soft shadow */}
      <div
        className="book-shadow"
        style={{
          position: 'absolute',
          bottom: -8,
          left: '50%',
          width: dimensions.width * 0.8,
          height: 16,
          background: 'radial-gradient(ellipse, rgba(0,0,0,0.25) 0%, transparent 70%)',
          transform: `translateX(-50%) rotateX(90deg)`,
          filter: 'blur(12px)',
          opacity: isDragging ? 0.4 : 0.7,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
        }}
      />

      {/* Interactive hint */}
      {interactive && !isDragging && size === 'large' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-white/30 whitespace-nowrap"
        >
          Drag to rotate
        </motion.div>
      )}
    </div>
  );
}
