import { useEffect, useMemo, useState } from 'react';
import { COLORS, FONT, NAV_HEIGHT, SAFE } from './config/theme';
import BottomNav, { type Page } from './components/BottomNav';
import HomePage from './components/HomePage';
import ServicesPage from './components/ServicesPage';
import BookingPage, { type BookingDraft } from './components/BookingPage';
import ConfirmPage from './components/ConfirmPage';
import ProfilePage from './components/ProfilePage';
import {
  eligibleStaff,
  isUpcoming,
  loadBookings,
  loadProfile,
  pricing,
  saveBookings,
  saveProfile,
  servicesFromIds,
  staffFreeAt,
  toMinutes,
  totalDuration,
  type Booking,
} from './lib/booking';

const EMPTY_DRAFT: BookingDraft = { staffChoice: 'any', date: null, time: null, assignedStaffId: null };

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [selected, setSelected] = useState<string[]>([]);
  const [draft, setDraft] = useState<BookingDraft>(EMPTY_DRAFT);
  const [bookings, setBookings] = useState<Booking[]>(() => loadBookings());
  const [profile, setProfile] = useState(() => loadProfile());
  const [lastBooking, setLastBooking] = useState<Booking | null>(null);

  useEffect(() => saveBookings(bookings), [bookings]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [page]);

  const nextBooking = useMemo(
    () =>
      [...bookings]
        .filter((b) => b.status === 'confermata' && isUpcoming(b))
        .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))[0] ?? null,
    [bookings],
  );

  const navigate = (p: Page) => {
    if (p === 'confirm' && !lastBooking) p = 'booking';
    setPage(p);
  };

  // Aggiunge/rimuove un servizio. Ritorna false se la combinazione non è eseguibile da un solo professionista.
  const toggleService = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((x) => x !== id));
      setDraft((d) => ({ ...d, time: null, assignedStaffId: null }));
      return true;
    }
    const next = [...selected, id];
    if (eligibleStaff(servicesFromIds(next)).length === 0) return false;
    setSelected(next);
    setDraft((d) => ({ ...d, time: null, assignedStaffId: null }));
    return true;
  };

  const quickBook = (serviceId: string) => {
    setSelected([serviceId]);
    setDraft(EMPTY_DRAFT);
    setPage('booking');
  };

  const bookWithStaff = (staffId: string) => {
    setDraft({ ...EMPTY_DRAFT, staffChoice: staffId });
    setSelected((sel) => {
      const ok = sel.length > 0 && eligibleStaff(servicesFromIds(sel)).some((m) => m.id === staffId);
      return ok ? sel : [];
    });
    setPage('services');
  };

  const confirmBooking = ({ name, phone, whatsapp }: { name: string; phone: string; whatsapp: boolean }) => {
    if (!draft.date || !draft.time) return;
    const services = servicesFromIds(selected);
    const duration = totalDuration(services);
    const staffId = draft.staffChoice === 'any' ? draft.assignedStaffId : draft.staffChoice;
    // ricontrollo disponibilità al momento della conferma
    if (!staffId || !staffFreeAt(staffId, draft.date, toMinutes(draft.time), duration, bookings)) {
      setDraft({ ...draft, time: null, assignedStaffId: null });
      alert("L'orario scelto non è più disponibile. Scegline un altro.");
      return;
    }
    const booking: Booking = {
      id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
      serviceIds: selected,
      staffId,
      date: draft.date,
      time: draft.time,
      duration,
      total: pricing(services, draft.date).total,
      customerName: name,
      customerPhone: phone,
      whatsappReminder: whatsapp,
      createdAt: Date.now(),
      status: 'confermata',
    };
    setBookings((b) => [...b, booking]);
    const p = { name, phone };
    setProfile(p);
    saveProfile(p);
    setLastBooking(booking);
    setSelected([]);
    setDraft(EMPTY_DRAFT);
    setPage('confirm');
  };

  const cancelBooking = (id: string) =>
    setBookings((list) => list.map((b) => (b.id === id ? { ...b, status: 'annullata' } : b)));

  const rebook = (b: Booking) => {
    setSelected(b.serviceIds);
    setDraft({ ...EMPTY_DRAFT, staffChoice: b.staffId });
    setPage('booking');
  };

  return (
    <div
      style={{
        background: COLORS.background,
        minHeight: '100dvh',
        maxWidth: '480px',
        margin: '0 auto',
        position: 'relative',
        fontFamily: FONT.family,
        color: COLORS.textPrimary,
        paddingBottom: `calc(${NAV_HEIGHT}px + ${SAFE.bottom})`,
        overflowX: 'hidden',
      }}
    >
      {page === 'home' && (
        <HomePage bookings={bookings} nextBooking={nextBooking} onNavigate={navigate} onQuickBook={quickBook} onBookWithStaff={bookWithStaff} />
      )}
      {page === 'services' && <ServicesPage selected={selected} onToggle={toggleService} onContinue={() => setPage('booking')} />}
      {page === 'booking' && (
        <BookingPage
          serviceIds={selected}
          draft={draft}
          setDraft={setDraft}
          bookings={bookings}
          profile={profile}
          onConfirm={confirmBooking}
          onBack={() => setPage('services')}
          onPickServices={() => setPage('services')}
        />
      )}
      {page === 'confirm' && lastBooking && (
        <ConfirmPage booking={lastBooking} onHome={() => setPage('home')} onManage={() => setPage('profile')} />
      )}
      {page === 'profile' && (
        <ProfilePage bookings={bookings} profile={profile} onCancel={cancelBooking} onRebook={rebook} onBookNew={() => setPage('services')} />
      )}
      <BottomNav current={page} onNavigate={navigate} badge={selected.length} />
    </div>
  );
}
