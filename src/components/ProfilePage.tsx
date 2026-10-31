import { useState } from 'react';
import { COLORS, HEADING, RADIUS, SHADOW, SAFE } from '../config/theme';
import { SALON } from '../config/salon';
import { getStaff } from '../data/staff';
import { downloadICS, formatLongDate, formatPrice, isUpcoming, mapsUrl, servicesFromIds, type Booking } from '../lib/booking';
import { CalendarIcon, ChatIcon, ClockIcon, PhoneIcon, PinIcon } from './Icons';
import { LargeTitle, PrimaryButton } from './ui';

interface Props {
  bookings: Booking[];
  profile: { name: string; phone: string };
  onCancel: (id: string) => void;
  onRebook: (b: Booking) => void;
  onBookNew: () => void;
}

const DAYS = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
const DAY_INDEX = [1, 2, 3, 4, 5, 6, 0];

export default function ProfilePage({ bookings, profile, onCancel, onRebook, onBookNew }: Props) {
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const sorted = [...bookings].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const upcoming = sorted.filter((b) => b.status === 'confermata' && isUpcoming(b));
  const past = sorted.filter((b) => b.status === 'annullata' || !isUpcoming(b)).reverse();

  const card = { background: COLORS.cardBg, borderRadius: RADIUS.lg, padding: '16px', boxShadow: SHADOW.card } as const;
  const linkRow = { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', color: COLORS.textPrimary, textDecoration: 'none', fontSize: '16px' } as const;

  return (
    <div style={{ paddingTop: `calc(${SAFE.top} + 16px)`, animation: 'fadeUp 0.3s ease' }}>
      <LargeTitle>{profile.name ? `Ciao, ${profile.name.split(' ')[0]}` : 'Profilo'}</LargeTitle>

      <h2 style={{ ...HEADING, fontSize: '22px', margin: '8px 20px 12px' }}>I miei appuntamenti</h2>
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {upcoming.length === 0 && (
          <div style={{ ...card, textAlign: 'center' }}>
            <div style={{ fontSize: '15px', color: COLORS.textSecondary, marginBottom: '12px' }}>Nessun appuntamento in programma.</div>
            <PrimaryButton onClick={onBookNew}>Prenota ora</PrimaryButton>
          </div>
        )}
        {upcoming.map((b) => (
          <div key={b.id} style={card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: COLORS.taupeDark, fontSize: '14px', fontWeight: 600 }}>
              <CalendarIcon size={18} /> {formatLongDate(b.date)} · {b.time}
            </div>
            <div style={{ fontSize: '18px', fontWeight: 600, marginTop: '6px' }}>{servicesFromIds(b.serviceIds).map((s) => s.name).join(' + ')}</div>
            <div style={{ fontSize: '15px', color: COLORS.textSecondary, marginTop: '2px' }}>con {getStaff(b.staffId)?.name} · {formatPrice(b.total)}</div>
            {confirmId === b.id ? (
              <div style={{ marginTop: '12px', background: COLORS.dangerSoft, borderRadius: RADIUS.md, padding: '12px' }}>
                <div style={{ fontSize: '15px', marginBottom: '10px' }}>Vuoi davvero annullare questo appuntamento?</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setConfirmId(null)} style={{ flex: 1, height: '42px', borderRadius: RADIUS.pill, border: `1px solid ${COLORS.borderStrong}`, background: COLORS.white, fontSize: '15px', fontWeight: 600, cursor: 'pointer', color: COLORS.textPrimary }}>No, tienilo</button>
                  <button onClick={() => { onCancel(b.id); setConfirmId(null); }} style={{ flex: 1, height: '42px', borderRadius: RADIUS.pill, border: 'none', background: COLORS.danger, color: COLORS.white, fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>Sì, annulla</button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <button onClick={() => downloadICS(b)} style={{ flex: 1, height: '40px', borderRadius: RADIUS.pill, border: `1px solid ${COLORS.borderStrong}`, background: COLORS.white, fontSize: '14px', fontWeight: 600, cursor: 'pointer', color: COLORS.textPrimary }}>Calendario</button>
                <button onClick={() => setConfirmId(b.id)} style={{ flex: 1, height: '40px', borderRadius: RADIUS.pill, border: `1px solid ${COLORS.borderStrong}`, background: COLORS.white, fontSize: '14px', fontWeight: 600, cursor: 'pointer', color: COLORS.danger }}>Annulla</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {past.length > 0 && (
        <>
          <h2 style={{ ...HEADING, fontSize: '22px', margin: '28px 20px 12px' }}>Storico</h2>
          <div style={{ margin: '0 20px', ...card, padding: '4px 16px' }}>
            {past.slice(0, 6).map((b, i) => (
              <div key={b.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', padding: '12px 0', borderTop: i ? `1px solid ${COLORS.border}` : 'none' }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '15px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{servicesFromIds(b.serviceIds).map((s) => s.name).join(' + ')}</div>
                  <div style={{ fontSize: '13px', color: COLORS.textSecondary }}>
                    {formatLongDate(b.date)}{b.status === 'annullata' ? ' · annullato' : ''}
                  </div>
                </div>
                <button onClick={() => onRebook(b)} style={{ flexShrink: 0, height: '34px', padding: '0 14px', borderRadius: RADIUS.pill, border: 'none', background: COLORS.sandSoft, fontSize: '14px', fontWeight: 600, cursor: 'pointer', color: COLORS.textPrimary }}>Riprenota</button>
              </div>
            ))}
          </div>
        </>
      )}

      <h2 style={{ ...HEADING, fontSize: '22px', margin: '28px 20px 12px' }}>Il salone</h2>
      <div style={{ margin: '0 20px', ...card, padding: '4px 16px' }}>
        <a href={mapsUrl()} target="_blank" rel="noreferrer" style={linkRow}><PinIcon size={20} color={COLORS.taupeDark} />{SALON.address}, {SALON.city}</a>
        <a href={`tel:${SALON.phone.replace(/\s/g, '')}`} style={{ ...linkRow, borderTop: `1px solid ${COLORS.border}` }}><PhoneIcon size={20} color={COLORS.taupeDark} />{SALON.phone}</a>
        <a href={`https://wa.me/${SALON.whatsapp}`} target="_blank" rel="noreferrer" style={{ ...linkRow, borderTop: `1px solid ${COLORS.border}` }}><ChatIcon size={20} color={COLORS.taupeDark} />Scrivici su WhatsApp</a>
      </div>

      <div style={{ margin: '12px 20px 0', ...card }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: 600, marginBottom: '8px' }}>
          <ClockIcon size={18} color={COLORS.taupeDark} /> Orari
        </div>
        {DAYS.map((d, i) => {
          const h = SALON.hours[DAY_INDEX[i]];
          const today = new Date().getDay() === DAY_INDEX[i];
          return (
            <div key={d} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', padding: '4px 0', fontWeight: today ? 600 : 400, color: h ? COLORS.textPrimary : COLORS.textMuted }}>
              <span>{d}</span>
              <span style={{ fontVariantNumeric: 'tabular-nums' }}>{h ? `${h.open} – ${h.close}` : 'Chiuso'}</span>
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: 'center', fontSize: '12px', color: COLORS.textMuted, margin: '24px 20px 28px' }}>
        Suggerimento: su iPhone tocca Condividi → “Aggiungi alla schermata Home” per usare {SALON.name} come un'app.
      </div>
    </div>
  );
}
