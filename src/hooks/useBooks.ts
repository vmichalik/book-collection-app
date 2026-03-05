import { useState, useEffect, useCallback } from 'react';
import type { Book, BookFormData } from '../types/book';

const STORAGE_KEY = 'book-collection-data';

// Sample books with Unsplash cover images (reliable)
const SAMPLE_BOOKS: Book[] = [
  {
    id: 'sample-1',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    description: 'A romantic novel of manners that follows the character development of Elizabeth Bennet, who learns about the repercussions of hasty judgments.',
    coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
    spineColor: '#4a3f35',
    pageColor: '#f5f0e8',
    createdAt: Date.now() - 86400000 * 30,
  },
  {
    id: 'sample-2',
    title: '1984',
    author: 'George Orwell',
    description: 'A dystopian social science fiction novel about the dangers of totalitarianism, mass surveillance, and repressive regimentation.',
    coverImage: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&h=600&fit=crop',
    spineColor: '#1a1a1a',
    pageColor: '#f5f5f0',
    createdAt: Date.now() - 86400000 * 25,
  },
  {
    id: 'sample-3',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    description: 'A tragedy set in the Jazz Age following mysterious millionaire Jay Gatsby and his pursuit of his former love Daisy Buchanan.',
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
    spineColor: '#1e3a5f',
    pageColor: '#f5f5f0',
    createdAt: Date.now() - 86400000 * 20,
  },
  {
    id: 'sample-4',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    description: 'A novel about serious issues of rape and racial inequality, told through the eyes of young Scout Finch in the Deep South.',
    coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop',
    spineColor: '#5d4e37',
    pageColor: '#f5f5f0',
    createdAt: Date.now() - 86400000 * 15,
  },
  {
    id: 'sample-5',
    title: 'Moby Dick',
    author: 'Herman Melville',
    description: 'The narrative of sailor Ishmael and Captain Ahab\'s obsessive quest for revenge on the giant white sperm whale.',
    coverImage: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=400&h=600&fit=crop',
    spineColor: '#0f4c75',
    pageColor: '#f5f5f0',
    createdAt: Date.now() - 86400000 * 10,
  },
  {
    id: 'sample-6',
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    description: 'A story about teenage angst and alienation as told by Holden Caulfield, exploring themes of innocence and identity.',
    coverImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=600&fit=crop',
    spineColor: '#722f37',
    pageColor: '#f5f5f0',
    createdAt: Date.now() - 86400000 * 5,
  },
];

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setBooks(parsed);
      } catch {
        setBooks(SAMPLE_BOOKS);
      }
    } else {
      // First time user - show sample books
      setBooks(SAMPLE_BOOKS);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever books change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    }
  }, [books, isLoaded]);

  const addBook = useCallback((data: BookFormData) => {
    const newBook: Book = {
      id: `book-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: data.title || 'Untitled Book',
      author: data.author || 'Unknown Author',
      description: data.description || '',
      coverImage: data.coverImage,
      spineColor: generateSpineColor(),
      pageColor: '#f5f5f0',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setBooks(prev => [newBook, ...prev]);
    return newBook;
  }, []);

  const updateBook = useCallback((id: string, updates: Partial<Book>) => {
    setBooks(prev =>
      prev.map(book =>
        book.id === id
          ? { ...book, ...updates, updatedAt: Date.now() }
          : book
      )
    );
  }, []);

  const deleteBook = useCallback((id: string) => {
    setBooks(prev => prev.filter(book => book.id !== id));
  }, []);

  const getBook = useCallback((id: string) => {
    return books.find(book => book.id === id);
  }, [books]);

  const getNextBook = useCallback((currentId: string) => {
    const currentIndex = books.findIndex(b => b.id === currentId);
    if (currentIndex === -1) return null;
    return books[(currentIndex + 1) % books.length];
  }, [books]);

  const getPrevBook = useCallback((currentId: string) => {
    const currentIndex = books.findIndex(b => b.id === currentId);
    if (currentIndex === -1) return null;
    return books[(currentIndex - 1 + books.length) % books.length];
  }, [books]);

  return {
    books,
    isLoaded,
    addBook,
    updateBook,
    deleteBook,
    getBook,
    getNextBook,
    getPrevBook,
  };
}

function generateSpineColor(): string {
  const colors = [
    '#1a1a2e', '#16213e', '#0f3460', '#533483',
    '#2d132c', '#801336', '#c72c41', '#ee4540',
    '#1b262c', '#0f4c75', '#3282b8', '#bbe1fa',
    '#2c3e50', '#34495e', '#7f8c8d', '#95a5a6',
    '#8e44ad', '#9b59b6', '#3498db', '#2980b9',
    '#16a085', '#27ae60', '#2ecc71', '#1abc9c',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
