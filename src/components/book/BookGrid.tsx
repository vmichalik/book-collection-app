import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Library } from 'lucide-react';
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
    <main className="px-4 sm:px-6 pt-4 pb-8">
      {/* Search */}
      {books.length > 0 && (
        <div className="relative max-w-md mb-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <label htmlFor="book-search" className="sr-only">Search your collection</label>
          <input
            id="book-search"
            type="search"
            placeholder="Search collection..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoComplete="off"
            className="w-full rounded-lg border border-input bg-background pl-9 pr-4 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      )}

      {/* Grid */}
      {books.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <div className="rounded-full bg-muted p-6 mb-6">
            <Library className="h-10 w-10 text-muted-foreground/50" />
          </div>
          <h2 className="font-serif text-2xl font-medium mb-2 text-balance">
            Your Collection Is Empty
          </h2>
          <p className="text-muted-foreground text-sm max-w-xs text-pretty">
            Tap the + button below to add your first book.
          </p>
        </motion.div>
      ) : filteredBooks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <Search className="h-10 w-10 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">
            No books found for &ldquo;{searchQuery}&rdquo;
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 sm:gap-6">
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
