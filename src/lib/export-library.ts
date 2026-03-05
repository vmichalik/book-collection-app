import type { Book } from '@/types/book';

export function exportLibrary(books: Book[]): void {
  const cleaned = books.map(({ updatedAt, ...rest }) => rest);
  const json = JSON.stringify(cleaned, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'library.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
