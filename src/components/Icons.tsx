import type { CSSProperties } from 'react';

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: CSSProperties;
}

const base = (size: number, color: string, strokeWidth: number, style?: CSSProperties) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: color,
  strokeWidth,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  style: { display: 'block', flexShrink: 0, ...style },
  'aria-hidden': true,
});

export const HomeIcon = ({ size = 24, color = 'currentColor', strokeWidth = 1.8, style }: IconProps) => (
  <svg {...base(size, color, strokeWidth, style)}><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" /></svg>
);
export const ScissorsIcon = ({ size = 24, color = 'currentColor', strokeWidth = 1.8, style }: IconProps) => (
  <svg {...base(size, color, strokeWidth, style)}><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M20 4 8.1 15.9M14.5 14.5 20 20M8.1 8.1 12 12" /></svg>
);
export const CalendarIcon = ({ size = 24, color = 'currentColor', strokeWidth = 1.8, style }: IconProps) => (
  <svg {...base(size, color, strokeWidth, style)}><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M8 3v4M16 3v4M3 10h18" /></svg>
);
export const UserIcon = ({ size = 24, color = 'currentColor', strokeWidth = 1.8, style }: IconProps) => (
  <svg {...base(size, color, strokeWidth, style)}><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></svg>
);
export const ChevronLeft = ({ size = 24, color = 'currentColor', strokeWidth = 2, style }: IconProps) => (
  <svg {...base(size, color, strokeWidth, style)}><path d="m15 18-6-6 6-6" /></svg>
);
export const ChevronRight = ({ size = 24, color = 'currentColor', strokeWidth = 2, style }: IconProps) => (
  <svg {...base(size, color, strokeWidth, style)}><path d="m9 18 6-6-6-6" /></svg>
);
export const PlusIcon = ({ size = 24, color = 'currentColor', strokeWidth = 2.2, style }: IconProps) => (
  <svg {...base(size, color, strokeWidth, style)}><path d="M12 5v14M5 12h14" /></svg>
);
export const CheckIcon = ({ size = 24, color = 'currentColor', strokeWidth = 2.4, style }: IconProps) => (
  <svg {...base(size, color, strokeWidth, style)}><path d="M5 12.5 10 17 19 7" /></svg>
);
export const SearchIcon = ({ size = 24, color = 'currentColor', strokeWidth = 2, style }: IconProps) => (
  <svg {...base(size, color, strokeWidth, style)}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
);
export const ClockIcon = ({ size = 24, color = 'currentColor', strokeWidth = 1.8, style }: IconProps) => (
  <svg {...base(size, color, strokeWidth, style)}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);
export const PinIcon = ({ size = 24, color = 'currentColor', strokeWidth = 1.8, style }: IconProps) => (
  <svg {...base(size, color, strokeWidth, style)}><path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z" /><circle cx="12" cy="9" r="2.5" /></svg>
);
export const PhoneIcon = ({ size = 24, color = 'currentColor', strokeWidth = 1.8, style }: IconProps) => (
  <svg {...base(size, color, strokeWidth, style)}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg>
);
export const ChatIcon = ({ size = 24, color = 'currentColor', strokeWidth = 1.8, style }: IconProps) => (
  <svg {...base(size, color, strokeWidth, style)}><path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z" /></svg>
);
export const BellIcon = ({ size = 24, color = 'currentColor', strokeWidth = 1.8, style }: IconProps) => (
  <svg {...base(size, color, strokeWidth, style)}><path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15z" /><path d="M10 21h4" /></svg>
);
export const StarIcon = ({ size = 14, color = 'currentColor', style }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ display: 'block', ...style }} aria-hidden>
    <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />
  </svg>
);
export const CloseIcon = ({ size = 24, color = 'currentColor', strokeWidth = 2, style }: IconProps) => (
  <svg {...base(size, color, strokeWidth, style)}><path d="M6 6l12 12M18 6 6 18" /></svg>
);
