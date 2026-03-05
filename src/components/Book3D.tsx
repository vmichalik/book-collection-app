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

  const dimensions = {
    small: { width: 120, height: 180, depth: 25 },
    medium: { width: 200, height: 300, depth: 40 },
    large: { width: 280, height: 420, depth: 55 },
  }[size];

  // Generate spine color from cover image or use book's spine color
  const spineColor = book.spineColor || '#4a4a4a';
  const pageColor = '#f5f0e8';

  return (
    <div 
      ref={containerRef}
      className={`book-3d-wrapper ${className}`}
      style={{ 
        width: dimensions.width,
        height: dimensions.height + 40, // Extra space for shadow
        perspective: '1200px',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="book-3d"
        animate={{
          rotateY: isHovered ? 25 : autoRotate ? [15, 25, 15] : 20,
          rotateX: isHovered ? -5 : autoRotate ? [-3, -8, -3] : -5,
        }}
        transition={{
          rotateY: { duration: isHovered ? 0.5 : 6, ease: isHovered ? 'easeOut' : 'easeInOut', repeat: isHovered ? 0 : Infinity },
          rotateX: { duration: isHovered ? 0.5 : 6, ease: isHovered ? 'easeOut' : 'easeInOut', repeat: isHovered ? 0 : Infinity },
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
            borderRadius: '2px 4px 4px 2px',
            overflow: 'hidden',
            backfaceVisibility: 'hidden',
          }}
        >
          {book.coverImage ? (
            <>
              {/* Main cover image */}
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-full object-cover"
                draggable={false}
              />
              {/* Gloss/sheen overlay */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 40%, transparent 60%, rgba(0,0,0,0.1) 100%)',
                  borderRadius: '2px 4px 4px 2px',
                }}
              />
              {/* Spine edge shadow on cover */}
              <div 
                className="absolute left-0 top-0 bottom-0 w-2 pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, rgba(0,0,0,0.3) 0%, transparent 100%)',
                }}
              />
            </>
          ) : (
            <div 
              className="w-full h-full flex flex-col items-center justify-center p-6 text-center"
              style={{ background: spineColor }}
            >
              <p className="text-white font-serif text-lg leading-tight">{book.title}</p>
              <p className="text-white/70 text-sm mt-2">{book.author}</p>
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
            borderRadius: '4px 2px 2px 4px',
            backfaceVisibility: 'hidden',
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
            backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.2) 0%, transparent 15%, transparent 85%, rgba(0,0,0,0.3) 100%)`,
            backfaceVisibility: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px 4px',
          }}
        >
          {/* Spine text */}
          <p 
            className="text-white/90 text-xs font-medium whitespace-nowrap"
            style={{ 
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              transform: 'rotate(180deg)',
              textShadow: '0 1px 2px rgba(0,0,0,0.3)',
            }}
          >
            {book.title.length > 40 ? book.title.slice(0, 40) + '...' : book.title}
          </p>
        </div>

        {/* Pages - Right edge */}
        <div
          className="book-face book-pages-right"
          style={{
            position: 'absolute',
            width: dimensions.depth - 3,
            height: dimensions.height - 6,
            transform: `rotateY(90deg) translateZ(${dimensions.width - dimensions.depth / 2 - 1}px)`,
            background: pageColor,
            top: 3,
            right: -dimensions.depth / 2 + 1,
            backgroundImage: `
              repeating-linear-gradient(90deg, 
                ${pageColor} 0px, 
                ${pageColor} 1px, 
                #e8e4dc 1px, 
                #e8e4dc 2px
              )
            `,
            borderRadius: '1px',
            boxShadow: 'inset 0 0 4px rgba(0,0,0,0.1)',
            backfaceVisibility: 'hidden',
          }}
        />

        {/* Pages - Top edge */}
        <div
          className="book-face book-pages-top"
          style={{
            position: 'absolute',
            width: dimensions.width - 6,
            height: dimensions.depth - 3,
            transform: `rotateX(90deg) translateZ(${dimensions.depth / 2 - 1}px)`,
            background: pageColor,
            top: -dimensions.depth / 2 + 1,
            left: 3,
            backgroundImage: `
              repeating-linear-gradient(0deg, 
                ${pageColor} 0px, 
                ${pageColor} 1px, 
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
            width: dimensions.width - 6,
            height: dimensions.depth - 3,
            transform: `rotateX(-90deg) translateZ(${dimensions.height - dimensions.depth / 2 + 1}px)`,
            background: pageColor,
            bottom: -dimensions.depth / 2 + 1,
            left: 3,
            backgroundImage: `
              repeating-linear-gradient(0deg, 
                ${pageColor} 0px, 
                ${pageColor} 1px, 
                #e8e4dc 1px, 
                #e8e4dc 2px
              )
            `,
            borderRadius: '1px',
            backfaceVisibility: 'hidden',
          }}
        />
      </motion.div>

      {/* Floating shadow */}
      <div
        className="book-shadow"
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          width: dimensions.width * 0.85,
          height: 20,
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, transparent 70%)',
          transform: 'translateX(-50%) rotateX(75deg)',
          filter: 'blur(15px)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
