import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Book } from '@/types/book';

interface Book3DProps {
  book: Book;
  size?: 'sm' | 'md' | 'lg';
  autoRotate?: boolean;
  className?: string;
}

// Compute pixel dimensions from page count, cover aspect ratio, and scale.
// Height is fixed per scale, width adapts to the cover image's aspect ratio,
// depth scales with page count.
function getBookDims(pages: number, scale: number, coverRatio: number) {
  const baseH = 150;
  const h = Math.round(baseH * scale);
  const w = Math.round(h * coverRatio);

  const minD = 10 * scale;
  const maxD = 45 * scale;
  const pxPerPage = (maxD - minD) / 700;
  const rawD = minD + (pages - 100) * pxPerPage;
  const d = Math.round(Math.max(minD, Math.min(maxD, rawD)));

  return { w, h, d };
}

const SCALE_MAP = { sm: 0.6, md: 0.85, lg: 1.2 } as const;
const DEFAULT_RATIO = 0.67;

export function Book3D({
  book,
  size = 'md',
  autoRotate = true,
  className,
}: Book3DProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragRotation, setDragRotation] = useState({ x: -4, y: 25 });
  const dragStart = useRef({ x: 0, y: 0, rotX: 0, rotY: 0 });
  const [coverRatio, setCoverRatio] = useState(DEFAULT_RATIO);

  // Load cover image to detect its natural aspect ratio
  useEffect(() => {
    if (!book.coverImage) return;
    const img = new Image();
    img.onload = () => {
      const ratio = img.naturalWidth / img.naturalHeight;
      // Clamp to reasonable book proportions (0.5 to 0.85)
      setCoverRatio(Math.max(0.5, Math.min(0.85, ratio)));
    };
    img.src = book.coverImage;
  }, [book.coverImage]);

  const pageCount = book.pages || 250;
  const scale = SCALE_MAP[size];
  const dims = useMemo(() => getBookDims(pageCount, scale, coverRatio), [pageCount, scale, coverRatio]);

  const spine = book.spineColor || '#3d3d3d';
  const pages = '#faf8f5';
  const halfD = dims.d / 2;
  const halfW = dims.w / 2;
  const halfH = dims.h / 2;

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      rotX: dragRotation.x,
      rotY: dragRotation.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [dragRotation]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setDragRotation({
      x: Math.max(-30, Math.min(30, dragStart.current.rotX - dy * 0.5)),
      y: dragStart.current.rotY + dx * 0.5,
    });
  }, [isDragging]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const useAutoRotate = autoRotate && !isDragging && !isHovered;

  return (
    <div
      className={cn('relative flex items-center justify-center select-none', className)}
      style={{
        width: dims.w + dims.d + 40,
        height: dims.h + 40,
        perspective: '800px',
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <motion.div
        className="relative"
        style={{
          width: dims.w,
          height: dims.h,
          transformStyle: 'preserve-3d',
        }}
        animate={
          isDragging
            ? { rotateX: dragRotation.x, rotateY: dragRotation.y, y: 0 }
            : useAutoRotate
              ? {
                  rotateY: [22, 40, 22, 5, 22],
                  rotateX: [-4, -10, -4, -2, -4],
                  y: [0, -8, 0],
                }
              : {
                  rotateY: isHovered ? 40 : dragRotation.y,
                  rotateX: isHovered ? -8 : dragRotation.x,
                  y: isHovered ? -12 : 0,
                }
        }
        transition={
          isDragging
            ? { type: 'tween', duration: 0 }
            : useAutoRotate
              ? {
                  rotateY: { duration: 10, ease: 'easeInOut', repeat: Infinity },
                  rotateX: { duration: 10, ease: 'easeInOut', repeat: Infinity },
                  y: { duration: 3, ease: 'easeInOut', repeat: Infinity },
                }
              : { duration: 0.5, ease: 'easeOut' }
        }
      >
        {/* Front Cover */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            transform: `translateZ(${halfD}px)`,
            borderRadius: '1px 3px 3px 1px',
            backfaceVisibility: 'hidden',
          }}
        >
          {book.coverImage ? (
            <>
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-full"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-transparent pointer-events-none" />
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-r from-black/30 to-transparent pointer-events-none" />
            </>
          ) : (
            <div
              className="w-full h-full flex flex-col items-center justify-center p-3 text-center text-white"
              style={{ background: spine }}
            >
              <p className="font-serif text-sm leading-tight">{book.title}</p>
              <p className="text-xs text-white/70 mt-1">{book.author}</p>
            </div>
          )}
        </div>

        {/* Back Cover */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            transform: `rotateY(180deg) translateZ(${halfD}px)`,
            borderRadius: '3px 1px 1px 3px',
            backfaceVisibility: 'hidden',
            ...(!book.backImage ? {
              background: `linear-gradient(135deg, ${spine} 0%, ${shade(spine, -25)} 100%)`,
              boxShadow: 'inset -3px 0 10px rgba(0,0,0,0.3)',
            } : {}),
          }}
        >
          {book.backImage && (
            <>
              <img
                src={book.backImage}
                alt={`${book.title} back`}
                className="w-full h-full"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-bl from-white/15 via-transparent to-transparent pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-2 bg-gradient-to-l from-black/30 to-transparent pointer-events-none" />
            </>
          )}
        </div>

        {/* Spine — left edge */}
        <div
          className="absolute overflow-hidden"
          style={{
            width: dims.d,
            height: dims.h,
            left: halfW - halfD,
            top: 0,
            transform: `rotateY(-90deg) translateZ(${halfW}px)`,
            backfaceVisibility: 'hidden',
            ...(!book.spineImage ? {
              background: `linear-gradient(90deg, ${shade(spine, -35)} 0%, ${spine} 15%, ${spine} 85%, ${shade(spine, -45)} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            } : {}),
          }}
        >
          {book.spineImage ? (
            <>
              <img
                src={book.spineImage}
                alt={`${book.title} spine`}
                className="w-full h-full object-cover"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 pointer-events-none" />
            </>
          ) : (
            <p
              className="text-white/90 font-medium tracking-wide overflow-hidden"
              style={{
                writingMode: 'vertical-rl',
                textOrientation: 'mixed',
                transform: 'rotate(180deg)',
                textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                fontSize: `${Math.max(7, Math.min(10, dims.d * 0.4))}px`,
                maxHeight: dims.h - 8,
              }}
            >
              {book.title.slice(0, 32)}{book.title.length > 32 ? '…' : ''}
            </p>
          )}
        </div>

        {/* Pages — right edge */}
        <div
          className="absolute"
          style={{
            width: dims.d - 2,
            height: dims.h - 4,
            left: halfW - halfD + 1,
            top: 2,
            transform: `rotateY(90deg) translateZ(${halfW}px)`,
            borderRadius: '0 1px 1px 0',
            backfaceVisibility: 'hidden',
            background: pages,
            backgroundImage: `repeating-linear-gradient(90deg, ${pages} 0px, ${pages} 1px, #ebe7e0 1px, #ebe7e0 2px)`,
            boxShadow: 'inset 2px 0 4px rgba(0,0,0,0.08)',
          }}
        />

        {/* Top pages */}
        <div
          className="absolute"
          style={{
            width: dims.w - 2,
            height: dims.d - 2,
            left: 1,
            top: halfH - halfD + 1,
            transform: `rotateX(90deg) translateZ(${halfH}px)`,
            backfaceVisibility: 'hidden',
            background: pages,
            backgroundImage: `repeating-linear-gradient(0deg, ${pages} 0px, ${pages} 1px, #ebe7e0 1px, #ebe7e0 2px)`,
          }}
        />

        {/* Bottom pages */}
        <div
          className="absolute"
          style={{
            width: dims.w - 2,
            height: dims.d - 2,
            left: 1,
            top: halfH - halfD + 1,
            transform: `rotateX(-90deg) translateZ(${halfH}px)`,
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
          bottom: 4,
          left: '50%',
          width: dims.w * 0.8,
          height: 16,
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.4) 0%, transparent 70%)',
          filter: 'blur(12px)',
          transform: 'translateX(-50%)',
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
