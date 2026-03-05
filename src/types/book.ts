export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  spineColor?: string;
  pageColor?: string;
  favorited?: boolean;
  genre?: string;
  createdAt: number;
  updatedAt?: number;
}

export interface BookFormData {
  title: string;
  author: string;
  description: string;
  coverImage: string;
  genre?: string;
}
