import type { CSSProperties, ReactNode } from 'react';
import { COLORS, GRADIENT, HEADING, RADIUS, SAFE } from '../config/theme';
import { ChevronLeft, ScissorsIcon } from './Icons';

// Immagine con fallback elegante color sabbia quando l'URL è vuoto
export const Photo = ({ src, alt, style, label }: { src: string; alt: string; style?: CSSProperties; label?: string }) =>
  src ? (
    <img src={src} alt={alt} loading="lazy" style={{ objectFit: 'cover', display: 'block', background: COLORS.sandSoft, ...style }} />
  ) : (
    <div
      role="img"
      aria-label={alt}
      style={{
        background: GRADIENT.sand,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        color: COLORS.taupeDark,
        ...style,
      }}
    >
      <ScissorsIcon size={22} strokeWidth={1.5} />
      {label && <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.3px', opacity: 0.8 }}>{label}</span>}
    </div>
  );

export const Avatar = ({ src, name, size = 64, selected = false }: { src: string; name: string; size?: number; selected?: boolean }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      padding: selected ? '3px' : '0',
      border: selected ? `2px solid ${COLORS.taupe}` : '2px solid transparent',
      transition: 'all 0.2s ease',
      flexShrink: 0,
    }}
  >
    {src ? (
      <img src={src} alt={name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
    ) : (
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: COLORS.sand,
          color: COLORS.taupeDark,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 600,
          fontSize: size * 0.36,
        }}
      >
        {name === 'Qualsiasi' ? '★' : name.charAt(0)}
      </div>
    )}
  </div>
);

export const PageHeader = ({ title, onBack, right }: { title: string; onBack?: () => void; right?: ReactNode }) => (
  <div
    style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: COLORS.glass,
      backdropFilter: 'saturate(180%) blur(20px)',
      WebkitBackdropFilter: 'saturate(180%) blur(20px)',
      paddingTop: `calc(${SAFE.top} + 8px)`,
      paddingBottom: '8px',
      paddingLeft: '8px',
      paddingRight: '16px',
      display: 'flex',
      alignItems: 'center',
      minHeight: '52px',
    }}
  >
    <div style={{ width: '44px', display: 'flex' }}>
      {onBack && (
        <button
          onClick={onBack}
          aria-label="Indietro"
          style={{ width: '44px', height: '44px', border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.textPrimary, cursor: 'pointer', padding: 0 }}
        >
          <ChevronLeft size={26} />
        </button>
      )}
    </div>
    <div style={{ flex: 1, textAlign: 'center', fontSize: '17px', fontWeight: 600 }}>{title}</div>
    <div style={{ width: '36px', display: 'flex', justifyContent: 'flex-end' }}>{right}</div>
  </div>
);

export const LargeTitle = ({ children }: { children: ReactNode }) => (
  <h1 style={{ ...HEADING, fontSize: '34px', margin: '4px 20px 16px', lineHeight: 1.15 }}>{children}</h1>
);

export const SectionTitle = ({ children, action }: { children: ReactNode; action?: ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '28px 20px 12px' }}>
    <h2 style={{ ...HEADING, fontSize: '22px', margin: 0 }}>{children}</h2>
    {action}
  </div>
);

export const PrimaryButton = ({
  children,
  onClick,
  disabled,
  variant = 'dark',
  style,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'dark' | 'taupe' | 'outline';
  style?: CSSProperties;
}) => {
  const variants: Record<string, CSSProperties> = {
    dark: { background: GRADIENT.ink, color: COLORS.white, border: 'none' },
    taupe: { background: COLORS.taupe, color: COLORS.white, border: 'none' },
    outline: { background: COLORS.cardBg, color: COLORS.textPrimary, border: `1px solid ${COLORS.borderStrong}` },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%',
        minHeight: '54px',
        borderRadius: RADIUS.md,
        fontSize: '16px',
        fontWeight: 600,
        letterSpacing: '0.2px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        transition: 'transform 0.12s ease, opacity 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '0 20px',
        ...variants[variant],
        ...style,
      }}
      onPointerDown={(e) => !disabled && (e.currentTarget.style.transform = 'scale(0.98)')}
      onPointerUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      onPointerLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      {children}
    </button>
  );
};

export const Chip = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    style={{
      flexShrink: 0,
      height: '38px',
      padding: '0 18px',
      borderRadius: RADIUS.pill,
      border: `1px solid ${active ? COLORS.black : COLORS.border}`,
      background: active ? COLORS.black : COLORS.cardBg,
      color: active ? COLORS.white : COLORS.textPrimary,
      fontSize: '14px',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    }}
  >
    {label}
  </button>
);
