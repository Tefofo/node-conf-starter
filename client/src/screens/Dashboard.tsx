import { useEffect, useState } from 'react';
import { Badge, Btn } from '../components/ui';

type Screen = 'dashboard' | 'create-a' | 'create-b' | 'detail' | 'loading' | 'recs' | 'confirm' | 'success';

interface NeedRow { deliveryNeedId: string; title: string; urgency: string; status: string; createdAt: string; }

const STATUS_META: Record<string, { sub: string; bg: string; stroke: string }> = {
  CREATED:       { sub: 'Delivery Needs',      bg: '#F1F5F9', stroke: '#64748B' },
  PENDING_MATCH: { sub: 'Scoring in progress', bg: '#EFF6FF', stroke: '#2563EB' },
  MATCHED:       { sub: 'Ready to assemble',   bg: '#F0FDF4', stroke: '#16A34A' },
  ASSEMBLING:    { sub: 'In progress',          bg: '#FFF7ED', stroke: '#EA580C' },
  ASSEMBLED:     { sub: 'Completed',            bg: '#F0FDF4', stroke: '#16A34A' },
  CANCELLED:     { sub: 'No action needed',     bg: '#FEF2F2', stroke: '#DC2626' },
};

export function Dashboard({ onNav }: { onNav: (s: Screen) => void }) {
  const [needs, setNeeds] = useState<NeedRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/delivery-needs')
      .then(r => r.json())
      .then(d => setNeeds(d.items ?? []))
      .catch(() => setNeeds([]))
      .finally(() => setLoading(false));
  }, []);

  const counts = Object.fromEntries(
    Object.keys(STATUS_META).map(s => [s, needs.filter(n => n.status === s).length])
  );

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>Dashboard</div>
        <Btn onClick={() => onNav('create-a')}>+ New Delivery Need</Btn>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 12, marginBottom: 24 }}>
        {Object.entries(STATUS_META).map(([status, meta]) => (
          <div key={status} style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 8, padding: '14px 16px' }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke={meta.stroke} strokeWidth="1.8" strokeLinecap="round">
                <path d="M3 4h12M3 9h12M3 14h8"/>
              </svg>
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, lineHeight: 1 }}>{counts[status] ?? 0}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text2)', marginTop: 3 }}>{status}</div>
            <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 1 }}>{meta.sub}</div>
          </div>
        ))}
      </div>

      {/* Recent needs table */}
      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>Recent Delivery Needs</div>
      <div style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', background: 'var(--white)' }}>
        {loading ? (
          <div style={{ padding: 24, textAlign: 'center', fontSize: 13, color: 'var(--text3)' }}>Loading...</div>
        ) : needs.length === 0 ? (
          <div style={{ padding: 24, textAlign: 'center', fontSize: 13, color: 'var(--text3)' }}>
            No delivery needs yet. <span style={{ color: 'var(--blue)', cursor: 'pointer' }} onClick={() => onNav('create-a')}>Create your first one →</span>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--slate-l)', borderBottom: '1px solid var(--border)' }}>
                {['ID', 'Title', 'Urgency', 'Status', 'Created', 'Action'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {needs.slice(0, 10).map(r => (
                <tr key={r.deliveryNeedId} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: 'var(--text2)', fontSize: 13 }}>{r.deliveryNeedId}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 600, fontSize: 13, color: 'var(--blue)', cursor: 'pointer' }} onClick={() => onNav('detail')}>{r.title}</td>
                  <td style={{ padding: '12px 14px' }}><Badge value={r.urgency} /></td>
                  <td style={{ padding: '12px 14px' }}><Badge value={r.status} /></td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: 'var(--text2)' }}>{new Date(r.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                  <td style={{ padding: '12px 14px' }}>
                    {r.status === 'MATCHED' || r.status === 'ASSEMBLING'
                      ? <Btn sm onClick={() => onNav('recs')}>Continue</Btn>
                      : <Btn sm variant="ghost" onClick={() => onNav('detail')}>View</Btn>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
