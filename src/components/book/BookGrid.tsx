import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { BookGridItem } from './BookGridItem';
import type { Book } from '@/types/book';

interface BookGridProps {
  books: Book[];
  onBookSelect: (bookId: string) => void;
  onToggleFavorite: (bookId: string) => void;
}

export function BookGrid({ books, onBookSelect, onToggleFavorite }: BookGridProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBooks = useMemo(() => {
    if (!searchQuery.trim()) return books;
    const q = searchQuery.toLowerCase();
    return books.filter(b =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q)
    );
  }, [books, searchQuery]);

  return (
    <main className="px-5 sm:px-8 pt-6 pb-8">
      {/* Search */}
      {books.length > 0 && (
        <div className="relative max-w-xs mb-8">
          <Search className="absolute left-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <label htmlFor="book-search" className="sr-only">Search your collection</label>
          <input
            id="book-search"
            type="search"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoComplete="off"
            className="w-full bg-transparent border-b border-border pl-6 pr-2 py-2 text-xs font-mono placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
          />
        </div>
      )}

      {/* Grid */}
      {books.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-32 text-center"
        >
          <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground mb-3">
            No books yet
          </p>
          <p className="text-sm text-muted-foreground max-w-[200px]">
            Tap + to add your first book.
          </p>
        </motion.div>
      ) : filteredBooks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-32 text-center"
        >
          <p className="text-sm text-muted-foreground">
            No results for "{searchQuery}"
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8 sm:gap-x-5 sm:gap-y-10">
          <AnimatePresence mode="popLayout">
            {filteredBooks.map((book, index) => (
              <BookGridItem
                key={book.id}
                book={book}
                index={index}
                onSelect={onBookSelect}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </main>
  );
}
