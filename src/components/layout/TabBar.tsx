import { motion } from 'framer-motion';
import { Library, Plus, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tab = 'library' | 'settings';

interface TabBarProps {
  activeTab: Tab;
  onLibrary: () => void;
  onAdd: () => void;
  onSettings: () => void;
}

export function TabBar({ activeTab, onLibrary, onAdd, onSettings }: TabBarProps) {
  const handlers: Record<Tab, () => void> = {
    library: onLibrary,
    settings: onSettings,
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-14 max-w-md mx-auto">
        {/* Library tab */}
        <button
          onClick={handlers.library}
          className={cn(
            'relative flex flex-col items-center gap-0.5 px-6 py-1.5 transition-colors',
            activeTab === 'library' ? 'text-foreground' : 'text-muted-foreground'
          )}
          aria-label="Library"
        >
          {activeTab === 'library' && (
            <motion.div
              layoutId="tab-indicator"
              className="absolute -top-px left-2 right-2 h-0.5 bg-foreground rounded-full"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <Library className="h-5 w-5" />
          <span className="text-[10px] font-medium">Library</span>
        </button>

        {/* Add button (center, prominent) */}
        <button
          onClick={onAdd}
          className="flex items-center justify-center w-12 h-12 -mt-4 rounded-full bg-foreground text-background shadow-lg active:scale-95 transition-transform"
          aria-label="Add Book"
        >
          <Plus className="h-6 w-6" />
        </button>

        {/* Settings tab */}
        <button
          onClick={handlers.settings}
          className={cn(
            'relative flex flex-col items-center gap-0.5 px-6 py-1.5 transition-colors',
            activeTab === 'settings' ? 'text-foreground' : 'text-muted-foreground'
          )}
          aria-label="Settings"
        >
          {activeTab === 'settings' && (
            <motion.div
              layoutId="tab-indicator"
              className="absolute -top-px left-2 right-2 h-0.5 bg-foreground rounded-full"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <Settings className="h-5 w-5" />
          <span className="text-[10px] font-medium">Settings</span>
        </button>
      </div>
    </nav>
  );
}
