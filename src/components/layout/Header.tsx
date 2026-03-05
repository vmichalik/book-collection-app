import { Library } from 'lucide-react';
import { NumberRoll } from '@/components/animations/NumberRoll';

interface HeaderProps {
  bookCount: number;
}

export function Header({ bookCount }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between px-4 sm:px-6 h-14">
        <div className="flex items-center gap-2.5">
          <Library className="h-5 w-5 text-muted-foreground" />
          <h1 className="font-serif text-xl font-semibold tracking-tight">
            Library
          </h1>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <NumberRoll value={bookCount} />
          <span className="ml-0.5">{bookCount === 1 ? 'volume' : 'volumes'}</span>
        </div>
      </div>
    </header>
  );
}
