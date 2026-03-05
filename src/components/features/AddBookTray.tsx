import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, ImageIcon, Sparkles, Loader2 } from 'lucide-react';
import { TrayHeader } from '@/components/tray/TrayHeader';
import { useSettings } from '@/hooks/useSettings';
import { recognizeBook } from '@/lib/ai-service';
import type { BookFormData } from '@/types/book';

type Step = 'photo' | 'analyzing' | 'details';

interface AddBookTrayProps {
  onClose: () => void;
  onAdd: (data: BookFormData) => void;
}

export function AddBookTray({ onClose, onAdd }: AddBookTrayProps) {
  const { settings } = useSettings();
  const [step, setStep] = useState<Step>('photo');
  const [preview, setPreview] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [form, setForm] = useState<BookFormData>({
    title: '',
    author: '',
    description: '',
    coverImage: '',
    genre: '',
  });
  const fileInput = useRef<HTMLInputElement>(null);
  const cameraInput = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const result = reader.result as string;
      setPreview(result);
      setForm(prev => ({ ...prev, coverImage: result }));

      if (settings.apiKey) {
        setStep('analyzing');
        setAiError(null);
        try {
          const aiResult = await recognizeBook(result, settings.apiKey);
          setForm(prev => ({
            ...prev,
            title: aiResult.title || prev.title,
            author: aiResult.author || prev.author,
            description: aiResult.description || prev.description,
            genre: aiResult.genre || prev.genre,
          }));
        } catch (err) {
          setAiError(err instanceof Error ? err.message : 'Recognition failed');
        }
        setStep('details');
      } else {
        setStep('details');
      }
    };
    reader.readAsDataURL(file);
  }, [settings.apiKey]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onAdd({ ...form, coverImage: preview || '' });
    onClose();
  }, [form, preview, onAdd, onClose]);

  const handleBack = useCallback(() => {
    if (step === 'details') {
      setStep('photo');
      setPreview(null);
      setForm({ title: '', author: '', description: '', coverImage: '', genre: '' });
      setAiError(null);
    }
  }, [step]);

  return (
    <div className="flex flex-col min-h-0">
      <TrayHeader
        title={step === 'photo' ? 'Add Book' : step === 'analyzing' ? 'Analyzing' : 'Details'}
        showBack={step === 'details'}
        onBack={handleBack}
        onClose={onClose}
      />

      <div className="flex-1 overflow-y-auto px-5 pb-10">
        <AnimatePresence mode="wait">
          {step === 'photo' && (
            <motion.div
              key="photo"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              className="space-y-5 pt-3"
            >
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => cameraInput.current?.click()}
                  className="flex flex-col items-center gap-2.5 py-8 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <Camera className="h-5 w-5 text-muted-foreground" />
                  <span className="text-[11px] font-mono uppercase tracking-wide">Camera</span>
                </button>

                <button
                  onClick={() => fileInput.current?.click()}
                  className="flex flex-col items-center gap-2.5 py-8 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <ImageIcon className="h-5 w-5 text-muted-foreground" />
                  <span className="text-[11px] font-mono uppercase tracking-wide">Gallery</span>
                </button>
              </div>

              <input ref={cameraInput} type="file" accept="image/*" capture="environment" onChange={handleFile} className="hidden" />
              <input ref={fileInput} type="file" accept="image/*" onChange={handleFile} className="hidden" />

              {settings.apiKey ? (
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground justify-center">
                  <Sparkles className="h-3 w-3" />
                  AI recognition enabled
                </div>
              ) : (
                <p className="text-[10px] font-mono text-center text-muted-foreground">
                  Add API key in Settings for AI recognition
                </p>
              )}

              <div className="text-center pt-2">
                <button
                  onClick={() => setStep('details')}
                  className="text-[11px] text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
                >
                  Or enter manually
                </button>
              </div>
            </motion.div>
          )}

          {step === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-16 gap-4"
            >
              {preview && (
                <img src={preview} alt="Book cover" className="w-24 aspect-[2/3] object-cover rounded-sm shadow-md mb-2" />
              )}
              <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
              <p className="text-[11px] font-mono text-muted-foreground">Recognizing...</p>
            </motion.div>
          )}

          {step === 'details' && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
            >
              <form onSubmit={handleSubmit} className="space-y-4 pt-3">
                {preview && (
                  <div className="flex justify-center mb-2">
                    <img src={preview} alt="Preview" className="w-20 aspect-[2/3] object-cover rounded-sm shadow-md" />
                  </div>
                )}

                {aiError && (
                  <div className="text-[10px] font-mono text-destructive bg-destructive/5 border border-destructive/10 rounded-md px-3 py-2">
                    {aiError}
                  </div>
                )}

                <FieldGroup label="Title">
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="Book title"
                    required
                    autoComplete="off"
                    className="field-input"
                  />
                </FieldGroup>

                <FieldGroup label="Author">
                  <input
                    type="text"
                    value={form.author}
                    onChange={(e) => setForm(f => ({ ...f, author: e.target.value }))}
                    placeholder="Author name"
                    autoComplete="off"
                    className="field-input"
                  />
                </FieldGroup>

                <FieldGroup label="Genre">
                  <input
                    type="text"
                    value={form.genre || ''}
                    onChange={(e) => setForm(f => ({ ...f, genre: e.target.value }))}
                    placeholder="e.g. Fiction, Mystery"
                    autoComplete="off"
                    className="field-input"
                  />
                </FieldGroup>

                <FieldGroup label="Notes">
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Optional"
                    rows={2}
                    autoComplete="off"
                    className="field-input resize-none"
                  />
                </FieldGroup>

                <button
                  type="submit"
                  disabled={!form.title.trim()}
                  className="w-full py-2.5 text-xs font-medium rounded-md bg-foreground text-background hover:bg-foreground/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors mt-2"
                >
                  Add to Collection
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
