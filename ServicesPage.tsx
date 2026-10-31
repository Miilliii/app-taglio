import { useMemo, useState } from 'react';
import { COLORS, NAV_HEIGHT, RADIUS, SAFE, SHADOW } from '../config/theme';
import { CATEGORIES, SERVICES, type Category } from '../data/services';
import { eligibleStaff, formatDuration, formatPrice, servicesFromIds, totalDuration } from '../lib/booking';
import { CheckIcon, ChevronRight, CloseIcon, PlusIcon, SearchIcon } from './Icons';
import { Chip, LargeTitle, Photo } from './ui';

interface Props {
  selected: string[];
  onToggle: (id: string) => boolean; // false se non combinabile
  onContinue: () => void;
}

export default function ServicesPage({ selected, onToggle, onContinue }: Props) {
  const firstCat = (servicesFromIds(selected)[0]?.category ?? 'Uomo') as Category;
  const [category, setCategory] = useState<Category>(firstCat);
  const [query, setQuery] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q) return SERVICES.filter((s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
    return SERVICES.filter((s) => s.category === category);
  }, [category, query]);

  const chosen = servicesFromIds(selected);
  const total = chosen.reduce((s, x) => s + x.price, 0);

  const toggle = (id: string) => {
    if (!onToggle(id)) {
      setToast('Questi servizi richiedono professionisti diversi: prenotali con due appuntamenti separati.');
      setTimeout(() => setToast(null), 3500);
    }
  };

  return (
    <div style={{ animation: 'fadeUp 0.3s ease', paddingTop: `calc(${SAFE.top} + 16px)` }}>
      <LargeTitle>Servizi</LargeTitle>

      {/* Ricerca */}
      <div style={{ margin: '0 20px', position: 'relative' }}>
        <SearchIcon size={18} color={COLORS.taupeDark} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cerca un servizio"
          aria-label="Cerca un servizio"
          enterKeyHint="search"
          style={{ width: '100%', height: '44px', borderRadius: RADIUS.md, border: 'none', background: COLORS.sand, padding: '0 40px 0 40px', color: COLORS.textPrimary, outline: 'none', fontSize: '16px' }}
        />
        {query && (
          <button onClick={() => setQuery('')} aria-label="Cancella ricerca" style={{ position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)', width: '32px', height: '32px', border: 'none', background: 'transparent', color: COLORS.taupeDark, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <CloseIcon size={16} />
          </button>
        )}
      </div>

      {/* Categorie */}
      {!query && (
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '14px 20px 6px' }}>
          {CATEGORIES.map((c) => (
            <Chip key={c} label={c} active={c === category} onClick={() => setCategory(c)} />
          ))}
        </div>
      )}

      {/* Lista */}
      <div style={{ padding: '10px 20px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {list.length === 0 && (
          <div style={{ textAlign: 'center', color: COLORS.textSecondary, padding: '40px 0', fontSize: '15px' }}>
            Nessun servizio trovato per “{query}”.
          </div>
        )}
        {list.map((s) => {
          const isSel = selected.includes(s.id);
          return (
            <button
              key={s.id}
              onClick={() => toggle(s.id)}
              aria-pressed={isSel}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                textAlign: 'left',
                padding: '10px',
                borderRadius: RADIUS.lg,
                border: `1px solid ${isSel ? COLORS.taupe : 'transparent'}`,
                background: isSel ? COLORS.sandLight : COLORS.cardBg,
                boxShadow: SHADOW.card,
                cursor: 'pointer',
                color: COLORS.textPrimary,
                transition: 'all 0.2s ease',
              }}
            >
              <Photo src={s.image} alt={s.name} style={{ width: '72px', height: '72px', borderRadius: RADIUS.md, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '17px', fontWeight: 600 }}>{s.name}</div>
                <div style={{ fontSize: '14px', color: COLORS.textSecondary, marginTop: '2px' }}>{formatDuration(s.duration)}</div>
                <div style={{ fontSize: '13px', color: COLORS.textMuted, marginTop: '3px', lineHeight: 1.3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {s.description}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 }}>
                <span style={{ fontSize: '17px', fontWeight: 600 }}>{formatPrice(s.price)}</span>
                <span
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: isSel ? COLORS.taupe : COLORS.black,
                    color: COLORS.white,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 0.2s ease',
                  }}
                >
                  {isSel ? <CheckIcon size={16} /> : <PlusIcon size={16} />}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ height: chosen.length ? '96px' : '24px' }} />

      {/* Toast */}
      {toast && (
        <div
          role="status"
          style={{ position: 'fixed', left: '50%', transform: 'translateX(-50%)', bottom: `calc(${SAFE.bottom} + ${NAV_HEIGHT + 84}px)`, width: 'calc(100% - 40px)', maxWidth: '440px', background: COLORS.black, color: COLORS.white, borderRadius: RADIUS.md, padding: '12px 14px', fontSize: '14px', lineHeight: 1.35, zIndex: 120, animation: 'fadeUp 0.25s ease' }}
        >
          {toast}
        </div>
      )}

      {/* Barra riepilogo */}
      {chosen.length > 0 && (
        <button
          onClick={onContinue}
          disabled={eligibleStaff(chosen).length === 0}
          style={{
            position: 'fixed',
            left: '50%',
            transform: 'translateX(-50%)',
            bottom: `calc(${SAFE.bottom} + ${NAV_HEIGHT + 12}px)`,
            width: 'calc(100% - 32px)',
            maxWidth: '448px',
            height: '58px',
            borderRadius: RADIUS.lg,
            border: 'none',
            background: COLORS.sand,
            boxShadow: SHADOW.float,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 18px',
            fontSize: '16px',
            fontWeight: 600,
            color: COLORS.textPrimary,
            cursor: 'pointer',
            zIndex: 110,
            animation: 'fadeUp 0.25s ease',
          }}
        >
          <span>
            {chosen.length} {chosen.length === 1 ? 'servizio' : 'servizi'} · {formatDuration(totalDuration(chosen))} · {formatPrice(total)}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            Continua <ChevronRight size={18} />
          </span>
        </button>
      )}
    </div>
  );
}
