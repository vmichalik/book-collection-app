import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { TrayHeader } from '@/components/tray/TrayHeader';
import { useSettings } from '@/hooks/useSettings';
import { NumberRoll } from '@/components/animations/NumberRoll';

interface SettingsTrayProps {
  onClose: () => void;
  bookCount: number;
}

export function SettingsTray({ onClose, bookCount }: SettingsTrayProps) {
  const { settings, updateSettings } = useSettings();
  const [showKey, setShowKey] = useState(false);

  return (
    <div className="flex flex-col min-h-0">
      <TrayHeader title="Settings" onClose={onClose} />

      <div className="flex-1 overflow-y-auto px-5 pb-10">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 my-4">
          <div className="rounded-lg border border-border p-4 text-center">
            <div className="text-2xl font-semibold tabular-nums">
              <NumberRoll value={bookCount} />
            </div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-1">
              Books
            </div>
          </div>
          <div className="rounded-lg border border-border p-4 text-center">
            <div className="text-2xl font-semibold tabular-nums">
              <NumberRoll value={0} />
            </div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-1">
              Favorites
            </div>
          </div>
        </div>

        {/* API Key */}
        <div className="border-t border-border pt-5 mt-5">
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1.5">
            Claude API Key
          </p>
          <p className="text-xs text-muted-foreground mb-3">
            Enable AI-powered book recognition from cover photos. Stored locally only.
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
              aria-label={showKey ? 'Hide' : 'Show'}
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
                settings.enableHaptics ? 'bg-foreground' : 'bg-border'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                  settings.enableHaptics ? 'translate-x-4' : ''
                }`}
              />
            </button>
          </label>
        </div>

        {/* Version */}
        <div className="border-t border-border pt-5 mt-5 text-center">
          <p className="text-[10px] font-mono text-muted-foreground">v2.0</p>
        </div>
      </div>
    </div>
  );
}
