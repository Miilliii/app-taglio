import { COLORS, RADIUS, SAFE, SHADOW } from '../config/theme';
import { SALON } from '../config/salon';
import { getStaff } from '../data/staff';
import { downloadICS, formatDuration, formatLongDate, formatPrice, mapsUrl, servicesFromIds, type Booking } from '../lib/booking';
import { CalendarIcon, CheckIcon, PinIcon } from './Icons';
import { PrimaryButton } from './ui';

interface Props {
  booking: Booking;
  onHome: () => void;
  onManage: () => void;
}

export default function ConfirmPage({ booking, onHome, onManage }: Props) {
  const services = servicesFromIds(booking.serviceIds);
  const staff = getStaff(booking.staffId);

  return (
    <div style={{ padding: `calc(${SAFE.top} + 40px) 20px 24px`, animation: 'fadeUp 0.3s ease' }}>
      <div style={{ width: '96px', height: '96px', borderRadius: '50%', background: COLORS.sandSoft, color: COLORS.taupeDark, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', animation: 'pop 0.5s ease' }}>
        <CheckIcon size={46} strokeWidth={2.6} />
      </div>
      <h1 style={{ textAlign: 'center', fontSize: '28px', fontWeight: 700, letterSpacing: '-0.5px', margin: '22px 0 6px' }}>Prenotazione confermata!</h1>
      <p style={{ textAlign: 'center', color: COLORS.textSecondary, fontSize: '15px', margin: 0 }}>
        Ti aspettiamo, {booking.customerName.split(' ')[0]}.
      </p>

      <div style={{ marginTop: '24px', background: COLORS.sandSoft, borderRadius: RADIUS.lg, padding: '18px', boxShadow: SHADOW.card }}>
        <div style={{ fontSize: '20px', fontWeight: 700 }}>{services.map((s) => s.name).join(' + ')}</div>
        <div style={{ fontSize: '17px', marginTop: '8px', lineHeight: 1.55 }}>
          <div>{formatLongDate(booking.date)} · {booking.time}</div>
          <div>con {staff?.name}</div>
          <div>Durata {formatDuration(booking.duration)}</div>
          <div>Totale {formatPrice(booking.total)} · paga in salone</div>
        </div>
        <a
          href={mapsUrl()}
          target="_blank"
          rel="noreferrer"
          style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '8px', color: COLORS.textPrimary, textDecoration: 'none', fontSize: '15px', borderTop: `1px solid ${COLORS.sand}`, paddingTop: '12px' }}
        >
          <PinIcon size={20} color={COLORS.taupeDark} />
          {SALON.address}, {SALON.city}
        </a>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '18px' }}>
        <PrimaryButton variant="outline" onClick={() => downloadICS(booking)}>
          <CalendarIcon size={20} /> Aggiungi al calendario
        </PrimaryButton>
        <PrimaryButton variant="outline" onClick={() => window.open(mapsUrl(), '_blank')}>
          <PinIcon size={20} /> Indicazioni
        </PrimaryButton>
      </div>

      {booking.whatsappReminder && (
        <div style={{ marginTop: '14px', fontSize: '14px', color: COLORS.textSecondary, textAlign: 'center' }}>
          Riceverai un promemoria su WhatsApp 1 ora prima.
        </div>
      )}

      <button onClick={onManage} style={{ display: 'block', margin: '16px auto 0', border: 'none', background: 'none', color: COLORS.textPrimary, textDecoration: 'underline', fontSize: '15px', cursor: 'pointer', padding: '8px' }}>
        Modifica o annulla
      </button>

      <div style={{ marginTop: '16px' }}>
        <PrimaryButton variant="taupe" onClick={onHome}>Torna alla home</PrimaryButton>
      </div>
    </div>
  );
}
