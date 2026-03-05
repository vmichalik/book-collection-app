import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { BookFormData } from '@/types/book';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: BookFormData) => void;
}

export function UploadModal({ isOpen, onClose, onUpload }: UploadModalProps) {
  const [step, setStep] = useState<'photo' | 'details'>('photo');
  const [preview, setPreview] = useState<string | null>(null);
  const [form, setForm] = useState<BookFormData>({
    title: '',
    author: '',
    description: '',
    coverImage: '',
  });
  const fileInput = useRef<HTMLInputElement>(null);
  const cameraInput = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreview(result);
      setForm(prev => ({ ...prev, coverImage: result }));
      setStep('details');
    };
    reader.readAsDataURL(file);
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!preview) return;
    onUpload({ ...form, coverImage: preview });
    setStep('photo');
    setPreview(null);
    setForm({ title: '', author: '', description: '', coverImage: '' });
    onClose();
  }, [form, preview, onUpload, onClose]);

  const handleClose = useCallback(() => {
    setStep('photo');
    setPreview(null);
    setForm({ title: '', author: '', description: '', coverImage: '' });
    onClose();
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={handleClose}
          onKeyDown={(e) => { if (e.key === 'Escape') handleClose(); }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="upload-dialog-title"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-background rounded-lg shadow-xl border w-full max-w-md overflow-hidden"
            style={{ overscrollBehavior: 'contain' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 id="upload-dialog-title" className="font-serif text-lg font-medium">
                {step === 'photo' ? 'Add Book' : 'Book Details'}
              </h2>
              <Button variant="ghost" size="icon" onClick={handleClose} aria-label="Close">
                <X className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6">
              {step === 'photo' ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => cameraInput.current?.click()}
                      className="flex flex-col items-center gap-3 p-6 rounded-lg border border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/50 transition-colors"
                    >
                      <div className="p-3 rounded-full bg-muted">
                        <Camera className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <span className="text-sm font-medium">Camera</span>
                    </button>

                    <button
                      onClick={() => fileInput.current?.click()}
                      className="flex flex-col items-center gap-3 p-6 rounded-lg border border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/50 transition-colors"
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

                  <p className="text-center text-xs text-muted-foreground text-pretty">
                    Take a photo of the book cover or choose from your gallery.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {preview && (
                    <div className="flex justify-center">
                      <img
                        src={preview}
                        alt="Book cover preview"
                        width={96}
                        height={144}
                        className="w-24 h-36 object-cover rounded-md shadow-md"
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <label htmlFor="book-title" className="text-sm font-medium">Title</label>
                    <input
                      id="book-title"
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="e.g. The Great Gatsby…"
                      required
                      autoComplete="off"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="book-author" className="text-sm font-medium">Author</label>
                    <input
                      id="book-author"
                      type="text"
                      name="author"
                      value={form.author}
                      onChange={(e) => setForm({ ...form, author: e.target.value })}
                      placeholder="e.g. F. Scott Fitzgerald…"
                      autoComplete="off"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="book-notes" className="text-sm font-medium">Notes</label>
                    <textarea
                      id="book-notes"
                      name="notes"
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Optional notes…"
                      rows={3}
                      autoComplete="off"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep('photo')}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Change photo
                  </button>

                  <Button type="submit" className="w-full">
                    Add to Collection
                  </Button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
