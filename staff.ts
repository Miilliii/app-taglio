import { IMAGES } from '../config/images';
import type { Category } from './services';

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  image: string;
  categories: Category[]; // servizi che può eseguire
  rating: number;
}

export const STAFF: StaffMember[] = [
  { id: 'marco', name: 'Marco', role: 'Master barber', image: IMAGES.marco, categories: ['Uomo', 'Barba'], rating: 4.9 },
  { id: 'luca', name: 'Luca', role: 'Barber', image: IMAGES.luca, categories: ['Uomo', 'Barba'], rating: 4.8 },
  { id: 'giulia', name: 'Giulia', role: 'Hair stylist & colorist', image: IMAGES.giulia, categories: ['Donna', 'Colore', 'Trattamenti'], rating: 4.9 },
  { id: 'sofia', name: 'Sofia', role: 'Hair stylist', image: IMAGES.sofia, categories: ['Donna', 'Colore', 'Trattamenti', 'Uomo'], rating: 4.7 },
];

export const getStaff = (id: string) => STAFF.find((s) => s.id === id);
