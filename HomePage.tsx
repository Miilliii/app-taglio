import { COLORS, RADIUS, SAFE, SHADOW } from '../config/theme';
import { IMAGES } from '../config/images';
import { SALON } from '../config/salon';
import { SERVICES } from '../data/services';
import { STAFF, getStaff } from '../data/staff';
import { firstFreeSlotToday, formatLongDate, formatPrice, openStatus, servicesFromIds, type Booking } from '../lib/booking';
import { BellIcon, CalendarIcon, ChevronRight, StarIcon } from './Icons';
import { Avatar, Photo, PrimaryButton, SectionTitle } from './ui';
import type { Page } from './BottomNav';

interface Props {
  bookings: Booking[];
  nextBooking: Booking | null;
  onNavigate: (p: Page) => void;
  onQuickBook: (serviceId: string) => void;
  onBookWithStaff: (staffId: string) => void;
}

export default function HomePage({ bookings, nextBooking, onNavigate, onQuickBook, onBookWithStaff }: Props) {
  const status = openStatus();
  const freeSlot = firstFreeSlotToday(bookings);
  const popular = SERVICES.filter((s) => s.popular);

  return (
    <div style={{ animation: 'fadeUp 0.35s ease' }}>
      {/* Header */}
      <div style={{ padding: `calc(${SAFE.top} + 12px) 20px 12px`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px' }}>{SALON.name}</div>
          <div style={{ fontSize: '13px', color: COLORS.textSecondary, marginTop: '2px' }}>{SALON.type} · {SALON.city}</div>
        </div>
        <button
          onClick={() => onNavigate('profile')}
          aria-label="I miei appuntamenti"
          style={{ width: '44px', height: '44px', borderRadius: '50%', border: 'none', background: COLORS.cardBg, boxShadow: SHADOW.card, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', cursor: 'pointer', color: COLORS.textPrimary }}
        >
          <BellIcon size={22} />
          {nextBooking && <span style={{ position: 'absolute', top: '10px', right: '11px', width: '8px', height: '8px', borderRadius: '50%', background: COLORS.taupe }} />}
        </button>
      </div>

      {/* Hero */}
      <div style={{ margin: '4px 20px 0', position: 'relative', borderRadius: RADIUS.lg, overflow: 'hidden', boxShadow: SHADOW.card }}>
        <Photo src={IMAGES.hero} alt={`Interno del salone ${SALON.name}`} label="Foto del salone" style={{ width: '100%', height: '200px' }} />
        <div
          style={{
            position: 'absolute',
            left: '12px',
            bottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            background: 'rgba(255,255,255,0.88)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: RADIUS.pill,
            padding: '7px 12px',
            fontSize: '13px',
            fontWeight: 600,
          }}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: status.open ? COLORS.success : COLORS.textMuted }} />
          {status.label}
        </div>
      </div>

      <h1 style={{ fontSize: '30px', fontWeight: 700, letterSpacing: '-0.6px', lineHeight: 1.12, margin: '20px 20px 16px' }}>{SALON.tagline}</h1>

      <div style={{ padding: '0 20px' }}>
        <PrimaryButton onClick={() => onNavigate('services')}>Prenota ora</PrimaryButton>
      </div>

      {/* Prossimo appuntamento o slot libero */}
      {nextBooking ? (
        <button
          onClick={() => onNavigate('profile')}
          style={{ margin: '12px 20px 0', width: 'calc(100% - 40px)', border: 'none', textAlign: 'left', background: COLORS.taupe, color: COLORS.white, borderRadius: RADIUS.md, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <CalendarIcon size={24} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', opacity: 0.85 }}>Il tuo prossimo appuntamento</div>
            <div style={{ fontSize: '16px', fontWeight: 600, marginTop: '2px' }}>
              {formatLongDate(nextBooking.date)} · {nextBooking.time}
            </div>
            <div style={{ fontSize: '13px', opacity: 0.85, marginTop: '2px' }}>
              {servicesFromIds(nextBooking.serviceIds).map((s) => s.name).join(' + ')} con {getStaff(nextBooking.staffId)?.name}
            </div>
          </div>
          <ChevronRight size={20} />
        </button>
      ) : (
        <button
          onClick={() => onNavigate('services')}
          style={{ margin: '12px 20px 0', width: 'calc(100% - 40px)', border: 'none', textAlign: 'left', background: COLORS.taupe, color: COLORS.white, borderRadius: RADIUS.md, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
        >
          <div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>{freeSlot ? 'Prossimo slot libero oggi' : 'Oggi siamo al completo'}</div>
            <div style={{ fontSize: '22px', fontWeight: 700, marginTop: '2px' }}>{freeSlot ?? 'Scegli un altro giorno'}</div>
          </div>
          <ChevronRight size={22} />
        </button>
      )}

      {/* Servizi popolari */}
      <SectionTitle
        action={
          <button onClick={() => onNavigate('services')} style={{ border: 'none', background: 'none', color: COLORS.taupeDark, fontSize: '15px', fontWeight: 500, cursor: 'pointer', padding: '6px 0' }}>
            Vedi tutti
          </button>
        }
      >
        Servizi popolari
      </SectionTitle>
      <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', padding: '0 20px 6px', scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
        {popular.map((s) => (
          <button
            key={s.id}
            onClick={() => onQuickBook(s.id)}
            style={{ flexShrink: 0, width: '150px', border: 'none', background: 'transparent', padding: 0, textAlign: 'left', cursor: 'pointer', scrollSnapAlign: 'start', color: COLORS.textPrimary }}
          >
            <Photo src={s.image} alt={s.name} label={s.category} style={{ width: '150px', height: '110px', borderRadius: RADIUS.md }} />
            <div style={{ fontSize: '16px', fontWeight: 600, marginTop: '8px' }}>{s.name}</div>
            <div style={{ fontSize: '15px', color: COLORS.textSecondary, marginTop: '2px' }}>{formatPrice(s.price)}</div>
          </button>
        ))}
      </div>

      {/* Team */}
      <SectionTitle>Il nostro team</SectionTitle>
      <div style={{ display: 'flex', gap: '18px', overflowX: 'auto', padding: '0 20px 4px' }}>
        {STAFF.map((m) => (
          <button
            key={m.id}
            onClick={() => onBookWithStaff(m.id)}
            style={{ flexShrink: 0, border: 'none', background: 'transparent', padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer', color: COLORS.textPrimary }}
          >
            <Avatar src={m.image} name={m.name} size={72} />
            <span style={{ fontSize: '15px', fontWeight: 500 }}>{m.name}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '12px', color: COLORS.textSecondary }}>
              <StarIcon size={12} color={COLORS.taupe} /> {m.rating.toFixed(1)}
            </span>
          </button>
        ))}
      </div>

      {/* Promo */}
      <div style={{ margin: '28px 20px 0', background: COLORS.sandSoft, borderRadius: RADIUS.lg, padding: '20px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: '-30px', top: '-30px', width: '120px', height: '120px', borderRadius: '50%', background: COLORS.sand }} />
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.4px' }}>{SALON.promo.title}</div>
          <div style={{ fontSize: '15px', color: COLORS.textSecondary, marginTop: '6px', maxWidth: '240px', lineHeight: 1.4 }}>{SALON.promo.text}</div>
          <button
            onClick={() => onNavigate('services')}
            style={{ marginTop: '14px', border: 'none', background: COLORS.black, color: COLORS.white, borderRadius: RADIUS.pill, padding: '10px 18px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}
          >
            Approfitta
          </button>
        </div>
      </div>

      <div style={{ height: '28px' }} />
    </div>
  );
}
