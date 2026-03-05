import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Image as ImageIcon } from 'lucide-react';
import type { BookFormData } from '../types/book';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: BookFormData) => void;
}

export function UploadModal({ isOpen, onClose, onUpload }: UploadModalProps) {
  const [step, setStep] = useState<'photo' | 'details'>('photo');
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    author: '',
    description: '',
    coverImage: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreview(result);
      setFormData(prev => ({ ...prev, coverImage: result }));
      setStep('details');
    };
    reader.readAsDataURL(file);
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!preview) return;
    
    onUpload({
      ...formData,
      coverImage: preview,
    });
    
    // Reset and close
    setStep('photo');
    setPreview(null);
    setFormData({ title: '', author: '', description: '', coverImage: '' });
    onClose();
  }, [formData, preview, onUpload, onClose]);

  const handleClose = useCallback(() => {
    setStep('photo');
    setPreview(null);
    setFormData({ title: '', author: '', description: '', coverImage: '' });
    onClose();
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative w-full max-w-lg bg-white rounded-lg shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-black/[0.06]">
              <h2 className="font-serif text-2xl text-[#1a1a1a]">
                {step === 'photo' ? 'Add Volume' : 'Details'}
              </h2>
              <button
                onClick={handleClose}
                className="p-2 text-[#999999] hover:text-[#1a1a1a] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 max-h-[70vh] overflow-y-auto">
              {step === 'photo' ? (
                <div className="space-y-6">
                  {/* Photo upload options */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Camera option */}
                    <button
                      onClick={() => cameraInputRef.current?.click()}
                      className="flex flex-col items-center gap-4 p-8 rounded-lg border border-black/[0.08] hover:border-[#1a1a1a]/20 hover:bg-[#f7f5f2] transition-all group"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#f0ede8] flex items-center justify-center group-hover:bg-[#e8e4dc] transition-colors">
                        <Camera className="w-5 h-5 text-[#666666]" />
                      </div>
                      <span className="text-[#1a1a1a] text-sm font-medium">Camera</span>
                    </button>

                    {/* Gallery option */}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex flex-col items-center gap-4 p-8 rounded-lg border border-black/[0.08] hover:border-[#1a1a1a]/20 hover:bg-[#f7f5f2] transition-all group"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#f0ede8] flex items-center justify-center group-hover:bg-[#e8e4dc] transition-colors">
                        <ImageIcon className="w-5 h-5 text-[#666666]" />
                      </div>
                      <span className="text-[#1a1a1a] text-sm font-medium">Gallery</span>
                    </button>
                  </div>

                  {/* Hidden inputs */}
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  <p className="text-center text-[#999999] text-sm font-light">
                    Photograph the book cover to add to your collection
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Preview */}
                  <div className="flex justify-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative"
                    >
                      {preview && (
                        <img
                          src={preview}
                          alt="Book preview"
                          className="w-28 h-40 object-cover rounded-sm shadow-lg"
                        />
                      )}
                    </motion.div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-[#666666] mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter book title"
                      className="w-full px-0 py-2 bg-transparent border-b border-black/[0.08] text-[#1a1a1a] placeholder:text-[#999999] focus:outline-none focus:border-[#1a1a1a]/30 transition-colors"
                      required
                    />
                  </div>

                  {/* Author */}
                  <div>
                    <label className="block text-sm font-medium text-[#666666] mb-2">
                      Author
                    </label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={e => setFormData(prev => ({ ...prev, author: e.target.value }))}
                      placeholder="Enter author name"
                      className="w-full px-0 py-2 bg-transparent border-b border-black/[0.08] text-[#1a1a1a] placeholder:text-[#999999] focus:outline-none focus:border-[#1a1a1a]/30 transition-colors"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-[#666666] mb-2">
                      Notes
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Add notes about this volume..."
                      rows={3}
                      className="w-full px-0 py-2 bg-transparent border-b border-black/[0.08] text-[#1a1a1a] placeholder:text-[#999999] focus:outline-none focus:border-[#1a1a1a]/30 transition-colors resize-none"
                    />
                  </div>

                  {/* Change photo button */}
                  <button
                    type="button"
                    onClick={() => setStep('photo')}
                    className="text-sm text-[#8b7355] hover:text-[#6b5a42] transition-colors"
                  >
                    Change photo
                  </button>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 bg-[#1a1a1a] text-white rounded-full text-sm font-medium tracking-wide hover:bg-[#333333] transition-colors"
                  >
                    Add to Collection
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
