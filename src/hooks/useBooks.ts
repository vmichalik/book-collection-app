import { useState, useEffect, useCallback } from 'react';
import type { Book, BookFormData } from '../types/book';

const STORAGE_KEY = 'book-collection-data';

// Sample classic books with generated covers
const SAMPLE_BOOKS: Book[] = [
  {
    id: 'sample-1',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    description: 'A romantic novel of manners that follows the character development of Elizabeth Bennet, the dynamic protagonist of the book who learns about the repercussions of hasty judgments.',
    coverImage: generateCoverSvg('Pride and Prejudice', '#2d1b4e', '#e8d5b7'),
    spineColor: '#2d1b4e',
    pageColor: '#f5f5f0',
    createdAt: Date.now() - 86400000 * 30,
  },
  {
    id: 'sample-2',
    title: '1984',
    author: 'George Orwell',
    description: 'A dystopian social science fiction novel and cautionary tale about the dangers of totalitarianism, mass surveillance, and repressive regimentation.',
    coverImage: generateCoverSvg('1984', '#1a1a1a', '#cc3333'),
    spineColor: '#1a1a1a',
    pageColor: '#f5f5f0',
    createdAt: Date.now() - 86400000 * 25,
  },
  {
    id: 'sample-3',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    description: 'A novel about the serious issues of rape and racial inequality, told through the eyes of young Scout Finch in the Deep South.',
    coverImage: generateCoverSvg('To Kill a Mockingbird', '#8b4513', '#f4a460'),
    spineColor: '#8b4513',
    pageColor: '#f5f5f0',
    createdAt: Date.now() - 86400000 * 20,
  },
  {
    id: 'sample-4',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    description: 'A tragedy set in the Jazz Age that follows the life of mysterious millionaire Jay Gatsby and his pursuit of his former love Daisy Buchanan.',
    coverImage: generateCoverSvg('The Great Gatsby', '#1e3a5f', '#ffd700'),
    spineColor: '#1e3a5f',
    pageColor: '#f5f5f0',
    createdAt: Date.now() - 86400000 * 15,
  },
  {
    id: 'sample-5',
    title: 'Moby Dick',
    author: 'Herman Melville',
    description: 'The narrative of the sailor Ishmael and the obsessive quest of Captain Ahab for revenge on Moby Dick, the giant white sperm whale.',
    coverImage: generateCoverSvg('Moby Dick', '#0f4c75', '#87ceeb'),
    spineColor: '#0f4c75',
    pageColor: '#f5f5f0',
    createdAt: Date.now() - 86400000 * 10,
  },
  {
    id: 'sample-6',
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    description: 'A story about teenage angst and alienation as told by the iconic Holden Caulfield, exploring themes of innocence and identity.',
    coverImage: generateCoverSvg('The Catcher in the Rye', '#722f37', '#deb887'),
    spineColor: '#722f37',
    pageColor: '#f5f5f0',
    createdAt: Date.now() - 86400000 * 5,
  },
];

function generateCoverSvg(title: string, bgColor: string, accentColor: string): string {
  const shortTitle = title.length > 20 ? title.slice(0, 20) + '...' : title;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${bgColor}"/>
        <stop offset="100%" style="stop-color:${accentColor};stop-opacity:0.3"/>
      </linearGradient>
    </defs>
    <rect width="200" height="300" fill="url(#g)"/>
    <rect x="20" y="40" width="160" height="4" fill="${accentColor}" opacity="0.6"/>
    <rect x="20" y="260" width="160" height="4" fill="${accentColor}" opacity="0.6"/>
    <text x="100" y="140" font-family="Georgia, serif" font-size="18" font-weight="bold" fill="white" text-anchor="middle">${shortTitle}</text>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

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
