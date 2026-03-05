import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, ImageIcon, Sparkles, Loader2, SkipForward, Check, Search } from 'lucide-react';
import { TrayHeader } from '@/components/tray/TrayHeader';
import { useSettings } from '@/hooks/useSettings';
import { recognizeBook } from '@/lib/ai-service';
import { compressImage } from '@/lib/image-compress';
import { searchBooks, type BookSearchResult } from '@/lib/book-search';
import type { BookFormData } from '@/types/book';

type Step = 'capture-front' | 'capture-spine' | 'capture-back' | 'analyzing' | 'search' | 'details';

const CAPTURE_STEPS = ['capture-front', 'capture-spine', 'capture-back'] as const;
type CaptureStep = typeof CAPTURE_STEPS[number];

const CAPTURE_CONFIG: Record<CaptureStep, { label: string; number: number; required: boolean }> = {
  'capture-front': { label: 'Front Cover', number: 1, required: true },
  'capture-spine': { label: 'Spine', number: 2, required: false },
  'capture-back': { label: 'Back Cover', number: 3, required: false },
};

interface AddBookTrayProps {
  onClose: () => void;
  onAdd: (data: BookFormData) => void;
}

export function AddBookTray({ onClose, onAdd }: AddBookTrayProps) {
  const { settings } = useSettings();
  const [step, setStep] = useState<Step>('capture-front');
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [spineImage, setSpineImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [form, setForm] = useState<BookFormData>({
    title: '',
    author: '',
    description: '',
    coverImage: '',
    genre: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<BookSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const cameraInput = useRef<HTMLInputElement>(null);

  const isCaptureStep = (s: Step): s is CaptureStep =>
    s === 'capture-front' || s === 'capture-spine' || s === 'capture-back';

  const proceedAfterCapture = useCallback(async (capturedFront: string | null) => {
    const front = capturedFront || frontImage;
    if (!front) return;

    if (settings.apiKey) {
      setStep('analyzing');
      setAiError(null);
      try {
        const aiResult = await recognizeBook(front, settings.apiKey);
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
  }, [frontImage, settings.apiKey]);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    setSearchError(null);
    try {
      const results = await searchBooks(searchQuery.trim());
      setSearchResults(results);
      if (results.length === 0) setSearchError('No results found');
    } catch {
      setSearchError('Search failed. Try again.');
    }
    setSearching(false);
  }, [searchQuery]);

  const handleSelectResult = useCallback((result: BookSearchResult) => {
    setForm({
      title: result.title,
      author: result.author,
      description: result.description,
      genre: result.genre,
      pages: result.pages,
      coverImage: result.coverUrl,
    });
    setStep('details');
  }, []);

  const advanceCaptureStep = useCallback((currentStep: CaptureStep) => {
    if (currentStep === 'capture-front') {
      setStep('capture-spine');
    } else if (currentStep === 'capture-spine') {
      setStep('capture-back');
    } else {
      proceedAfterCapture(null);
    }
  }, [proceedAfterCapture]);

  const handleFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const currentStep = step as CaptureStep;

    // Reset the input so re-picking the same file triggers onChange
    e.target.value = '';

    const raw = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });

    const processed = await compressImage(raw, 800, 0.7);

    if (currentStep === 'capture-front') {
      setFrontImage(processed);
      setForm(prev => ({ ...prev, coverImage: processed }));
      setStep('capture-spine');
    } else if (currentStep === 'capture-spine') {
      setSpineImage(processed);
      setStep('capture-back');
    } else if (currentStep === 'capture-back') {
      setBackImage(processed);
      proceedAfterCapture(null);
    }
  }, [step, proceedAfterCapture]);

  const handleSkip = useCallback(() => {
    if (isCaptureStep(step)) {
      advanceCaptureStep(step);
    }
  }, [step, advanceCaptureStep]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onAdd({
      ...form,
      coverImage: frontImage || form.coverImage || '',
      spineImage: spineImage || undefined,
      backImage: backImage || undefined,
    });
    onClose();
  }, [form, frontImage, spineImage, backImage, onAdd, onClose]);

  const handleBack = useCallback(() => {
    if (step === 'search') {
      setStep('capture-front');
      setSearchQuery('');
      setSearchResults([]);
      setSearchError(null);
    } else if (step === 'details') {
      setStep('capture-front');
      setFrontImage(null);
      setSpineImage(null);
      setBackImage(null);
      setForm({ title: '', author: '', description: '', coverImage: '', genre: '', pages: undefined });
      setAiError(null);
      setSearchQuery('');
      setSearchResults([]);
      setSearchError(null);
    }
  }, [step]);

  const stepTitle = isCaptureStep(step)
    ? `${CAPTURE_CONFIG[step].label} (${CAPTURE_CONFIG[step].number}/3)`
    : step === 'analyzing' ? 'Analyzing' : step === 'search' ? 'Search by Name' : 'Details';

  return (
    <div className="flex flex-col min-h-0">
      <TrayHeader
        title={step === 'capture-front' ? 'Add Book' : stepTitle}
        showBack={step === 'details' || step === 'search'}
        onBack={handleBack}
        onClose={onClose}
      />

      <div className="flex-1 overflow-y-auto px-5 pb-10">
        <AnimatePresence mode="wait">
          {isCaptureStep(step) && (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              className="space-y-5 pt-3"
            >
              {/* Thumbnail strip showing progress */}
              <div className="flex items-center justify-center gap-3">
                {CAPTURE_STEPS.map((cs) => {
                  const img = cs === 'capture-front' ? frontImage : cs === 'capture-spine' ? spineImage : backImage;
                  const isCurrent = cs === step;
                  const config = CAPTURE_CONFIG[cs];
                  return (
                    <div key={cs} className="flex flex-col items-center gap-1">
                      <div
                        className={`${cs === 'capture-spine' ? 'w-5' : 'w-12'} h-16 rounded-sm border-2 overflow-hidden flex items-center justify-center transition-colors ${
                          isCurrent ? 'border-foreground' : img ? 'border-green-500/50' : 'border-border'
                        }`}
                      >
                        {img ? (
                          <img src={img} alt={config.label} className="w-full h-full object-cover" draggable={false} />
                        ) : (
                          <span className="text-[9px] font-mono text-muted-foreground">{config.number}</span>
                        )}
                      </div>
                      <span className={`text-[9px] font-mono ${isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {config.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Capture prompt */}
              <p className="text-center text-[11px] font-mono text-muted-foreground">
                {step === 'capture-front'
                  ? 'Photograph the front cover'
                  : step === 'capture-spine'
                    ? 'Now photograph the spine'
                    : 'Finally, photograph the back cover'}
              </p>

              {/* Camera + Gallery buttons */}
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

              {/* Skip button for spine and back */}
              {!CAPTURE_CONFIG[step].required && (
                <div className="text-center">
                  <button
                    onClick={handleSkip}
                    className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
                  >
                    <SkipForward className="h-3 w-3" />
                    Skip
                  </button>
                </div>
              )}

              {step === 'capture-front' && (
                <>
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

                  <div className="text-center pt-2 space-y-2">
                    <button
                      onClick={() => setStep('search')}
                      className="text-[11px] text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
                    >
                      Or search by name
                    </button>
                    <br />
                    <button
                      onClick={() => setStep('details')}
                      className="text-[10px] text-muted-foreground/60 hover:text-muted-foreground underline underline-offset-4 transition-colors"
                    >
                      Enter manually
                    </button>
                  </div>
                </>
              )}
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
              {frontImage && (
                <img src={frontImage} alt="Book cover" className="w-24 aspect-[2/3] object-cover rounded-sm shadow-md mb-2" />
              )}
              <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
              <p className="text-[11px] font-mono text-muted-foreground">Recognizing...</p>
            </motion.div>
          )}

          {step === 'search' && (
            <motion.div
              key="search"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              className="space-y-4 pt-3"
            >
              <form
                onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Title or author..."
                  autoFocus
                  autoComplete="off"
                  className="field-input flex-1"
                />
                <button
                  type="submit"
                  disabled={searching || !searchQuery.trim()}
                  className="px-3 py-2 rounded-md bg-foreground text-background text-xs font-medium hover:bg-foreground/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
                >
                  {searching ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
                </button>
              </form>

              {searchError && (
                <p className="text-[10px] font-mono text-muted-foreground text-center">{searchError}</p>
              )}

              {searchResults.length > 0 && (
                <div className="space-y-2">
                  {searchResults.map((result, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectResult(result)}
                      className="w-full flex items-start gap-3 p-2.5 rounded-lg border border-border hover:bg-muted/50 transition-colors text-left"
                    >
                      {result.coverUrl ? (
                        <img
                          src={result.coverUrl}
                          alt={result.title}
                          className="w-10 h-14 object-cover rounded-sm flex-shrink-0 bg-muted"
                        />
                      ) : (
                        <div className="w-10 h-14 rounded-sm flex-shrink-0 bg-muted flex items-center justify-center">
                          <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-[12px] font-medium leading-tight truncate">{result.title}</p>
                        <p className="text-[10px] text-muted-foreground truncate mt-0.5">{result.author}</p>
                        {result.pages && (
                          <p className="text-[9px] text-muted-foreground/60 mt-0.5">{result.pages} pages</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <div className="text-center pt-2">
                <button
                  onClick={() => setStep('details')}
                  className="text-[10px] text-muted-foreground/60 hover:text-muted-foreground underline underline-offset-4 transition-colors"
                >
                  Enter manually
                </button>
              </div>
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
                {/* Cover from search */}
                {!frontImage && form.coverImage && (
                  <div className="flex justify-center mb-2">
                    <img
                      src={form.coverImage}
                      alt="Cover"
                      className="w-16 h-24 object-cover rounded-sm border border-border"
                    />
                  </div>
                )}

                {/* Photo thumbnails summary */}
                {(frontImage || spineImage || backImage) && (
                  <div className="flex justify-center items-end gap-2 mb-2">
                    {[
                      { img: frontImage, label: 'Front', spine: false },
                      { img: spineImage, label: 'Spine', spine: true },
                      { img: backImage, label: 'Back', spine: false },
                    ].map(({ img, label, spine }) => (
                      <div key={label} className="flex flex-col items-center gap-0.5">
                        <div className={`${spine ? 'w-6' : 'w-14'} h-[74px] rounded-sm overflow-hidden border border-border bg-muted/30 flex items-center justify-center`}>
                          {img ? (
                            <img src={img} alt={label} className="w-full h-full object-cover" draggable={false} />
                          ) : (
                            <span className="text-[9px] font-mono text-muted-foreground">—</span>
                          )}
                        </div>
                        <span className="text-[9px] font-mono text-muted-foreground flex items-center gap-0.5">
                          {img && <Check className="h-2.5 w-2.5 text-green-500" />}
                          {label}
                        </span>
                      </div>
                    ))}
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

                <FieldGroup label="Pages">
                  <input
                    type="number"
                    value={form.pages || ''}
                    onChange={(e) => setForm(f => ({ ...f, pages: e.target.value ? parseInt(e.target.value) : undefined }))}
                    placeholder="e.g. 320"
                    min={1}
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
