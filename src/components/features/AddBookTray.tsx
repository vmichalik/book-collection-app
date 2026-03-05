import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, ImageIcon, Sparkles, Loader2 } from 'lucide-react';
import { TrayHeader } from '@/components/tray/TrayHeader';
import { Button } from '@/components/ui/button';
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

      // Try AI recognition if API key is set
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
          setAiError(err instanceof Error ? err.message : 'AI recognition failed');
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

  const stepTitle = step === 'photo' ? 'Add Book' : step === 'analyzing' ? 'Analyzing...' : 'Book Details';

  return (
    <div className="flex flex-col min-h-0">
      <TrayHeader
        title={stepTitle}
        showBack={step === 'details'}
        onBack={handleBack}
        onClose={onClose}
      />

      <div className="flex-1 overflow-y-auto px-5 pb-8">
        <AnimatePresence mode="wait">
          {step === 'photo' && (
            <motion.div
              key="photo"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 pt-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => cameraInput.current?.click()}
                  className="flex flex-col items-center gap-3 p-6 rounded-xl border border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/50 transition-colors"
                >
                  <div className="p-3 rounded-full bg-muted">
                    <Camera className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <span className="text-sm font-medium">Camera</span>
                </button>

                <button
                  onClick={() => fileInput.current?.click()}
                  className="flex flex-col items-center gap-3 p-6 rounded-xl border border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/50 transition-colors"
                >
                  <div className="p-3 rounded-full bg-muted">
                    <ImageIcon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <span className="text-sm font-medium">Gallery</span>
                </button>
              </div>

              <input
                ref={cameraInput}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFile}
                className="hidden"
              />
              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="hidden"
              />

              {settings.apiKey ? (
                <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>AI will auto-detect book details from the cover</span>
                </div>
              ) : (
                <p className="text-center text-xs text-muted-foreground text-pretty">
                  Add an API key in Settings to enable AI book recognition.
                </p>
              )}

              {/* Manual entry button */}
              <div className="text-center">
                <button
                  onClick={() => setStep('details')}
                  className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-2"
                >
                  Or enter details manually
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
                <img
                  src={preview}
                  alt="Book cover"
                  className="w-28 h-40 object-cover rounded-lg shadow-lg mb-2"
                />
              )}
              <Loader2 className="h-6 w-6 text-muted-foreground animate-spin" />
              <p className="text-sm text-muted-foreground">Recognizing book...</p>
            </motion.div>
          )}

          {step === 'details' && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <form onSubmit={handleSubmit} className="space-y-5 pt-4">
                {preview && (
                  <div className="flex justify-center">
                    <img
                      src={preview}
                      alt="Book cover preview"
                      className="w-24 h-36 object-cover rounded-lg shadow-md"
                    />
                  </div>
                )}

                {aiError && (
                  <div className="text-xs text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                    AI recognition failed: {aiError}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label htmlFor="add-title" className="text-sm font-medium">Title</label>
                  <input
                    id="add-title"
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="e.g. The Great Gatsby..."
                    required
                    autoComplete="off"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="add-author" className="text-sm font-medium">Author</label>
                  <input
                    id="add-author"
                    type="text"
                    value={form.author}
                    onChange={(e) => setForm(f => ({ ...f, author: e.target.value }))}
                    placeholder="e.g. F. Scott Fitzgerald..."
                    autoComplete="off"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="add-genre" className="text-sm font-medium">Genre</label>
                  <input
                    id="add-genre"
                    type="text"
                    value={form.genre || ''}
                    onChange={(e) => setForm(f => ({ ...f, genre: e.target.value }))}
                    placeholder="e.g. Fiction, Mystery..."
                    autoComplete="off"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="add-notes" className="text-sm font-medium">Notes</label>
                  <textarea
                    id="add-notes"
                    value={form.description}
                    onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Optional notes..."
                    rows={3}
                    autoComplete="off"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={!form.title.trim()}>
                  Add to Collection
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
