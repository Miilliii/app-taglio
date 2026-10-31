import { useEffect, useMemo, useRef, useState } from 'react';
import { COLORS, HEADING, RADIUS, SAFE, SHADOW } from '../config/theme';
import { SALON } from '../config/salon';
import {
  eligibleStaff,
  formatDuration,
  formatPrice,
  fromISODate,
  getSlots,
  isOpen,
  isValidItalianPhone,
  monthLabel,
  nextDays,
  pricing,
  servicesFromIds,
  toISODate,
  totalDuration,
  weekdayShort,
  type Booking,
} from '../lib/booking';
import { CalendarIcon } from './Icons';
import { Avatar, PageHeader, PrimaryButton } from './ui';

export interface BookingDraft {
  staffChoice: string; // 'any' | staffId
  date: string | null;
  time: string | null;
  assignedStaffId: string | null;
}

interface Props {
  serviceIds: string[];
  draft: BookingDraft;
  setDraft: (d: BookingDraft) => void;
  bookings: Booking[];
  profile: { name: string; phone: string };
  onConfirm: (data: { name: string; phone: string; whatsapp: boolean }) => void;
  onBack: () => void;
  onPickServices: () => void;
}

const sectionTitle = { ...HEADING, fontSize: '22px', margin: '24px 20px 12px' } as const;

const inputStyle = {
  width: '100%',
  height: '50px',
  borderRadius: RADIUS.md,
  border: `1px solid ${COLORS.border}`,
  background: COLORS.cardBg,
  padding: '0 14px',
  fontSize: '16px',
  color: COLORS.textPrimary,
  outline: 'none',
} as const;

export default function BookingPage({ serviceIds, draft, setDraft, bookings, profile, onConfirm, onBack, onPickServices }: Props) {
  const services = servicesFromIds(serviceIds);
  const duration = totalDuration(services);
  const candidates = eligibleStaff(services);
  const days = useMemo(() => nextDays(SALON.bookingDaysAhead), []);
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [whatsapp, setWhatsapp] = useState(true);
  const [touched, setTouched] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  // data di default: primo giorno aperto
  useEffect(() => {
    if (!draft.date) {
      const first = days.find(isOpen);
      if (first) setDraft({ ...draft, date: toISODate(first) });
    }
    // se il professionista scelto non può fare i servizi, torna a "Qualsiasi"
    if (draft.staffChoice !== 'any' && !candidates.some((c) => c.id === draft.staffChoice)) {
      setDraft({ ...draft, staffChoice: 'any', time: null, assignedStaffId: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const slots = useMemo(
    () => (draft.date ? getSlots(draft.date, duration, draft.staffChoice, candidates, bookings) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [draft.date, draft.staffChoice, duration, bookings, serviceIds.join(',')],
  );

  if (services.length === 0) {
    return (
      <div style={{ animation: 'fadeUp 0.3s ease' }}>
        <PageHeader title="Prenota" />
        <div style={{ textAlign: 'center', padding: '80px 32px 0' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: COLORS.sandSoft, color: COLORS.taupeDark, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
            <CalendarIcon size={32} />
          </div>
          <div style={{ fontSize: '22px', fontWeight: 700 }}>Scegli prima un servizio</div>
          <div style={{ fontSize: '15px', color: COLORS.textSecondary, marginTop: '8px', lineHeight: 1.45 }}>
            Seleziona uno o più servizi e poi scegli professionista, giorno e orario.
          </div>
          <div style={{ marginTop: '24px' }}>
            <PrimaryButton onClick={onPickServices}>Vai ai servizi</PrimaryButton>
          </div>
        </div>
      </div>
    );
  }

  const { subtotal, discount, total } = pricing(services, draft.date);
  const nameOk = name.trim().length >= 2;
  const phoneOk = isValidItalianPhone(phone);
  const canConfirm = !!draft.date && !!draft.time && nameOk && phoneOk;
  const selectedDay = draft.date ? fromISODate(draft.date) : days[0];
  const step = !draft.time ? 2 : 3;

  const submit = () => {
    setTouched(true);
    if (!draft.time) return;
    if (!nameOk || !phoneOk) {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    onConfirm({ name: name.trim(), phone: phone.trim(), whatsapp });
  };

  return (
    <div style={{ animation: 'fadeUp 0.3s ease' }}>
      <PageHeader title="Prenota" onBack={onBack} />

      {/* Progress */}
      <div style={{ padding: '0 20px' }}>
        <div style={{ height: '4px', borderRadius: '2px', background: COLORS.border, overflow: 'hidden' }}>
          <div style={{ width: `${(step / 3) * 100}%`, height: '100%', background: COLORS.taupe, transition: 'width 0.35s ease' }} />
        </div>
        <div style={{ textAlign: 'center', fontSize: '13px', color: COLORS.textSecondary, marginTop: '8px' }}>Passo {step} di 3</div>
      </div>

      {/* Professionista */}
      <h2 style={sectionTitle}>Scegli il professionista</h2>
      <div style={{ display: 'flex', gap: '14px', overflowX: 'auto', padding: '0 20px 4px' }}>
        {[{ id: 'any', name: 'Qualsiasi', image: '' }, ...candidates].map((m) => {
          const sel = draft.staffChoice === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setDraft({ ...draft, staffChoice: m.id, time: null, assignedStaffId: null })}
              aria-pressed={sel}
              style={{ flexShrink: 0, border: 'none', background: 'transparent', padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer', color: COLORS.textPrimary }}
            >
              <Avatar src={m.image} name={m.name} size={68} selected={sel} />
              <span style={{ fontSize: '14px', fontWeight: sel ? 600 : 500 }}>{m.name}</span>
            </button>
          );
        })}
      </div>

      {/* Giorno */}
      <h2 style={sectionTitle}>{monthLabel(selectedDay)}</h2>
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '0 20px 4px', scrollSnapType: 'x proximity', scrollPaddingLeft: '20px' }}>
        {days.map((d) => {
          const iso = toISODate(d);
          const open = isOpen(d);
          const sel = draft.date === iso;
          return (
            <button
              key={iso}
              disabled={!open}
              onClick={() => setDraft({ ...draft, date: iso, time: null, assignedStaffId: null })}
              aria-pressed={sel}
              aria-label={`${weekdayShort(d)} ${d.getDate()}${open ? '' : ', chiuso'}`}
              style={{
                flexShrink: 0,
                width: '58px',
                height: '72px',
                borderRadius: RADIUS.md,
                border: 'none',
                background: sel ? COLORS.taupe : 'transparent',
                color: sel ? COLORS.white : open ? COLORS.textPrimary : COLORS.textMuted,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                cursor: open ? 'pointer' : 'not-allowed',
                scrollSnapAlign: 'start',
                transition: 'background 0.2s ease',
              }}
            >
              <span style={{ fontSize: '14px' }}>{weekdayShort(d)}</span>
              <span style={{ fontSize: '22px', fontWeight: 600 }}>{d.getDate()}</span>
              {!open && <span style={{ fontSize: '10px', marginTop: '-3px' }}>chiuso</span>}
            </button>
          );
        })}
      </div>

      {/* Orari */}
      <div style={{ margin: '16px 20px 0', borderTop: `1px solid ${COLORS.border}`, paddingTop: '16px' }}>
        {slots.length === 0 || slots.every((s) => !s.available) ? (
          <div style={{ textAlign: 'center', color: COLORS.textSecondary, fontSize: '15px', padding: '16px 0' }}>
            Nessun orario disponibile in questo giorno. Prova un'altra data{draft.staffChoice !== 'any' ? ' o scegli “Qualsiasi”' : ''}.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {slots.map((s) => {
              const sel = draft.time === s.time;
              return (
                <button
                  key={s.time}
                  disabled={!s.available}
                  onClick={() => setDraft({ ...draft, time: s.time, assignedStaffId: s.staffId ?? null })}
                  aria-pressed={sel}
                  style={{
                    height: '44px',
                    borderRadius: RADIUS.sm,
                    border: sel ? 'none' : `1px solid ${s.available ? COLORS.borderStrong : 'transparent'}`,
                    background: sel ? COLORS.taupe : s.available ? COLORS.cardBg : COLORS.border,
                    color: sel ? COLORS.white : s.available ? COLORS.textPrimary : COLORS.textMuted,
                    fontSize: '16px',
                    fontWeight: sel ? 600 : 500,
                    textDecoration: s.available ? 'none' : 'line-through',
                    cursor: s.available ? 'pointer' : 'not-allowed',
                    fontVariantNumeric: 'tabular-nums',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {s.time}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Dati cliente */}
      <h2 style={sectionTitle}>I tuoi dati</h2>
      <div ref={formRef} style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome e cognome" autoComplete="name" aria-label="Nome e cognome" style={{ ...inputStyle, borderColor: touched && !nameOk ? COLORS.danger : COLORS.border }} />
          {touched && !nameOk && <div style={{ color: COLORS.danger, fontSize: '13px', marginTop: '4px' }}>Inserisci il tuo nome.</div>}
        </div>
        <div>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Cellulare (es. 333 1234567)" type="tel" inputMode="tel" autoComplete="tel" aria-label="Numero di cellulare" style={{ ...inputStyle, borderColor: touched && !phoneOk ? COLORS.danger : COLORS.border }} />
          {touched && !phoneOk && <div style={{ color: COLORS.danger, fontSize: '13px', marginTop: '4px' }}>Inserisci un numero italiano valido.</div>}
        </div>
        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', padding: '6px 2px', fontSize: '15px', cursor: 'pointer' }}>
          <span>Promemoria su WhatsApp 1 h prima</span>
          <Toggle checked={whatsapp} onChange={setWhatsapp} />
        </label>
      </div>

      {/* Riepilogo */}
      <div style={{ margin: '16px 20px 0', background: COLORS.cardBg, borderRadius: RADIUS.lg, padding: '16px', boxShadow: SHADOW.card }}>
        {services.map((s) => (
          <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', padding: '3px 0' }}>
            <span>{s.name} · {formatDuration(s.duration)}</span>
            <span>{formatPrice(s.price)}</span>
          </div>
        ))}
        {discount > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', padding: '3px 0', color: COLORS.success }}>
            <span>{SALON.promo.title}</span>
            <span>−{formatPrice(discount)}</span>
          </div>
        )}
        <div style={{ borderTop: `1px solid ${COLORS.border}`, marginTop: '8px', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '17px', fontWeight: 700 }}>
          <span>Totale · {formatDuration(duration)}</span>
          <span>
            {discount > 0 && <span style={{ textDecoration: 'line-through', color: COLORS.textMuted, fontWeight: 500, marginRight: '6px', fontSize: '15px' }}>{formatPrice(subtotal)}</span>}
            {formatPrice(total)}
          </span>
        </div>
        <div style={{ fontSize: '13px', color: COLORS.textSecondary, marginTop: '6px' }}>Pagamento in salone. Disdetta gratuita fino a 2 ore prima.</div>
      </div>

      <div style={{ padding: '16px 20px 0' }}>
        <PrimaryButton variant="taupe" onClick={submit} disabled={!draft.time}>
          {draft.time ? 'Conferma prenotazione' : 'Scegli un orario'}
        </PrimaryButton>
        {!canConfirm && draft.time && touched && (
          <div style={{ textAlign: 'center', fontSize: '13px', color: COLORS.textSecondary, marginTop: '8px' }}>Completa i tuoi dati per confermare.</div>
        )}
      </div>
      <div style={{ height: `calc(${SAFE.bottom} + 24px)` }} />
    </div>
  );
}

export const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    style={{ width: '51px', height: '31px', borderRadius: '16px', border: 'none', background: checked ? COLORS.taupe : COLORS.borderStrong, position: 'relative', cursor: 'pointer', transition: 'background 0.2s ease', flexShrink: 0, padding: 0 }}
  >
    <span style={{ position: 'absolute', top: '2px', left: checked ? '22px' : '2px', width: '27px', height: '27px', borderRadius: '50%', background: COLORS.white, boxShadow: '0 2px 4px rgba(0,0,0,0.2)', transition: 'left 0.2s ease' }} />
  </button>
);
