import { COLORS, NAV_HEIGHT, SAFE } from '../config/theme';
import { CalendarIcon, HomeIcon, ScissorsIcon, UserIcon } from './Icons';

export type Page = 'home' | 'services' | 'booking' | 'confirm' | 'profile';

const ITEMS: { id: Page; label: string; Icon: typeof HomeIcon }[] = [
  { id: 'home', label: 'Home', Icon: HomeIcon },
  { id: 'services', label: 'Servizi', Icon: ScissorsIcon },
  { id: 'booking', label: 'Prenota', Icon: CalendarIcon },
  { id: 'profile', label: 'Profilo', Icon: UserIcon },
];

export default function BottomNav({ current, onNavigate, badge }: { current: Page; onNavigate: (p: Page) => void; badge: number }) {
  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '480px',
        background: COLORS.glass,
        backdropFilter: 'saturate(180%) blur(20px)',
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        borderTop: `0.5px solid ${COLORS.border}`,
        display: 'flex',
        justifyContent: 'space-around',
        paddingBottom: SAFE.bottom,
        zIndex: 100,
      }}
    >
      {ITEMS.map(({ id, label, Icon }) => {
        const active = current === id || (id === 'booking' && current === 'confirm');
        return (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            aria-label={label}
            aria-current={active ? 'page' : undefined}
            style={{
              flex: 1,
              height: NAV_HEIGHT,
              border: 'none',
              background: 'transparent',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              color: active ? COLORS.textPrimary : COLORS.textMuted,
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            <div style={{ position: 'relative' }}>
              <Icon size={25} strokeWidth={active ? 2.1 : 1.7} />
              {id === 'booking' && badge > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-8px',
                    minWidth: '18px',
                    height: '18px',
                    borderRadius: '9px',
                    background: COLORS.taupe,
                    color: COLORS.white,
                    fontSize: '11px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 5px',
                  }}
                >
                  {badge}
                </span>
              )}
            </div>
            <span style={{ fontSize: '11px', fontWeight: active ? 600 : 500 }}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
