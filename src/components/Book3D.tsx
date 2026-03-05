import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Book } from '@/types/book';

interface Book3DProps {
  book: Book;
  size?: 'sm' | 'md' | 'lg';
  autoRotate?: boolean;
  className?: string;
}

export function Book3D({ 
  book, 
  size = 'md', 
  autoRotate = true,
  className 
}: Book3DProps) {
  const [isHovered, setIsHovered] = useState(false);

  const dims = {
    sm: { w: 85, h: 128, d: 18, coverW: 56 },
    md: { w: 130, h: 195, d: 26, coverW: 86 },
    lg: { w: 170, h: 255, d: 34, coverW: 112 },
  }[size];

  const spine = book.spineColor || '#3d3d3d';
  const pages = '#faf8f5';

  return (
    <div 
      className={cn("relative flex items-center justify-center", className)}
      style={{ 
        width: dims.coverW * 2.2,
        height: dims.h + 50,
        perspective: '1200px',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="relative"
        style={{
          width: dims.w,
          height: dims.h,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          rotateY: isHovered ? 40 : autoRotate ? [22, 40, 22, 5, 22] : 25,
          rotateX: isHovered ? -8 : autoRotate ? [-4, -10, -4, -2, -4] : -4,
          y: isHovered ? -12 : [0, -8, 0],
        }}
        transition={{
          rotateY: { duration: isHovered ? 0.5 : 10, ease: isHovered ? 'easeOut' : 'easeInOut', repeat: isHovered ? 0 : Infinity },
          rotateX: { duration: isHovered ? 0.5 : 10, ease: isHovered ? 'easeOut' : 'easeInOut', repeat: isHovered ? 0 : Infinity },
          y: { duration: 3, ease: 'easeInOut', repeat: Infinity },
        }}
      >
        {/* Front Cover */}
        <div
          className="book-face absolute overflow-hidden"
          style={{
            width: dims.coverW,
            height: dims.h,
            left: (dims.w - dims.coverW) / 2,
            transform: `translateZ(${dims.d / 2}px)`,
            borderRadius: '1px 2px 2px 1px',
            backfaceVisibility: 'hidden',
            boxShadow: 'inset 3px 0 6px rgba(0,0,0,0.2)',
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
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/5 to-transparent pointer-events-none" />
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-r from-black/40 to-transparent pointer-events-none" />
            </>
          ) : (
            <div 
              className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-white"
              style={{ background: spine }}
            >
              <p className="font-serif text-sm leading-tight">{book.title}</p>
              <p className="text-xs text-white/70 mt-1">{book.author}</p>
            </div>
          )}
        </div>

        {/* Back Cover */}
        <div
          className="book-face absolute"
          style={{
            width: dims.coverW,
            height: dims.h,
            left: (dims.w - dims.coverW) / 2,
            transform: `rotateY(180deg) translateZ(${dims.d / 2}px)`,
            borderRadius: '2px 1px 1px 2px',
            backfaceVisibility: 'hidden',
            background: `linear-gradient(135deg, ${spine} 0%, ${shade(spine, -25)} 100%)`,
            boxShadow: 'inset -3px 0 10px rgba(0,0,0,0.3)',
          }}
        />

        {/* Spine */}
        <div
          className="book-face absolute flex items-center justify-center"
          style={{
            width: dims.d,
            height: dims.h,
            left: (dims.w - dims.coverW) / 2 - dims.d / 2,
            transform: `rotateY(-90deg) translateZ(${dims.d / 2}px)`,
            borderRadius: '1px',
            backfaceVisibility: 'hidden',
            background: `linear-gradient(90deg, ${shade(spine, -35)} 0%, ${spine} 15%, ${spine} 85%, ${shade(spine, -45)} 100%)`,
          }}
        >
          <p 
            className="text-white/90 text-[9px] font-medium tracking-wide"
            style={{ 
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              transform: 'rotate(180deg)',
              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
            }}
          >
            {book.title.slice(0, 32)}{book.title.length > 32 ? '…' : ''}
          </p>
        </div>

        {/* Pages - Right */}
        <div
          className="book-face absolute"
          style={{
            width: dims.d - 2,
            height: dims.h - 4,
            top: 2,
            transform: `rotateY(90deg) translateZ(${(dims.w - dims.coverW) / 2 + dims.coverW - dims.d / 2 - 1}px)`,
            borderRadius: '0 1px 1px 0',
            backfaceVisibility: 'hidden',
            background: pages,
            backgroundImage: `repeating-linear-gradient(90deg, ${pages} 0px, ${pages} 1px, #ebe7e0 1px, #ebe7e0 2px)`,
            boxShadow: 'inset 2px 0 4px rgba(0,0,0,0.08)',
          }}
        />

        {/* Pages - Top */}
        <div
          className="book-face absolute"
          style={{
            width: dims.coverW - 3,
            height: dims.d - 2,
            top: -dims.d / 2 + 1,
            left: (dims.w - dims.coverW) / 2 + 1,
            transform: `rotateX(90deg) translateZ(${dims.d / 2 - 1}px)`,
            borderRadius: '1px',
            backfaceVisibility: 'hidden',
            background: pages,
            backgroundImage: `repeating-linear-gradient(0deg, ${pages} 0px, ${pages} 1px, #ebe7e0 1px, #ebe7e0 2px)`,
          }}
        />

        {/* Pages - Bottom */}
        <div
          className="book-face absolute"
          style={{
            width: dims.coverW - 3,
            height: dims.d - 2,
            bottom: -dims.d / 2 + 1,
            left: (dims.w - dims.coverW) / 2 + 1,
            transform: `rotateX(-90deg) translateZ(${dims.h - dims.d / 2 + 1}px)`,
            borderRadius: '1px',
            backfaceVisibility: 'hidden',
            background: pages,
            backgroundImage: `repeating-linear-gradient(0deg, ${pages} 0px, ${pages} 1px, #ebe7e0 1px, #ebe7e0 2px)`,
          }}
        />
      </motion.div>

      {/* Shadow */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          bottom: 8,
          left: '50%',
          width: dims.coverW,
          height: 20,
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.4) 0%, transparent 70%)',
          filter: 'blur(15px)',
          transform: 'translateX(-50%) rotateX(70deg)',
        }}
        animate={{
          scale: isHovered ? [0.9, 1] : [0.8, 0.9, 0.8],
          opacity: isHovered ? 0.3 : [0.15, 0.22, 0.15],
        }}
        transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity }}
      />
    </div>
  );
}

function shade(hex: string, amt: number): string {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.min(255, (n >> 16) + amt));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 0xff) + amt));
  const b = Math.max(0, Math.min(255, (n & 0xff) + amt));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}
