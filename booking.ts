import { SALON } from '../config/salon';
import { SERVICES, type Service } from '../data/services';
import { STAFF, type StaffMember } from '../data/staff';

export interface Booking {
  id: string;
  serviceIds: string[];
  staffId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  duration: number;
  total: number;
  customerName: string;
  customerPhone: string;
  whatsappReminder: boolean;
  createdAt: number;
  status: 'confermata' | 'annullata';
}

// ---------- Date helpers ----------
const WEEKDAYS_SHORT = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
const WEEKDAYS_LONG = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
const MONTHS = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];

export const pad = (n: number) => String(n).padStart(2, '0');
export const toISODate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const fromISODate = (s: string) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};
export const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};
export const fromMinutes = (min: number) => `${pad(Math.floor(min / 60))}:${pad(min % 60)}`;

export const weekdayShort = (d: Date) => WEEKDAYS_SHORT[d.getDay()];
export const formatLongDate = (iso: string) => {
  const d = fromISODate(iso);
  return `${WEEKDAYS_LONG[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
};
export const monthLabel = (d: Date) => `${MONTHS[d.getMonth()].charAt(0).toUpperCase()}${MONTHS[d.getMonth()].slice(1)} ${d.getFullYear()}`;
export const formatDuration = (min: number) => {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
};
export const formatPrice = (n: number) =>
  `${SALON.currency}${Number.isInteger(n) ? n : n.toFixed(2).replace('.', ',')}`;

export const isOpen = (d: Date) => SALON.hours[d.getDay()] != null;

export const nextDays = (count: number) => {
  const out: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    out.push(d);
  }
  return out;
};

export const openStatus = (now = new Date()) => {
  const h = SALON.hours[now.getDay()];
  const mins = now.getHours() * 60 + now.getMinutes();
  if (h && mins >= toMinutes(h.open) && mins < toMinutes(h.close)) {
    return { open: true, label: `Aperto ora · chiude ${h.close}` };
  }
  // prossima apertura
  for (let i = 0; i < 8; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const hh = SALON.hours[d.getDay()];
    if (!hh) continue;
    if (i === 0 && mins >= toMinutes(hh.open)) continue;
    const when = i === 0 ? 'oggi' : i === 1 ? 'domani' : WEEKDAYS_LONG[d.getDay()].toLowerCase();
    return { open: false, label: `Chiuso · apre ${when} alle ${hh.open}` };
  }
  return { open: false, label: 'Chiuso' };
};

// ---------- Services & pricing ----------
export const servicesFromIds = (ids: string[]) =>
  ids.map((id) => SERVICES.find((s) => s.id === id)).filter(Boolean) as Service[];

export const totalDuration = (services: Service[]) => services.reduce((s, x) => s + x.duration, 0);

export const isPromoDay = (iso: string | null) =>
  iso != null && fromISODate(iso).getDay() === SALON.promo.weekday;

export const pricing = (services: Service[], iso: string | null) => {
  const subtotal = services.reduce((s, x) => s + x.price, 0);
  const discount = isPromoDay(iso)
    ? Math.round(services.filter((s) => s.promoEligible).reduce((s, x) => s + x.price, 0) * SALON.promo.discount * 100) / 100
    : 0;
  return { subtotal, discount, total: Math.round((subtotal - discount) * 100) / 100 };
};

export const eligibleStaff = (services: Service[]): StaffMember[] =>
  STAFF.filter((m) => services.every((s) => m.categories.includes(s.category)));

// ---------- Availability (demo deterministica) ----------
// In produzione sostituire con una chiamata al backend (es. Supabase).
const hash = (str: string) => {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
};

const isBusyDemo = (staffId: string, iso: string, startMin: number) => {
  // blocchi da 30 min occupati in modo pseudo-casuale ma stabile
  return hash(`${staffId}|${iso}|${Math.floor(startMin / 30)}`) < 0.32;
};

const overlapsBooking = (staffId: string, iso: string, start: number, end: number, bookings: Booking[]) =>
  bookings.some(
    (b) =>
      b.status === 'confermata' &&
      b.staffId === staffId &&
      b.date === iso &&
      start < toMinutes(b.time) + b.duration &&
      toMinutes(b.time) < end,
  );

export const staffFreeAt = (staffId: string, iso: string, start: number, duration: number, bookings: Booking[]) => {
  for (let t = start; t < start + duration; t += 30) {
    if (isBusyDemo(staffId, iso, t)) return false;
  }
  return !overlapsBooking(staffId, iso, start, start + duration, bookings);
};

export interface Slot {
  time: string;
  available: boolean;
  staffId?: string; // professionista assegnato (utile con "Qualsiasi")
}

export const getSlots = (
  iso: string,
  duration: number,
  staffChoice: string, // id oppure 'any'
  candidates: StaffMember[],
  bookings: Booking[],
): Slot[] => {
  const day = fromISODate(iso);
  const h = SALON.hours[day.getDay()];
  if (!h || duration <= 0) return [];
  const now = new Date();
  const isToday = toISODate(now) === iso;
  const nowMin = now.getHours() * 60 + now.getMinutes() + 30; // almeno 30 min di preavviso
  const pool = staffChoice === 'any' ? candidates : candidates.filter((c) => c.id === staffChoice);
  const out: Slot[] = [];
  for (let t = toMinutes(h.open); t + duration <= toMinutes(h.close); t += SALON.slotMinutes) {
    if (isToday && t < nowMin) continue; // orari già passati: non mostrarli
    const free = pool.find((m) => staffFreeAt(m.id, iso, t, duration, bookings));
    out.push({ time: fromMinutes(t), available: !!free, staffId: free?.id });
  }
  return out;
};

export const firstFreeSlotToday = (bookings: Booking[]) => {
  const iso = toISODate(new Date());
  const slots = getSlots(iso, 30, 'any', STAFF, bookings);
  return slots.find((s) => s.available)?.time ?? null;
};

// ---------- Persistenza locale ----------
const KEY = 'taglio.bookings.v1';
const PROFILE_KEY = 'taglio.profile.v1';

export const loadBookings = (): Booking[] => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Booking[]) : [];
  } catch {
    return [];
  }
};
export const saveBookings = (b: Booking[]) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(b));
  } catch {
    /* storage non disponibile (es. navigazione privata) */
  }
};
export const loadProfile = (): { name: string; phone: string } => {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : { name: '', phone: '' };
  } catch {
    return { name: '', phone: '' };
  }
};
export const saveProfile = (p: { name: string; phone: string }) => {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
  } catch {
    /* ignore */
  }
};

export const isUpcoming = (b: Booking) => {
  const d = fromISODate(b.date);
  d.setMinutes(toMinutes(b.time) + b.duration);
  return d.getTime() > Date.now();
};

// ---------- Validazione ----------
export const isValidItalianPhone = (p: string) => /^(\+39)?\s?3\d{2}[\s.-]?\d{6,7}$|^(\+39)?\s?0\d{6,10}$/.test(p.replace(/\s+/g, ' ').trim());

// ---------- Azioni esterne ----------
export const mapsUrl = () =>
  `https://maps.apple.com/?q=${encodeURIComponent(`${SALON.name}, ${SALON.address}, ${SALON.city}`)}`;

export const downloadICS = (b: Booking) => {
  const services = servicesFromIds(b.serviceIds).map((s) => s.name).join(' + ');
  const start = fromISODate(b.date);
  start.setMinutes(toMinutes(b.time));
  const end = new Date(start.getTime() + b.duration * 60000);
  const fmt = (d: Date) =>
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
  const staff = STAFF.find((s) => s.id === b.staffId)?.name ?? '';
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//TAGLIO//Prenotazioni//IT',
    'BEGIN:VEVENT',
    `UID:${b.id}@taglio`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${services} — ${SALON.name}`,
    `DESCRIPTION:Con ${staff}. Totale ${formatPrice(b.total)}\\, pagamento in salone.`,
    `LOCATION:${SALON.address}\\, ${SALON.city}`,
    'BEGIN:VALARM',
    'TRIGGER:-PT1H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Appuntamento tra 1 ora',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `appuntamento-${b.date}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
