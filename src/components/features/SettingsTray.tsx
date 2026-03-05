import { useState } from 'react';
import { Eye, EyeOff, Key, BookOpen, Heart } from 'lucide-react';
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

      <div className="flex-1 overflow-y-auto px-5 pb-8">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 my-4">
          <div className="rounded-xl bg-muted/50 p-4 text-center">
            <div className="flex items-center justify-center gap-1 text-2xl font-serif font-semibold">
              <NumberRoll value={bookCount} />
            </div>
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mt-1">
              <BookOpen className="h-3 w-3" />
              Books
            </div>
          </div>
          <div className="rounded-xl bg-muted/50 p-4 text-center">
            <div className="text-2xl font-serif font-semibold">
              <NumberRoll value={0} />
            </div>
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mt-1">
              <Heart className="h-3 w-3" />
              Favorites
            </div>
          </div>
        </div>

        {/* API Key */}
        <div className="border-t pt-5 mt-5">
          <div className="flex items-center gap-2 mb-3">
            <Key className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Claude API Key</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-3 text-pretty">
            Enable AI-powered book recognition from cover photos. Your key is stored locally only.
          </p>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={settings.apiKey}
              onChange={(e) => updateSettings({ apiKey: e.target.value })}
              placeholder="sk-ant-..."
              autoComplete="off"
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 pr-10 text-sm font-mono placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
              aria-label={showKey ? 'Hide API key' : 'Show API key'}
            >
              {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {settings.apiKey && (
            <p className="text-xs text-green-600 mt-1.5">
              AI book recognition is enabled
            </p>
          )}
        </div>

        {/* Haptics toggle */}
        <div className="border-t pt-5 mt-5">
          <label className="flex items-center justify-between">
            <span className="text-sm font-medium">Haptic Feedback</span>
            <button
              role="switch"
              aria-checked={settings.enableHaptics}
              onClick={() => updateSettings({ enableHaptics: !settings.enableHaptics })}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                settings.enableHaptics ? 'bg-foreground' : 'bg-muted-foreground/30'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  settings.enableHaptics ? 'translate-x-5' : ''
                }`}
              />
            </button>
          </label>
        </div>

        {/* Version */}
        <div className="border-t pt-5 mt-5 text-center">
          <p className="text-xs text-muted-foreground">
            Book Collection v2.0
          </p>
        </div>
      </div>
    </div>
  );
}
