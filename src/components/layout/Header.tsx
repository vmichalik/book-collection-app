import { NumberRoll } from '@/components/animations/NumberRoll';
import { getCollectorLevel } from '@/lib/collector';

interface HeaderProps {
  bookCount: number;
}

export function Header({ bookCount }: HeaderProps) {
  const { level, title, progress, booksToNext } = getCollectorLevel(bookCount);

  return (
    <header className="sticky top-0 z-30 w-full bg-background/90 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between px-5 sm:px-8 h-12">
        {/* Left: Level + title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono font-medium text-accent tabular-nums">
              LV.{level}
            </span>
            <span className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
              {title}
            </span>
          </div>
        </div>

        {/* Right: Book count */}
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground tracking-wide tabular-nums">
          <NumberRoll value={bookCount} />
          <span>{bookCount === 1 ? 'item' : 'items'}</span>
        </div>
      </div>

      {/* XP bar */}
      <div className="h-px bg-border relative">
        <div
          className="xp-bar absolute top-0 left-0 h-full bg-accent/60"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {booksToNext > 0 && (
        <div className="px-5 sm:px-8 py-1">
          <p className="text-[9px] font-mono text-muted-foreground">
            {booksToNext} more to next level
          </p>
        </div>
      )}
    </header>
  );
}
