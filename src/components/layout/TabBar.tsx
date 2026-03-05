import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tab = 'library' | 'settings';

interface TabBarProps {
  activeTab: Tab;
  onLibrary: () => void;
  onAdd: () => void;
  onSettings: () => void;
}

export function TabBar({ activeTab, onLibrary, onAdd, onSettings }: TabBarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-background/80 backdrop-blur-md border-t border-border pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-12 max-w-md mx-auto">
        {/* Library */}
        <button
          onClick={onLibrary}
          className={cn(
            'relative flex items-center gap-1.5 px-4 py-2 text-[11px] font-mono tracking-wide uppercase transition-colors',
            activeTab === 'library' ? 'text-foreground' : 'text-muted-foreground'
          )}
        >
          {activeTab === 'library' && (
            <motion.div
              layoutId="tab-indicator"
              className="absolute bottom-0 left-3 right-3 h-px bg-foreground"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          Library
        </button>

        {/* Add — center circle */}
        <button
          onClick={onAdd}
          className="flex items-center justify-center w-10 h-10 -mt-3 rounded-full bg-foreground text-background active:scale-95 transition-transform"
          aria-label="Add Book"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
        </button>

        {/* Settings */}
        <button
          onClick={onSettings}
          className={cn(
            'relative flex items-center gap-1.5 px-4 py-2 text-[11px] font-mono tracking-wide uppercase transition-colors',
            activeTab === 'settings' ? 'text-foreground' : 'text-muted-foreground'
          )}
        >
          {activeTab === 'settings' && (
            <motion.div
              layoutId="tab-indicator"
              className="absolute bottom-0 left-3 right-3 h-px bg-foreground"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          Settings
        </button>
      </div>
    </nav>
  );
}
