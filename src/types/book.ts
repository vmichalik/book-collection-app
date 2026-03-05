export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  spineImage?: string;
  backImage?: string;
  spineColor?: string;
  pageColor?: string;
  favorited?: boolean;
  genre?: string;
  pages?: number;
  createdAt: number;
  updatedAt?: number;
}

export interface BookFormData {
  title: string;
  author: string;
  description: string;
  coverImage: string;
  spineImage?: string;
  backImage?: string;
  genre?: string;
  pages?: number;
}
