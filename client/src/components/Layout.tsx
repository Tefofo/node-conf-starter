type Screen = 'dashboard' | 'create-a' | 'create-b' | 'detail' | 'loading' | 'recs' | 'confirm' | 'success';

interface Props {
  current: Screen;
  onNav: (s: Screen) => void;
  breadcrumbs: { label: string; screen?: Screen }[];
  topbarRight?: React.ReactNode;
  children: React.ReactNode;
}

export function Layout({ current, onNav, breadcrumbs, topbarRight, children }: Props) {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Left Nav */}
      <nav style={{ width: 220, background: 'var(--navy)', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px 20px 16px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid rgba(255,255,255,.06)' }}>
          <div style={{ width: 32, height: 32, background: 'var(--blue)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
              <circle cx="9" cy="6" r="3"/><path d="M3 15c0-3.314 2.686-6 6-6s6 2.686 6 6"/>
              <circle cx="14" cy="5" r="2"/><path d="M16 12a4 4 0 00-2-.5"/>
            </svg>
          </div>
          <div>
            <div style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>SquadRec</div>
            <div style={{ color: 'rgba(255,255,255,.4)', fontSize: 10 }}>Recommendation Platform</div>
          </div>
        </div>

        <div style={{ padding: '12px 12px 0', flex: 1 }}>
          <NavLabel>Core</NavLabel>
          <NavItem active={current === 'dashboard'} onClick={() => onNav('dashboard')} icon="grid">Dashboard</NavItem>
          <NavItem active={current === 'create-a' || current === 'create-b' || current === 'detail'} onClick={() => onNav('dashboard')} icon="list">Delivery Needs</NavItem>
          <NavItem active={current === 'recs'} onClick={() => onNav('recs')} icon="clock">Recommendations</NavItem>
          <NavLabel style={{ marginTop: 12 }}>Coming soon</NavLabel>
          <NavItem locked icon="user">Candidates <Soon /></NavItem>
          <NavItem locked icon="users">Squad Assembly <Soon /></NavItem>
          <NavItem locked icon="chart">Reports <Soon /></NavItem>
          <NavItem locked icon="settings">Admin <Soon /></NavItem>
        </div>

        <div style={{ padding: 12, borderTop: '1px solid rgba(255,255,255,.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(37,99,235,.25)', color: '#93C5FD', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>AJ</div>
            <div>
              <div style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>Alex Johnson</div>
              <div style={{ color: 'rgba(255,255,255,.4)', fontSize: 10 }}>Delivery Lead</div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg)' }}>
        {/* Topbar */}
        <div style={{ height: 52, background: 'var(--white)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text2)' }}>
            {breadcrumbs.map((b, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {i > 0 && <span style={{ color: 'var(--text3)' }}>›</span>}
                {b.screen
                  ? <a onClick={() => onNav(b.screen!)} style={{ color: 'var(--blue)', cursor: 'pointer' }}>{b.label}</a>
                  : <span>{b.label}</span>}
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {topbarRight}
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--blue-l)', color: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>AJ</div>
          </div>
        </div>
        {/* Page content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function NavLabel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', letterSpacing: '.8px', padding: '0 8px', marginBottom: 4, ...style }}>{children}</div>;
}

function NavItem({ active, locked, onClick, icon: _icon, children }: { active?: boolean; locked?: boolean; onClick?: () => void; icon?: string; children: React.ReactNode }) {
  return (
    <div onClick={locked ? undefined : onClick}
      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 6, color: active ? '#93C5FD' : locked ? 'rgba(255,255,255,.2)' : 'rgba(255,255,255,.6)', fontSize: 13, fontWeight: 500, cursor: locked ? 'not-allowed' : 'pointer', marginBottom: 2, background: active ? 'rgba(37,99,235,.25)' : 'transparent', position: 'relative' }}>
      {children}
    </div>
  );
}

function Soon() {
  return <span style={{ position: 'absolute', right: 8, fontSize: 9, background: 'rgba(255,255,255,.1)', color: 'rgba(255,255,255,.4)', padding: '2px 6px', borderRadius: 10, fontWeight: 600 }}>Soon</span>;
}
