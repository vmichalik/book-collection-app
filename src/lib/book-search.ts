export interface BookSearchResult {
  title: string;
  author: string;
  description: string;
  genre: string;
  pages?: number;
  coverUrl: string;
}

interface GoogleBooksVolume {
  volumeInfo: {
    title?: string;
    authors?: string[];
    description?: string;
    categories?: string[];
    pageCount?: number;
    imageLinks?: {
      thumbnail?: string;
    };
  };
}

interface GoogleBooksResponse {
  items?: GoogleBooksVolume[];
}

export async function searchBooks(query: string): Promise<BookSearchResult[]> {
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=8`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error('Search failed');
  }

  const data: GoogleBooksResponse = await res.json();

  if (!data.items) return [];

  return data.items
    .filter((item) => item.volumeInfo.title)
    .map((item) => {
      const v = item.volumeInfo;
      const thumbnail = v.imageLinks?.thumbnail ?? '';
      return {
        title: v.title ?? '',
        author: v.authors?.join(', ') ?? '',
        description: v.description ?? '',
        genre: v.categories?.[0] ?? '',
        pages: v.pageCount,
        coverUrl: thumbnail.replace(/^http:/, 'https:'),
      };
    });
}
