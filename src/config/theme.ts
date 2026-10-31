// Design system — Stile B "Minimal Sand"
// Unica fonte di verità per colori, raggi e ombre.

export const COLORS = {
  background: '#F8F5EF',
  cardBg: '#FFFFFF',
  sand: '#E6D9C5',
  sandSoft: '#F1E9DD',
  sandLight: '#F7F1E8',
  taupe: '#8C6F52',
  taupeDark: '#6F5640',
  black: '#1A1512',
  textPrimary: '#1A1512',
  textSecondary: '#5F554B',
  textMuted: '#857A6E',
  border: '#E8E0D4',
  borderStrong: '#D4C7B5',
  success: '#3F8F5B',
  successSoft: '#E6F2EA',
  danger: '#B4483C',
  dangerSoft: '#F7E7E4',
  white: '#FFFFFF',
  glass: 'rgba(248, 245, 239, 0.86)',
};

export const GRADIENT = {
  ink: 'linear-gradient(160deg, #2E251E 0%, #15110E 100%)',
  sand: 'linear-gradient(145deg, #F7F1E8 0%, #E6D9C5 100%)',
  heroOverlay: 'linear-gradient(180deg, rgba(21,17,14,0.42) 0%, rgba(21,17,14,0) 30%, rgba(21,17,14,0.38) 58%, rgba(21,17,14,0.88) 100%)',
};

export const RADIUS = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '22px',
  pill: '999px',
};

export const SHADOW = {
  card: '0 1px 2px rgba(26,21,18,0.04), 0 8px 24px rgba(92,72,52,0.07)',
  float: '0 14px 34px rgba(26,21,18,0.28)',
};

export const FONT = {
  family: "'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', system-ui, sans-serif",
  display: "'Playfair Display', Georgia, 'Times New Roman', serif",
};

// Titoli in serif ed etichette piccole: stessa tipografia in tutte le pagine
export const HEADING = { fontFamily: FONT.display, fontWeight: 500, letterSpacing: '-0.2px' } as const;
export const EYEBROW = { fontSize: '11px', fontWeight: 600, letterSpacing: '1.6px', textTransform: 'uppercase' } as const;

// Safe area iOS (notch / Dynamic Island / home indicator)
export const SAFE = {
  top: 'env(safe-area-inset-top, 0px)',
  bottom: 'env(safe-area-inset-bottom, 0px)',
};

export const NAV_HEIGHT = 64;
