import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Image as ImageIcon, Loader2 } from 'lucide-react';
import type { BookFormData } from '../types/book';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: BookFormData) => void;
}

export function UploadModal({ isOpen, onClose, onUpload }: UploadModalProps) {
  const [step, setStep] = useState<'photo' | 'details'>('photo');
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
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
      
      // Simulate processing the image for book info
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
      }, 1000);
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
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={handleClose}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-[#1a1a1f] rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h2 className="text-lg font-semibold text-white">
                {step === 'photo' ? 'Add Book' : 'Book Details'}
              </h2>
              <button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white/60" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {step === 'photo' ? (
                <div className="space-y-4">
                  {/* Photo upload options */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Camera option */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => cameraInputRef.current?.click()}
                      className="flex flex-col items-center gap-3 p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all"
                    >
                      <div className="w-14 h-14 rounded-full bg-violet-500/20 flex items-center justify-center">
                        <Camera className="w-7 h-7 text-violet-400" />
                      </div>
                      <span className="text-white/80 text-sm font-medium">Take Photo</span>
                    </motion.button>

                    {/* Gallery option */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => fileInputRef.current?.click()}
                      className="flex flex-col items-center gap-3 p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all"
                    >
                      <div className="w-14 h-14 rounded-full bg-cyan-500/20 flex items-center justify-center">
                        <ImageIcon className="w-7 h-7 text-cyan-400" />
                      </div>
                      <span className="text-white/80 text-sm font-medium">From Gallery</span>
                    </motion.button>
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

                  <p className="text-center text-white/40 text-sm">
                    Take a photo of your book cover or upload from your gallery
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Preview */}
                  <div className="flex justify-center">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="relative"
                    >
                      {preview && (
                        <img
                          src={preview}
                          alt="Book preview"
                          className="w-32 h-48 object-cover rounded-lg shadow-xl"
                        />
                      )}
                      {isProcessing && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                          <Loader2 className="w-8 h-8 text-white animate-spin" />
                        </div>
                      )}
                    </motion.div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter book title"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 transition-colors"
                      required
                    />
                  </div>

                  {/* Author */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Author
                    </label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={e => setFormData(prev => ({ ...prev, author: e.target.value }))}
                      placeholder="Enter author name"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 transition-colors"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Add a brief description..."
                      rows={3}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 transition-colors resize-none"
                    />
                  </div>

                  {/* Change photo button */}
                  <button
                    type="button"
                    onClick={() => setStep('photo')}
                    className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
                  >
                    Change photo
                  </button>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-gradient-to-r from-violet-600 to-cyan-600 rounded-xl text-white font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-shadow"
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
