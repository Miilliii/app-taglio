import { COLORS, EYEBROW, GRADIENT, HEADING, RADIUS, SAFE, SHADOW } from '../config/theme';
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

const infoCard = {
  margin: '12px 20px 0',
  width: 'calc(100% - 40px)',
  border: `1px solid ${COLORS.border}`,
  textAlign: 'left',
  background: COLORS.cardBg,
  color: COLORS.textPrimary,
  borderRadius: RADIUS.lg,
  padding: '14px 16px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  cursor: 'pointer',
  boxShadow: SHADOW.card,
} as const;

export default function HomePage({ bookings, nextBooking, onNavigate, onQuickBook, onBookWithStaff }: Props) {
  const status = openStatus();
  const freeSlot = firstFreeSlotToday(bookings);
  const popular = SERVICES.filter((s) => s.popular);

  return (
    <div style={{ animation: 'fadeUp 0.35s ease' }}>
      {/* Hero */}
      <div style={{ position: 'relative', height: `calc(${SAFE.top} + 440px)`, overflow: 'hidden', background: COLORS.black }}>
        <Photo src={IMAGES.hero} alt={`Interno del salone ${SALON.name}`} label="Foto del salone" style={{ width: '100%', height: '100%', objectPosition: '38% center' }} />
        <div style={{ position: 'absolute', inset: 0, background: GRADIENT.heroOverlay }} />

        <div style={{ position: 'absolute', top: `calc(${SAFE.top} + 12px)`, left: '20px', right: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: COLORS.white }}>
          <div style={{ fontFamily: HEADING.fontFamily, fontSize: '22px', fontWeight: 500, letterSpacing: '4px' }}>{SALON.name}</div>
          <button
            onClick={() => onNavigate('profile')}
            aria-label="I miei appuntamenti"
            style={{ width: '44px', height: '44px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.28)', background: 'rgba(21,17,14,0.28)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', cursor: 'pointer', color: COLORS.white }}
          >
            <BellIcon size={21} />
            {nextBooking && <span style={{ position: 'absolute', top: '10px', right: '11px', width: '8px', height: '8px', borderRadius: '50%', background: COLORS.sand }} />}
          </button>
        </div>

        <div style={{ position: 'absolute', left: '20px', right: '20px', bottom: '22px', color: COLORS.white }}>
          <div style={{ ...EYEBROW, opacity: 0.88 }}>{SALON.type} · {SALON.city}</div>
          <h1 style={{ ...HEADING, fontSize: '33px', lineHeight: 1.16, margin: '8px 0 12px' }}>{SALON.tagline}</h1>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontSize: '13px', fontWeight: 500 }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: status.open ? '#7FCB98' : COLORS.sand }} />
            {status.label}
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 20px 0' }}>
        <PrimaryButton onClick={() => onNavigate('services')}>Prenota ora</PrimaryButton>
      </div>

      {/* Prossimo appuntamento o slot libero */}
      {nextBooking ? (
        <button onClick={() => onNavigate('profile')} style={infoCard}>
          <CalendarIcon size={24} color={COLORS.taupe} />
          <div style={{ flex: 1 }}>
            <div style={{ ...EYEBROW, color: COLORS.taupeDark }}>Il tuo prossimo appuntamento</div>
            <div style={{ fontSize: '16px', fontWeight: 600, marginTop: '4px' }}>
              {formatLongDate(nextBooking.date)} · {nextBooking.time}
            </div>
            <div style={{ fontSize: '13px', color: COLORS.textSecondary, marginTop: '2px' }}>
              {servicesFromIds(nextBooking.serviceIds).map((s) => s.name).join(' + ')} con {getStaff(nextBooking.staffId)?.name}
            </div>
          </div>
          <ChevronRight size={20} color={COLORS.taupeDark} />
        </button>
      ) : (
        <button onClick={() => onNavigate('services')} style={{ ...infoCard, justifyContent: 'space-between' }}>
          <div>
            <div style={{ ...EYEBROW, color: COLORS.taupeDark }}>{freeSlot ? 'Prossimo orario libero oggi' : 'Oggi siamo al completo'}</div>
            <div style={{ ...HEADING, fontSize: '23px', marginTop: '5px' }}>{freeSlot ?? 'Scegli un altro giorno'}</div>
          </div>
          <ChevronRight size={22} color={COLORS.taupeDark} />
        </button>
      )}

      {/* Servizi popolari */}
      <SectionTitle
        action={
          <button onClick={() => onNavigate('services')} style={{ border: 'none', background: 'none', color: COLORS.taupeDark, fontSize: '14px', fontWeight: 500, cursor: 'pointer', padding: '6px 0' }}>
            Vedi tutti
          </button>
        }
      >
        I più richiesti
      </SectionTitle>
      <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', padding: '0 20px 6px', scrollSnapType: 'x mandatory', scrollPaddingLeft: '20px', WebkitOverflowScrolling: 'touch' }}>
        {popular.map((s) => (
          <button
            key={s.id}
            onClick={() => onQuickBook(s.id)}
            style={{ flexShrink: 0, width: '164px', border: 'none', background: 'transparent', padding: 0, textAlign: 'left', cursor: 'pointer', scrollSnapAlign: 'start', color: COLORS.textPrimary }}
          >
            <Photo src={s.image} alt={s.name} label={s.category} style={{ width: '164px', height: '204px', borderRadius: RADIUS.lg }} />
            <div style={{ fontSize: '15px', fontWeight: 600, marginTop: '10px' }}>{s.name}</div>
            <div style={{ fontSize: '14px', color: COLORS.textSecondary, marginTop: '2px' }}>{formatPrice(s.price)}</div>
          </button>
        ))}
      </div>

      {/* Team */}
      <SectionTitle>Il nostro team</SectionTitle>
      <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', padding: '0 20px 4px' }}>
        {STAFF.map((m) => (
          <button
            key={m.id}
            onClick={() => onBookWithStaff(m.id)}
            style={{ flexShrink: 0, width: '138px', border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.lg, background: COLORS.cardBg, padding: '14px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', color: COLORS.textPrimary }}
          >
            <Avatar src={m.image} name={m.name} size={76} />
            <span style={{ fontSize: '15px', fontWeight: 600, marginTop: '6px' }}>{m.name}</span>
            <span style={{ fontSize: '12px', color: COLORS.textSecondary, textAlign: 'center', lineHeight: 1.3, minHeight: '31px' }}>{m.role}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '12px', color: COLORS.textSecondary }}>
              <StarIcon size={12} color={COLORS.taupe} /> {m.rating.toFixed(1)}
            </span>
          </button>
        ))}
      </div>

      {/* Promo */}
      <div style={{ margin: '28px 20px 0', background: GRADIENT.ink, color: COLORS.white, borderRadius: RADIUS.xl, padding: '24px 22px' }}>
        <div style={{ ...EYEBROW, color: COLORS.sand }}>Offerta riservata</div>
        <div style={{ ...HEADING, fontSize: '27px', marginTop: '8px' }}>{SALON.promo.title}</div>
        <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.78)', marginTop: '8px', lineHeight: 1.5 }}>{SALON.promo.text}</div>
        <button
          onClick={() => onNavigate('services')}
          style={{ marginTop: '16px', border: 'none', background: COLORS.sand, color: COLORS.black, borderRadius: RADIUS.md, padding: '12px 18px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
        >
          Scopri i servizi
        </button>
      </div>

      <div style={{ height: '28px' }} />
    </div>
  );
}
