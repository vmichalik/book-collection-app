import { useState, useEffect, useCallback } from 'react';
import type { Book, BookFormData } from '../types/book';

const STORAGE_KEY = 'book-collection-data';

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
        setBooks([]);
      }
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
