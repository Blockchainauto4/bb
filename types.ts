export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
}

export interface Swatch {
  id: string;
  code: string;
  name: string;
  color: string;
  family: string;
}

export enum Tab {
  CONSULTATION = 'Consultation',
  EXPLORE = 'Explore',
  CATALOGUE = 'Catalogue',
  WEDDING = 'Bridal'
}