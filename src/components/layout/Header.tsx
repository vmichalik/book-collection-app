import { NumberRoll } from '@/components/animations/NumberRoll';

interface HeaderProps {
  bookCount: number;
}

export function Header({ bookCount }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 w-full bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between px-5 sm:px-8 h-12">
        <span className="text-[11px] font-mono font-medium tracking-widest uppercase text-muted-foreground">
          Library
        </span>
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground tracking-wide">
          <NumberRoll value={bookCount} />
          <span>{bookCount === 1 ? 'item' : 'items'}</span>
        </div>
      </div>
    </header>
  );
}
