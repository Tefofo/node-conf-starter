// ── Badge ──
const BADGE_STYLES: Record<string, React.CSSProperties> = {
  CREATED:            { background: '#F1F5F9', color: '#334155' },
  PENDING_MATCH:      { background: '#EFF6FF', color: '#1D4ED8' },
  MATCHED:            { background: '#F0FDF4', color: '#15803D' },
  ASSEMBLING:         { background: '#FFF7ED', color: '#C2410C' },
  ASSEMBLED:          { background: '#F0FDF4', color: '#15803D', border: '1px solid #BBF7D0' },
  CANCELLED:          { background: '#FEF2F2', color: '#991B1B' },
  PARTIALLY_ASSEMBLED:{ background: '#FFF7ED', color: '#C2410C' },
  HIGH:               { background: '#FEF2F2', color: '#991B1B' },
  CRITICAL:           { background: '#4B0082', color: '#fff' },
  MEDIUM:             { background: '#FFFBEB', color: '#92400E' },
  LOW:                { background: '#F0FDF4', color: '#166534' },
  COMPLETED:          { background: '#F0FDF4', color: '#15803D' },
  PROCESSING:         { background: '#EFF6FF', color: '#1D4ED8' },
  FAILED:             { background: '#FEF2F2', color: '#DC2626' },
  SENIOR:             { background: '#F5F3FF', color: '#5B21B6' },
  MID:                { background: '#EFF6FF', color: '#1D4ED8' },
  JUNIOR:             { background: '#F0FDF4', color: '#166534' },
  LEAD:               { background: '#FFF7ED', color: '#C2410C' },
  PRINCIPAL:          { background: '#0F1B2D', color: '#fff' },
};

export function Badge({ value }: { value: string }) {
  const style = BADGE_STYLES[value] ?? { background: '#F1F5F9', color: '#334155' };
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 700, letterSpacing: '.3px', textTransform: 'uppercase' as const, ...style }}>
      {value}
    </span>
  );
}

// ── Button ──
type BtnVariant = 'primary' | 'ghost' | 'outline';

export function Btn({ variant = 'primary', sm, onClick, disabled, children, style }: {
  variant?: BtnVariant; sm?: boolean; onClick?: () => void; disabled?: boolean; children: React.ReactNode; style?: React.CSSProperties;
}) {
  const base: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: sm ? '0 12px' : '0 16px', height: sm ? 30 : 36, borderRadius: 6, fontSize: sm ? 12 : 13, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer', border: 'none', fontFamily: 'var(--font)', opacity: disabled ? .5 : 1, transition: 'all .15s' };
  const variants: Record<BtnVariant, React.CSSProperties> = {
    primary: { background: 'var(--blue)', color: '#fff' },
    ghost:   { background: 'var(--white)', color: 'var(--text2)', border: '1px solid var(--border)' },
    outline: { background: 'var(--white)', color: 'var(--blue)', border: '1.5px solid var(--blue)' },
  };
  return <button onClick={disabled ? undefined : onClick} style={{ ...base, ...variants[variant], ...style }}>{children}</button>;
}

// ── Card ──
export function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 24px', ...style }}>{children}</div>;
}

// ── Info/Warn/Error banners ──
export function InfoBanner({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 10, background: 'var(--blue-l)', border: '1px solid var(--blue-m)', borderRadius: 8, padding: '12px 16px', marginBottom: 16 }}>
      <span style={{ fontSize: 13, color: 'var(--blue-h)' }}>{children}</span>
    </div>
  );
}

export function WarnBanner({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 10, background: 'var(--amber-l)', border: '1px solid var(--amber-m)', borderRadius: 8, padding: '12px 16px', marginBottom: 16 }}>
      <span style={{ fontSize: 13, color: '#92400E' }}>{children}</span>
    </div>
  );
}

export function ErrorBanner({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 10, background: 'var(--red-l)', border: '1px solid var(--red-m)', borderRadius: 8, padding: '12px 16px', marginBottom: 16 }}>
      <span style={{ fontSize: 13, color: '#7F1D1D' }}>{children}</span>
    </div>
  );
}

// ── Avatar initials ──
const AVATAR_COLORS = ['#EFF6FF/#1D4ED8','#F0FDF4/#15803D','#FFF7ED/#C2410C','#F5F3FF/#5B21B6','#FEF2F2/#991B1B'];
export function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  const [bg, color] = AVATAR_COLORS[idx].split('/');
  return <div style={{ width: size, height: size, borderRadius: '50%', background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{initials}</div>;
}
