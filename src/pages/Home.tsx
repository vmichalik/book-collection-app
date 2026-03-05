import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Library } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBooks } from '@/hooks/useBooks';
import { BookCard } from '@/components/BookCard';
import { UploadModal } from '@/components/UploadModal';
import type { Book } from '@/types/book';

interface HomeProps {
  onBookSelect: (book: Book) => void;
}

export function Home({ onBookSelect }: HomeProps) {
  const { books, addBook, isLoaded } = useBooks();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBooks = useMemo(() => {
    if (!searchQuery.trim()) return books;
    const q = searchQuery.toLowerCase();
    return books.filter(b =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q)
    );
  }, [books, searchQuery]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-muted-foreground/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Library className="h-5 w-5 text-muted-foreground" />
            <h1 className="font-serif text-xl font-semibold tracking-tight">
              Library
            </h1>
            <span className="text-xs text-muted-foreground ml-2 hidden sm:inline">
              {books.length} volumes
            </span>
          </div>
          
          <Button 
            onClick={() => setIsUploadOpen(true)}
            size="sm"
            className="gap-1.5"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Book</span>
          </Button>
        </div>
        
        {/* Search Bar */}
        <div className="container pb-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search collection..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-input bg-background pl-9 pr-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {books.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="rounded-full bg-muted p-6 mb-6">
              <Library className="h-10 w-10 text-muted-foreground/50" />
            </div>
            <h2 className="font-serif text-2xl font-medium mb-2">
              Your collection is empty
            </h2>
            <p className="text-muted-foreground text-sm max-w-xs mb-8">
              Start building your personal library by adding your first book
            </p>
            <Button onClick={() => setIsUploadOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Book
            </Button>
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
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

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={addBook}
      />
    </div>
  );
}
