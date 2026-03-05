import { useState, useEffect, useCallback, useRef } from 'react';
import type { Book, BookFormData } from '../types/book';

const STORAGE_KEY = 'book-collection-data';

const MILESTONE_COUNTS = [5, 10, 25, 50, 100];

// Real book covers from Open Library (ISBN-based for reliability)
const SAMPLE_BOOKS: Book[] = [
  {
    id: 'sample-1',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    description: 'A romantic novel of manners that follows the character development of Elizabeth Bennet, who learns about the repercussions of hasty judgments.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg',
    spineColor: '#2d3436',
    pageColor: '#f5f0e8',
    genre: 'Classic',
    favorited: false,
    createdAt: Date.now() - 86400000 * 30,
  },
  {
    id: 'sample-2',
    title: '1984',
    author: 'George Orwell',
    description: 'A dystopian social science fiction novel about the dangers of totalitarianism, mass surveillance, and repressive regimentation.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg',
    spineColor: '#1a1a2e',
    pageColor: '#f5f5f0',
    genre: 'Dystopian',
    favorited: false,
    createdAt: Date.now() - 86400000 * 25,
  },
  {
    id: 'sample-3',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    description: 'A tragedy set in the Jazz Age following mysterious millionaire Jay Gatsby and his pursuit of his former love Daisy Buchanan.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg',
    spineColor: '#0c2461',
    pageColor: '#f5f5f0',
    genre: 'Classic',
    favorited: false,
    createdAt: Date.now() - 86400000 * 20,
  },
  {
    id: 'sample-4',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    description: 'A novel about serious issues of rape and racial inequality, told through the eyes of young Scout Finch in the Deep South.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg',
    spineColor: '#5d4e37',
    pageColor: '#f5f5f0',
    genre: 'Classic',
    favorited: false,
    createdAt: Date.now() - 86400000 * 15,
  },
  {
    id: 'sample-5',
    title: 'Moby Dick',
    author: 'Herman Melville',
    description: 'The narrative of sailor Ishmael and Captain Ahab\'s obsessive quest for revenge on the giant white sperm whale.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780142437247-L.jpg',
    spineColor: '#1e3a5f',
    pageColor: '#f5f5f0',
    genre: 'Adventure',
    favorited: false,
    createdAt: Date.now() - 86400000 * 10,
  },
  {
    id: 'sample-6',
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    description: 'A story about teenage angst and alienation as told by Holden Caulfield, exploring themes of innocence and identity.',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780316769488-L.jpg',
    spineColor: '#b33939',
    pageColor: '#f5f5f0',
    genre: 'Coming of Age',
    favorited: false,
    createdAt: Date.now() - 86400000 * 5,
  },
];

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [milestone, setMilestone] = useState<number | null>(null);
  const prevCountRef = useRef(0);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setBooks(parsed);
        prevCountRef.current = parsed.length;
      } catch {
        setBooks(SAMPLE_BOOKS);
        prevCountRef.current = SAMPLE_BOOKS.length;
      }
    } else {
      setBooks(SAMPLE_BOOKS);
      prevCountRef.current = SAMPLE_BOOKS.length;
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever books change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    }
  }, [books, isLoaded]);

  // Check for milestones when count increases
  useEffect(() => {
    if (!isLoaded) return;
    const prev = prevCountRef.current;
    const curr = books.length;
    if (curr > prev) {
      const hit = MILESTONE_COUNTS.find(m => prev < m && curr >= m);
      if (hit) {
        setMilestone(hit);
      }
    }
    prevCountRef.current = curr;
  }, [books.length, isLoaded]);

  const clearMilestone = useCallback(() => setMilestone(null), []);

  const addBook = useCallback((data: BookFormData) => {
    const newBook: Book = {
      id: `book-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: data.title || 'Untitled Book',
      author: data.author || 'Unknown Author',
      description: data.description || '',
      coverImage: data.coverImage,
      genre: data.genre || undefined,
      spineColor: generateSpineColor(),
      pageColor: '#f5f5f0',
      favorited: false,
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

  const toggleFavorite = useCallback((id: string) => {
    setBooks(prev =>
      prev.map(book =>
        book.id === id
          ? { ...book, favorited: !book.favorited, updatedAt: Date.now() }
          : book
      )
    );
  }, []);

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
    milestone,
    clearMilestone,
    addBook,
    updateBook,
    deleteBook,
    getBook,
    toggleFavorite,
    getNextBook,
    getPrevBook,
  };
}

function generateSpineColor(): string {
  const colors = [
    '#2d3436', '#636e72', '#b2bec3', '#dfe6e9',
    '#1a1a2e', '#16213e', '#0f3460', '#533483',
    '#2d132c', '#801336', '#c72c41', '#ee4540',
    '#1b262c', '#0f4c75', '#3282b8', '#bbe1fa',
    '#2c3e50', '#34495e', '#7f8c8d', '#95a5a6',
    '#8e44ad', '#9b59b6', '#3498db', '#2980b9',
    '#16a085', '#27ae60', '#2ecc71', '#1abc9c',
    '#d63031', '#74b9ff', '#a29bfe', '#fd79a8',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
