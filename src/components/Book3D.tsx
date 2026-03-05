import { useState } from 'react';
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
  className = '' 
}: Book3DProps) {
  const [rotation, setRotation] = useState({ x: -5, y: 15 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const dimensions = {
    small: { width: 100, height: 150, depth: 15 },
    medium: { width: 160, height: 240, depth: 24 },
    large: { width: 220, height: 330, depth: 32 },
  }[size];

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotation({
      x: -y * 20 - 5,
      y: x * 30 + 15,
    });
  };

  const handleMouseLeave = () => {
    setRotation({ x: -5, y: 15 });
  };

  return (
    <div 
      className={`relative ${className}`}
      style={{ 
        width: dimensions.width, 
        height: dimensions.height,
        perspective: '1000px',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="relative"
        animate={{
          rotateX: rotation.x,
          rotateY: rotation.y,
        }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 20,
        }}
        style={{
          width: dimensions.width,
          height: dimensions.height,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Front Cover */}
        <div
          style={{
            position: 'absolute',
            width: dimensions.width,
            height: dimensions.height,
            transform: `translateZ(${dimensions.depth / 2}px)`,
            borderRadius: '3px 6px 6px 3px',
            overflow: 'hidden',
            background: book.spineColor || '#1a1a2e',
          }}
        >
          {!imageLoaded && !imageError && book.coverImage && (
            <div className="absolute inset-0 bg-white/10 animate-pulse" />
          )}
          
          {book.coverImage && !imageError ? (
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-full object-cover"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              style={{ opacity: imageLoaded ? 1 : 0 }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center">
              <p className="text-white font-bold text-xs leading-tight">{book.title}</p>
              <p className="text-white/60 text-[10px] mt-1">{book.author}</p>
            </div>
          )}
          
          {/* Cover highlight */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(120deg, rgba(255,255,255,0.15) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.1) 100%)',
            }}
          />
        </div>

        {/* Spine */}
        <div
          style={{
            position: 'absolute',
            width: dimensions.depth,
            height: dimensions.height,
            transform: `rotateY(-90deg) translateZ(${dimensions.depth / 2}px)`,
            background: book.spineColor || '#1a1a2e',
            left: -dimensions.depth / 2,
            borderRadius: '3px',
          }}
        />

        {/* Pages - visible edge */}
        <div
          style={{
            position: 'absolute',
            width: dimensions.depth - 2,
            height: dimensions.height - 4,
            transform: `rotateY(90deg) translateZ(${dimensions.width - dimensions.depth / 2}px)`,
            background: '#f5f0e8',
            top: 2,
            right: -dimensions.depth / 2 + 1,
            borderRadius: '2px',
            backgroundImage: 'repeating-linear-gradient(90deg, #f5f0e8 0px, #f5f0e8 1px, #e8e4dc 1px, #e8e4dc 2px)',
          }}
        />
      </motion.div>

      {/* Shadow */}
      <div
        style={{
          position: 'absolute',
          bottom: -10,
          left: '50%',
          width: dimensions.width * 0.7,
          height: 12,
          background: 'radial-gradient(ellipse, rgba(0,0,0,0.3) 0%, transparent 70%)',
          transform: 'translateX(-50%)',
          filter: 'blur(8px)',
        }}
      />
    </div>
  );
}
