# Library — Book Collection App

A beautiful, mobile-first web app for managing your book collection. Built with React, TypeScript, and Vite.

## Features

- **Photo Upload**: Add books by taking photos or uploading from your gallery
- **3D Book Display**: Interactive CSS 3D books that rotate as you drag/touch them
- **Boutique-Style Grid**: Elegant card layout inspired by high-end retail experiences
- **Smooth Animations**: Framer Motion powered transitions and micro-interactions
- **Dark Theme**: Premium dark palette optimized for mobile viewing
- **PWA Ready**: Install as a standalone app on your phone
- **Local Storage**: Your collection persists between sessions

## Design Inspiration

- **Honk (honk.me)**: Playful, bouncy interactions and bold typography
- **Family Wallet**: Clean card layouts, subtle shadows, gesture-based navigation

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Usage

1. Open the app on your phone or desktop
2. Tap "Add Book" to upload a photo of a book cover
3. Fill in the book details (title, author, description)
4. View your collection in the boutique-style grid
5. Tap any book to see the interactive 3D view
6. Swipe or use arrows to navigate between books

## Tech Stack

- React 18 + TypeScript
- Vite for fast development
- Framer Motion for animations
- Lucide React for icons
- CSS 3D transforms for book display
- Local Storage for data persistence

## Project Structure

```
src/
  components/
    Book3D.tsx        # Interactive 3D book component
    BookCard.tsx      # Grid card with hover effects
    UploadModal.tsx   # Photo upload interface
  pages/
    Home.tsx          # Main collection grid
    BookDetail.tsx    # Full book view with 3D
  hooks/
    useBooks.ts       # CRUD operations + localStorage
  types/
    book.ts           # TypeScript interfaces
```

## Mobile Optimizations

- Touch-friendly 3D book rotation
- Swipe navigation in detail view
- Responsive grid (2-4 columns based on screen)
- Viewport-locked scrolling
- PWA manifest for standalone installation
