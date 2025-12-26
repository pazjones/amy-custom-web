export interface Artwork {
  id: string;
  title: string;
  description: string;
  year: string;
  category: string;
  technique?: string;
  price: number;
  previewUrl: string;
  highResUrl?: string;
  fileType: string;
}