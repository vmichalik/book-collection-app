import { useState } from 'react';
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

  const dimensions = {
    small: { width: 90, height: 135, depth: 18, coverWidth: 60 },
    medium: { width: 140, height: 210, depth: 28, coverWidth: 95 },
    large: { width: 180, height: 270, depth: 36, coverWidth: 120 },
  }[size];

  const spineColor = book.spineColor || '#3d3d3d';
  const pageColor = '#fdfbf7';

  return (
    <div 
      className={`book-3d-container ${className}`}
      style={{ 
        width: dimensions.coverWidth * 2.5,
        height: dimensions.height + 80,
        perspective: '1200px',
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
          rotateY: isHovered ? 45 : autoRotate ? [25, 45, 25, 5, 25] : 30,
          rotateX: isHovered ? -10 : autoRotate ? [-5, -12, -5, -2, -5] : -5,
          y: isHovered ? -20 : [0, -12, 0],
        }}
        transition={{
          rotateY: { duration: isHovered ? 0.5 : 10, ease: isHovered ? 'easeOut' : 'easeInOut', repeat: isHovered ? 0 : Infinity },
          rotateX: { duration: isHovered ? 0.5 : 10, ease: isHovered ? 'easeOut' : 'easeInOut', repeat: isHovered ? 0 : Infinity },
          y: { duration: 3, ease: 'easeInOut', repeat: Infinity },
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
          style={{
            position: 'absolute',
            width: dimensions.coverWidth,
            height: dimensions.height,
            transform: `translateZ(${dimensions.depth / 2}px)`,
            borderRadius: '1px 2px 2px 1px',
            overflow: 'hidden',
            backfaceVisibility: 'hidden',
            left: (dimensions.width - dimensions.coverWidth) / 2,
          }}
        >
          {book.coverImage ? (
            <>
              <img
                src={book.coverImage}
                alt={book.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
                draggable={false}
              />
              {/* Lighting sheen */}
              <div 
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(125deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 30%, transparent 50%, rgba(0,0,0,0.15) 100%)',
                  pointerEvents: 'none',
                }}
              />
              {/* Spine edge shadow */}
              <div 
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 4,
                  background: 'linear-gradient(90deg, rgba(0,0,0,0.4) 0%, transparent 100%)',
                  pointerEvents: 'none',
                }}
              />
            </>
          ) : (
            <div 
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 8,
                textAlign: 'center',
                background: spineColor,
              }}
            >
              <p style={{ color: 'white', fontFamily: 'Cormorant Garamond, serif', fontSize: 14, lineHeight: 1.2 }}>{book.title}</p>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, marginTop: 4 }}>{book.author}</p>
            </div>
          )}
        </div>

        {/* Back Cover */}
        <div
          style={{
            position: 'absolute',
            width: dimensions.coverWidth,
            height: dimensions.height,
            transform: `rotateY(180deg) translateZ(${dimensions.depth / 2}px)`,
            background: `linear-gradient(135deg, ${spineColor} 0%, ${adjustColor(spineColor, -20)} 100%)`,
            borderRadius: '2px 1px 1px 2px',
            backfaceVisibility: 'hidden',
            left: (dimensions.width - dimensions.coverWidth) / 2,
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.3)',
          }}
        />

        {/* Spine */}
        <div
          style={{
            position: 'absolute',
            width: dimensions.depth,
            height: dimensions.height,
            transform: `rotateY(-90deg) translateZ(${dimensions.depth / 2}px)`,
            background: `linear-gradient(90deg, ${adjustColor(spineColor, -30)} 0%, ${spineColor} 20%, ${spineColor} 80%, ${adjustColor(spineColor, -40)} 100%)`,
            left: (dimensions.width - dimensions.coverWidth) / 2 - dimensions.depth / 2,
            borderRadius: '1px',
            backfaceVisibility: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px 2px',
          }}
        >
          {/* Spine title */}
          <p 
            style={{
              color: 'rgba(255,255,255,0.95)',
              fontSize: 9,
              fontWeight: 500,
              letterSpacing: '0.5px',
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              transform: 'rotate(180deg)',
              textShadow: '0 1px 3px rgba(0,0,0,0.5)',
              whiteSpace: 'nowrap',
            }}
          >
            {book.title.length > 30 ? book.title.slice(0, 30) + '…' : book.title}
          </p>
        </div>

        {/* Pages - Right edge */}
        <div
          style={{
            position: 'absolute',
            width: dimensions.depth - 2,
            height: dimensions.height - 4,
            transform: `rotateY(90deg) translateZ(${(dimensions.width - dimensions.coverWidth) / 2 + dimensions.coverWidth - dimensions.depth / 2 - 1}px)`,
            background: pageColor,
            top: 2,
            backgroundImage: `
              repeating-linear-gradient(90deg, 
                #fdfbf7 0px, 
                #fdfbf7 1px, 
                #f0ece4 1px, 
                #f0ece4 2px
              )
            `,
            borderRadius: '0 1px 1px 0',
            boxShadow: 'inset 2px 0 4px rgba(0,0,0,0.1)',
            backfaceVisibility: 'hidden',
          }}
        />

        {/* Pages - Top */}
        <div
          style={{
            position: 'absolute',
            width: dimensions.coverWidth - 4,
            height: dimensions.depth - 2,
            transform: `rotateX(90deg) translateZ(${dimensions.depth / 2 - 1}px)`,
            background: pageColor,
            top: -dimensions.depth / 2 + 1,
            left: (dimensions.width - dimensions.coverWidth) / 2 + 2,
            backgroundImage: `
              repeating-linear-gradient(0deg, 
                #fdfbf7 0px, 
                #fdfbf7 1px, 
                #f0ece4 1px, 
                #f0ece4 2px
              )
            `,
            borderRadius: '1px',
            backfaceVisibility: 'hidden',
          }}
        />

        {/* Pages - Bottom */}
        <div
          style={{
            position: 'absolute',
            width: dimensions.coverWidth - 4,
            height: dimensions.depth - 2,
            transform: `rotateX(-90deg) translateZ(${dimensions.height - dimensions.depth / 2 + 1}px)`,
            background: pageColor,
            bottom: -dimensions.depth / 2 + 1,
            left: (dimensions.width - dimensions.coverWidth) / 2 + 2,
            backgroundImage: `
              repeating-linear-gradient(0deg, 
                #fdfbf7 0px, 
                #fdfbf7 1px, 
                #f0ece4 1px, 
                #f0ece4 2px
              )
            `,
            borderRadius: '1px',
            backfaceVisibility: 'hidden',
          }}
        />
      </motion.div>

      {/* Soft ambient shadow */}
      <motion.div
        animate={{
          scale: isHovered ? [0.9, 1] : [0.8, 0.9, 0.8],
          opacity: isHovered ? 0.25 : [0.15, 0.22, 0.15],
        }}
        transition={{
          duration: 3,
          ease: 'easeInOut',
          repeat: Infinity,
        }}
        style={{
          position: 'absolute',
          bottom: 15,
          left: '50%',
          width: dimensions.coverWidth * 1.2,
          height: 30,
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, transparent 70%)',
          transform: 'translateX(-50%) rotateX(75deg)',
          filter: 'blur(25px)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

// Helper to darken a hex color
function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
  const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}
