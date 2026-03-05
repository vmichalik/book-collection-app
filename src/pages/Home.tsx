import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, BookOpen } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-xl bg-[#0a0a0f]/80 border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo/Title */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Library</h1>
                <p className="text-xs text-white/40">{books.length} books</p>
              </div>
            </motion.div>

            {/* Add button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsUploadOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-black rounded-full font-medium shadow-lg hover:shadow-xl transition-shadow"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Add Book</span>
            </motion.button>
          </div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 relative"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search your collection..."
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all"
            />
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 pt-6">
        {books.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-24 h-24 rounded-3xl bg-white/5 flex items-center justify-center mb-6">
              <BookOpen className="w-12 h-12 text-white/20" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Your library is empty</h2>
            <p className="text-white/40 max-w-xs mb-8">
              Start building your collection by adding your first book
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsUploadOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 rounded-full text-white font-medium shadow-lg shadow-violet-500/25"
            >
              Add Your First Book
            </motion.button>
          </motion.div>
        ) : filteredBooks.length === 0 ? (
          /* No Search Results */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <Search className="w-12 h-12 text-white/20 mb-4" />
            <p className="text-white/40">No books found matching &quot;{searchQuery}&quot;</p>
          </motion.div>
        ) : (
          /* Book Grid - Boutique Style */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
