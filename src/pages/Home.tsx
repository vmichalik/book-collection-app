import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search } from 'lucide-react';
import { useBooks } from '../hooks/useBooks';
import { BookCard } from '../components/BookCard';
import { UploadModal } from '../components/UploadModal';
import type { Book } from '../types/book';

interface HomeProps {
  onBookSelect: (book: Book) => void;
}

export function Home({ onBookSelect }: HomeProps) {
  const { books, addBook, isLoaded } = useBooks();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBooks = useMemo(() => {
    if (!searchQuery.trim()) return books;
    const query = searchQuery.toLowerCase();
    return books.filter(
      book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query)
    );
  }, [books, searchQuery]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f5f2]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-6 h-6 border border-[#1a1a1a]/20 border-t-[#1a1a1a] rounded-full animate-spin"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f5f2]">
      {/* Elegant Header */}
      <header className="sticky top-0 z-10 bg-[#f7f5f2]/95 backdrop-blur-md border-b border-black/[0.06]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-5">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-baseline gap-3"
            >
              <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#1a1a1a] tracking-tight">
                Library
              </h1>
              <span className="text-[#999999] text-sm font-light hidden sm:inline">
                {books.length} volumes
              </span>
            </motion.div>

            {/* Add button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsUploadOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#1a1a1a] text-white rounded-full text-sm font-medium tracking-wide hover:bg-[#333333] transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Book</span>
            </motion.button>
          </div>

          {/* Search - Minimal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mt-6"
          >
            <div className="relative max-w-md">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999999]" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search collection..."
                className="w-full pl-7 pr-4 py-2 bg-transparent border-b border-black/[0.08] text-[15px] text-[#1a1a1a] placeholder:text-[#999999] focus:outline-none focus:border-[#1a1a1a]/30 transition-colors"
              />
            </div>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        {books.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <p className="font-serif text-3xl text-[#1a1a1a]/20 italic mb-4">
              Your collection awaits
            </p>
            <p className="text-[#666666] max-w-sm mb-10 font-light">
              Begin curating your personal library by adding your first volume
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsUploadOpen(true)}
              className="px-8 py-3 bg-[#1a1a1a] text-white rounded-full text-sm font-medium tracking-wide hover:bg-[#333333] transition-colors"
            >
              Add First Book
            </motion.button>
          </motion.div>
        ) : filteredBooks.length === 0 ? (
          /* No Search Results */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <p className="font-serif text-2xl text-[#1a1a1a]/30 italic mb-2">
              No matches found
            </p>
            <p className="text-[#999999] font-light">
              Try a different search term
            </p>
          </motion.div>
        ) : (
          /* Book Grid - Masonry-style editorial layout */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-10">
            <AnimatePresence mode="popLayout">
              {filteredBooks.map((book, index) => (
                <BookCard
                  key={book.id}
                  book={book}
                  index={index}
                  onClick={() => onBookSelect(book)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={addBook}
      />
    </div>
  );
}
