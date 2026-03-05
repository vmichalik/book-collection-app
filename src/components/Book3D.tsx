import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import type { Book } from '../types/book';

interface Book3DProps {
  book: Book;
  size?: 'small' | 'medium' | 'large';
  autoRotate?: boolean;
  className?: string;
}

export function Book3D({ 
  book, 
  size = 'medium', 
  autoRotate = true,
  className = '' 
}: Book3DProps) {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Smaller dimensions for better floating effect
  const dimensions = {
    small: { width: 100, height: 150, depth: 22 },
    medium: { width: 160, height: 240, depth: 35 },
    large: { width: 220, height: 330, depth: 48 },
  }[size];

  const spineColor = book.spineColor || '#4a4a4a';
  const pageColor = '#f8f5f0';

  return (
    <div 
      ref={containerRef}
      className={`book-3d-wrapper ${className}`}
      style={{ 
        width: dimensions.width,
        height: dimensions.height + 60, // Extra space for floating effect
        perspective: '1500px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="book-3d"
        animate={{
          rotateY: isHovered ? 35 : autoRotate ? [20, 35, 20, 5, 20] : 25,
          rotateX: isHovered ? -8 : autoRotate ? [-5, -10, -5, -3, -5] : -5,
          y: isHovered ? -10 : [0, -15, 0], // Floating animation
        }}
        transition={{
          rotateY: { duration: isHovered ? 0.6 : 12, ease: isHovered ? 'easeOut' : 'easeInOut', repeat: isHovered ? 0 : Infinity },
          rotateX: { duration: isHovered ? 0.6 : 12, ease: isHovered ? 'easeOut' : 'easeInOut', repeat: isHovered ? 0 : Infinity },
          y: { duration: 4, ease: 'easeInOut', repeat: Infinity },
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
            borderRadius: '2px 3px 3px 2px',
            overflow: 'hidden',
            backfaceVisibility: 'hidden',
            boxShadow: 'inset 4px 0 8px rgba(0,0,0,0.15)',
          }}
        >
          {book.coverImage ? (
            <>
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-full object-cover"
                draggable={false}
              />
              {/* Lighting overlay */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(125deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.08) 35%, transparent 55%, rgba(0,0,0,0.1) 100%)',
                }}
              />
              {/* Spine shadow on left edge */}
              <div 
                className="absolute left-0 top-0 bottom-0 w-3 pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)',
                }}
              />
            </>
          ) : (
            <div 
              className="w-full h-full flex flex-col items-center justify-center p-6 text-center"
              style={{ background: spineColor }}
            >
              <p className="text-white font-serif text-base leading-tight">{book.title}</p>
              <p className="text-white/70 text-xs mt-2">{book.author}</p>
            </div>
          )}
        </div>

        {/* Back Cover */}
        <div
          className="book-face book-back"
          style={{
            position: 'absolute',
            width: dimensions.width,
            height: dimensions.height,
            transform: `rotateY(180deg) translateZ(${dimensions.depth / 2}px)`,
            background: spineColor,
            borderRadius: '3px 2px 2px 3px',
            backfaceVisibility: 'hidden',
            boxShadow: 'inset -4px 0 8px rgba(0,0,0,0.2)',
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
            background: spineColor,
            left: -dimensions.depth / 2,
            borderRadius: '2px',
            backfaceVisibility: 'hidden',
            backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.25) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.35) 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '6px 2px',
          }}
        >
          {/* Spine text */}
          <p 
            className="text-white/90 text-[10px] font-medium whitespace-nowrap tracking-wide"
            style={{ 
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              transform: 'rotate(180deg)',
              textShadow: '0 1px 2px rgba(0,0,0,0.4)',
            }}
          >
            {book.title.length > 35 ? book.title.slice(0, 35) + '...' : book.title}
          </p>
        </div>

        {/* Pages - Right edge (visible when rotated) */}
        <div
          className="book-face book-pages-right"
          style={{
            position: 'absolute',
            width: dimensions.depth - 2,
            height: dimensions.height - 4,
            transform: `rotateY(90deg) translateZ(${dimensions.width - dimensions.depth / 2 - 1}px)`,
            background: pageColor,
            top: 2,
            right: -dimensions.depth / 2 + 1,
            backgroundImage: `
              repeating-linear-gradient(90deg, 
                #f8f5f0 0px, 
                #f8f5f0 1px, 
                #e8e4dc 1px, 
                #e8e4dc 2px
              )
            `,
            borderRadius: '1px',
            boxShadow: 'inset 0 0 6px rgba(0,0,0,0.15)',
            backfaceVisibility: 'hidden',
          }}
        />

        {/* Pages - Top edge */}
        <div
          className="book-face book-pages-top"
          style={{
            position: 'absolute',
            width: dimensions.width - 4,
            height: dimensions.depth - 2,
            transform: `rotateX(90deg) translateZ(${dimensions.depth / 2 - 1}px)`,
            background: pageColor,
            top: -dimensions.depth / 2 + 1,
            left: 2,
            backgroundImage: `
              repeating-linear-gradient(0deg, 
                #f8f5f0 0px, 
                #f8f5f0 1px, 
                #e8e4dc 1px, 
                #e8e4dc 2px
              )
            `,
            borderRadius: '1px',
            backfaceVisibility: 'hidden',
          }}
        />

        {/* Pages - Bottom edge */}
        <div
          className="book-face book-pages-bottom"
          style={{
            position: 'absolute',
            width: dimensions.width - 4,
            height: dimensions.depth - 2,
            transform: `rotateX(-90deg) translateZ(${dimensions.height - dimensions.depth / 2 + 1}px)`,
            background: pageColor,
            bottom: -dimensions.depth / 2 + 1,
            left: 2,
            backgroundImage: `
              repeating-linear-gradient(0deg, 
                #f8f5f0 0px, 
                #f8f5f0 1px, 
                #e8e4dc 1px, 
                #e8e4dc 2px
              )
            `,
            borderRadius: '1px',
            backfaceVisibility: 'hidden',
          }}
        />
      </motion.div>

      {/* Soft shadow below floating book */}
      <motion.div
        className="book-shadow"
        animate={{
          scale: isHovered ? [0.9, 1] : [0.85, 0.95, 0.85],
          opacity: isHovered ? 0.3 : [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 4,
          ease: 'easeInOut',
          repeat: Infinity,
        }}
        style={{
          position: 'absolute',
          bottom: 10,
          left: '50%',
          width: dimensions.width * 0.9,
          height: 25,
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.4) 0%, transparent 70%)',
          transform: 'translateX(-50%) rotateX(70deg)',
          filter: 'blur(20px)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
