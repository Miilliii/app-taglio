// Configurazione del salone — modifica SOLO questo file per adattare
// il template a un nuovo cliente (nome, contatti, orari, promo).

export interface OpeningDay {
  open: string; // "09:00"
  close: string; // "19:00"
}

export const SALON = {
  name: 'TAGLIO',
  tagline: 'La cura di ogni dettaglio, dal primo taglio',
  type: 'Barber & Parrucchiere',
  address: 'Via Roma 12',
  city: 'Milano',
  phone: '+39 02 1234 5678',
  whatsapp: '393331234567', // formato internazionale senza "+"
  instagram: 'taglio.milano',
  slotMinutes: 30,
  bookingDaysAhead: 21,
  currency: '€',
  // 0 = domenica … 6 = sabato. null = chiuso
  hours: {
    0: null,
    1: null,
    2: { open: '09:00', close: '19:00' },
    3: { open: '09:00', close: '19:00' },
    4: { open: '09:00', close: '20:00' },
    5: { open: '09:00', close: '20:00' },
    6: { open: '08:30', close: '18:00' },
  } as Record<number, OpeningDay | null>,
  promo: {
    title: '-20% il martedì',
    text: 'Su taglio e piega, ogni martedì, con lo stesso servizio di sempre.',
    weekday: 2,
    discount: 0.2,
  },
};
