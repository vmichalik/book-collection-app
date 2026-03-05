import { useState, useMemo } from 'react';
import { Eye, EyeOff, Download, ExternalLink } from 'lucide-react';
import { TrayHeader } from '@/components/tray/TrayHeader';
import { useSettings } from '@/hooks/useSettings';
import { getCollectorLevel } from '@/lib/collector';
import { exportLibrary } from '@/lib/export-library';
import type { Book } from '@/types/book';

interface SettingsTrayProps {
  onClose: () => void;
  bookCount: number;
  books?: Book[];
}

export function SettingsTray({ onClose, bookCount, books = [] }: SettingsTrayProps) {
  const { settings, updateSettings } = useSettings();
  const [showKey, setShowKey] = useState(false);
  const { level, title, progress, booksToNext } = getCollectorLevel(bookCount);

  const favoriteCount = useMemo(() => books.filter(b => b.favorited).length, [books]);

  const genreBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const b of books) {
      const g = b.genre || 'Uncategorized';
      counts[g] = (counts[g] || 0) + 1;
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([genre, count]) => ({ genre, count }));
  }, [books]);

  return (
    <div className="flex flex-col min-h-0">
      <TrayHeader title="Stats" onClose={onClose} />

      <div className="flex-1 overflow-y-auto px-5 pb-10">
        {/* Collector card */}
        <div className="rounded-lg border border-border bg-surface p-4 my-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-accent font-mono text-xs font-medium">LV.{level}</span>
              <span className="text-foreground text-sm font-medium ml-2">{title}</span>
            </div>
            <span className="text-muted-foreground font-mono text-[10px] tabular-nums">
              {bookCount} books
            </span>
          </div>

          {/* XP bar */}
          <div className="h-1.5 bg-border rounded-full overflow-hidden mb-1.5">
            <div
              className="xp-bar h-full bg-accent rounded-full"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          {booksToNext > 0 && (
            <p className="text-[9px] font-mono text-muted-foreground">
              {booksToNext} more to next level
            </p>
          )}
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          <div className="rounded-lg border border-border bg-surface p-3 text-center">
            <div className="text-lg font-semibold tabular-nums">{bookCount}</div>
            <div className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">Total</div>
          </div>
          <div className="rounded-lg border border-border bg-surface p-3 text-center">
            <div className="text-lg font-semibold tabular-nums">{favoriteCount}</div>
            <div className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">Fav</div>
          </div>
          <div className="rounded-lg border border-border bg-surface p-3 text-center">
            <div className="text-lg font-semibold tabular-nums">{genreBreakdown.length}</div>
            <div className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">Genres</div>
          </div>
        </div>

        {/* Genre breakdown */}
        {genreBreakdown.length > 0 && (
          <div className="mb-5">
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-3">
              Collection breakdown
            </p>
            <div className="space-y-2">
              {genreBreakdown.map(({ genre, count }) => (
                <div key={genre} className="flex items-center justify-between">
                  <span className="text-xs">{genre}</span>
                  <span className="text-xs font-mono text-muted-foreground tabular-nums">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* API Key */}
        <div className="border-t border-border pt-5">
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1.5">
            Claude API Key
          </p>
          <p className="text-[11px] text-muted-foreground mb-3">
            Enable AI book recognition from cover photos.
          </p>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={settings.apiKey}
              onChange={(e) => updateSettings({ apiKey: e.target.value })}
              placeholder="sk-ant-..."
              autoComplete="off"
              className="field-input pr-9 font-mono text-xs"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
            >
              {showKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </button>
          </div>
          {settings.apiKey && (
            <p className="text-[10px] font-mono text-accent mt-1.5">Active</p>
          )}
        </div>

        {/* Haptics */}
        <div className="border-t border-border pt-5 mt-5">
          <label className="flex items-center justify-between">
            <span className="text-xs">Haptic Feedback</span>
            <button
              role="switch"
              aria-checked={settings.enableHaptics}
              onClick={() => updateSettings({ enableHaptics: !settings.enableHaptics })}
              className={`relative w-9 h-5 rounded-full transition-colors ${
                settings.enableHaptics ? 'bg-accent' : 'bg-border'
              }`}
            >
              <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                settings.enableHaptics ? 'translate-x-4' : ''
              }`} />
            </button>
          </label>
        </div>

        {/* Publish Shelf */}
        <div className="border-t border-border pt-5 mt-5">
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1.5">
            Public Shelf
          </p>
          <p className="text-[11px] text-muted-foreground mb-3">
            Export your collection as a shareable page friends can visit.
          </p>
          <button
            onClick={() => exportLibrary(books as Book[])}
            disabled={bookCount === 0}
            className="w-full flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-3 py-2.5 text-xs font-medium hover:border-accent/50 transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            <Download className="w-3.5 h-3.5" />
            Download library.json
          </button>
          <p className="text-[10px] text-muted-foreground mt-2">
            Drop the file in your project's <span className="font-mono">public/</span> folder and redeploy.
          </p>
          <a
            href="#/shelf"
            className="inline-flex items-center gap-1 text-[10px] font-mono text-accent hover:underline mt-1.5"
          >
            <ExternalLink className="w-3 h-3" />
            Preview shelf
          </a>
        </div>

        <div className="border-t border-border pt-5 mt-5 text-center">
          <p className="text-[10px] font-mono text-muted-foreground">v2.0</p>
        </div>
      </div>
    </div>
  );
}
