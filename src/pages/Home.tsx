import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Library } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] pb-32">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#0a0a0f]/95 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <Library className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white tracking-tight">Library</h1>
                <p className="text-xs text-white/40 font-medium">{books.length} books</p>
              </div>
            </motion.div>

            {/* Add button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsUploadOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-black rounded-full font-semibold text-sm"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Book</span>
            </motion.button>
          </div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search your collection..."
                className="w-full pl-11 pr-4 py-3 bg-white/[0.05] border border-white/[0.08] rounded-2xl text-[15px] text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 transition-all"
              />
            </div>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        {books.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-20 h-20 rounded-3xl bg-white/[0.05] flex items-center justify-center mb-6 border border-white/[0.08]">
              <Library className="w-10 h-10 text-white/30" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Your library is empty</h2>
            <p className="text-white/50 max-w-xs mb-8">
              Start building your collection by adding your first book
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsUploadOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 rounded-full text-white font-semibold"
            >
              Add Your First Book
            </motion.button>
          </motion.div>
        ) : filteredBooks.length === 0 ? (
          /* No Search Results */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <Search className="w-12 h-12 text-white/20 mb-4" />
            <p className="text-white/50">No books found matching &quot;{searchQuery}&quot;</p>
          </motion.div>
        ) : (
          /* Book Grid - Clean 2-column layout for mobile */
          <div className="grid grid-cols-2 gap-4 sm:gap-5">
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
