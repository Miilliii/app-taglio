import { IMAGES } from '../config/images';

export type Category = 'Uomo' | 'Barba' | 'Donna' | 'Colore' | 'Trattamenti';

export const CATEGORIES: Category[] = ['Uomo', 'Barba', 'Donna', 'Colore', 'Trattamenti'];

export interface Service {
  id: string;
  name: string;
  description: string;
  category: Category;
  duration: number; // minuti
  price: number; // euro
  image: string;
  popular?: boolean;
  promoEligible?: boolean; // incluso nella promo del martedì
}

export const SERVICES: Service[] = [
  // Uomo
  { id: 'taglio-uomo', name: 'Taglio uomo', description: 'Shampoo, taglio a forbice o macchinetta e styling.', category: 'Uomo', duration: 30, price: 20, image: IMAGES.tagliouomo, popular: true, promoEligible: true },
  { id: 'skin-fade', name: 'Skin fade', description: 'Sfumatura a zero con transizione perfetta e rifinitura a rasoio.', category: 'Uomo', duration: 45, price: 25, image: IMAGES.skinfade, promoEligible: true },
  { id: 'taglio-barba', name: 'Taglio + barba', description: 'Il pacchetto completo: taglio, regolazione barba e panno caldo.', category: 'Uomo', duration: 60, price: 32, image: IMAGES.tagliobarba, popular: true, promoEligible: true },
  { id: 'taglio-bambino', name: 'Taglio bambino', description: 'Fino a 12 anni. Veloce, preciso e senza lacrime.', category: 'Uomo', duration: 30, price: 15, image: IMAGES.bambino, promoEligible: true },
  // Barba
  { id: 'regolazione-barba', name: 'Regolazione barba', description: 'Definizione dei contorni e lunghezza su misura.', category: 'Barba', duration: 15, price: 12, image: IMAGES.barba },
  { id: 'barba-panno-caldo', name: 'Barba con panno caldo', description: 'Regolazione, panno caldo, oli e balsamo idratante.', category: 'Barba', duration: 30, price: 16, image: IMAGES.pannocaldo },
  { id: 'rasatura', name: 'Rasatura tradizionale', description: 'Rasatura completa a mano libera con lama e pre-shave.', category: 'Barba', duration: 30, price: 18, image: IMAGES.rasatura },
  // Donna
  { id: 'piega', name: 'Piega', description: 'Shampoo, trattamento e piega liscia o mossa.', category: 'Donna', duration: 45, price: 25, image: IMAGES.piega, popular: true, promoEligible: true },
  { id: 'taglio-piega', name: 'Taglio e piega', description: 'Consulenza, taglio personalizzato e piega.', category: 'Donna', duration: 60, price: 45, image: IMAGES.tagliopiega, popular: true, promoEligible: true },
  { id: 'piega-corti', name: 'Piega capelli corti', description: 'Per tagli corti e caschetti.', category: 'Donna', duration: 30, price: 20, image: IMAGES.piegacorti, promoEligible: true },
  // Colore
  { id: 'colore', name: 'Colore', description: 'Colorazione completa con prodotti senza ammoniaca. Piega esclusa.', category: 'Colore', duration: 90, price: 55, image: IMAGES.colore, popular: true },
  { id: 'meches', name: 'Meches', description: 'Schiariture a cartina per un effetto luminoso. Piega esclusa.', category: 'Colore', duration: 120, price: 80, image: IMAGES.meches },
  { id: 'balayage', name: 'Balayage', description: 'Schiaritura a mano libera, naturale e sfumata. Tonalizzante incluso.', category: 'Colore', duration: 150, price: 110, image: IMAGES.balayage },
  { id: 'tonalizzante', name: 'Tonalizzante', description: 'Ravviva il riflesso e neutralizza i toni indesiderati.', category: 'Colore', duration: 30, price: 25, image: IMAGES.tonalizzante },
  // Trattamenti
  { id: 'ristrutturante', name: 'Trattamento ristrutturante', description: 'Ricostruzione profonda per capelli secchi o danneggiati.', category: 'Trattamenti', duration: 30, price: 20, image: IMAGES.ristrutturante },
  { id: 'cute', name: 'Trattamento cute', description: 'Scrub e massaggio per cute sensibile o grassa.', category: 'Trattamenti', duration: 30, price: 22, image: IMAGES.cute },
  { id: 'gloss', name: 'Gloss lucidante', description: 'Lucentezza immediata e protezione del colore.', category: 'Trattamenti', duration: 20, price: 18, image: IMAGES.gloss },
];

export const getService = (id: string) => SERVICES.find((s) => s.id === id);
