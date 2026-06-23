import { useState } from 'react';
import { Badge, Btn, Card, WarnBanner, ErrorBanner } from '../components/ui';

type Screen = 'dashboard' | 'detail' | 'loading' | 'recs' | 'confirm' | 'success';

// ── Loading / Generating ──
export function LoadingScreen({ deliveryNeedId, onViewRecs, onRetry, onBack }: {
  deliveryNeedId: string; onViewRecs: () => void; onRetry: () => void; onBack: () => void;
}) {
  const [state, setState] = useState<'processing' | 'failed'>('processing');
  return (
    <>
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {(['processing', 'failed'] as const).map(s => (
          <button key={s} onClick={() => setState(s)} style={{ padding: '5px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: '1px solid var(--border)', background: state === s ? 'var(--blue)' : 'var(--white)', color: state === s ? '#fff' : 'var(--text2)' }}>{s.toUpperCase()} state</button>
        ))}
      </div>
      {state === 'processing' ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', textAlign: 'center', minHeight: 400 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', border: '3px solid var(--slate-m)', borderTopColor: 'var(--blue)', animation: 'spin .8s linear infinite', marginBottom: 24 }} />
          <div style={{ width: 320, height: 5, background: 'var(--slate-m)', borderRadius: 3, overflow: 'hidden', margin: '0 auto 12px' }}>
            <div style={{ height: '100%', width: '65%', background: 'var(--blue)', borderRadius: 3 }} />
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>Processing...</div>
          <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 4 }}>We're analysing the best candidates for your requirements.</div>
          <div style={{ fontSize: 12, color: 'var(--text3)' }}>This may take 5–15 seconds</div>
          <div style={{ display: 'flex', gap: 10, background: 'var(--blue-l)', border: '1px solid var(--blue-m)', borderRadius: 8, padding: '12px 16px', maxWidth: 420, margin: '20px auto 0', textAlign: 'left' }}>
            <span style={{ fontSize: 12, color: 'var(--blue-h)' }}>You can leave this page. We'll notify you when recommendations are ready.</span>
          </div>
          <div style={{ marginTop: 24 }}>
            <Btn onClick={onViewRecs}>Results are ready — View Recommendations →</Btn>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 20px', textAlign: 'center', minHeight: 400 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--red-l)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round"><circle cx="14" cy="14" r="11"/><path d="M14 8v6M14 18v.5"/></svg>
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Recommendation scoring failed</div>
          <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 16 }}>The scoring engine encountered an error and could not generate results.</div>
          <div style={{ background: 'var(--red-l)', border: '1px solid var(--red-m)', borderRadius: 8, padding: '12px 16px', maxWidth: 420, textAlign: 'left' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--red)', marginBottom: 4 }}>What happened</div>
            <div style={{ fontSize: 12, color: '#7F1D1D' }}>Status: FAILED — the engine did not complete. Your delivery need ({deliveryNeedId}) has not been modified. Retrying starts a fresh scoring run.</div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            <Btn variant="ghost" onClick={onBack}>← Back to Need</Btn>
            <Btn onClick={onRetry}>↺ Retry Scoring</Btn>
          </div>
        </div>
      )}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </>
  );
}

// ── Need Detail ──
interface SkillSlotProp { skill: string; level: string; quantity: number; }
export function NeedDetail({ deliveryNeedId, title, urgency, startDate, durationWeeks, createdBy, createdAt, requiredSkills, status, onGenerate, onNav: _onNav }: {
  deliveryNeedId: string; title: string; urgency: string; startDate: string; durationWeeks: number;
  createdBy: string; createdAt: string; requiredSkills: SkillSlotProp[]; status: string;
  onGenerate: () => void; onNav: (s: Screen) => void;
}) {
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{title}</div>
            <Badge value={urgency} />
          </div>
          <div style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'monospace' }}>{deliveryNeedId}</div>
        </div>
        <Btn onClick={onGenerate}>Generate Recommendations</Btn>
      </div>
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)', marginBottom: 20 }}>
        {['Overview', 'Skill Requirements', 'Activity (Prototype)', 'History (Prototype)'].map((tab, i) => (
          <div key={tab} style={{ padding: '10px 16px', fontSize: 13, fontWeight: 500, color: i === 0 ? 'var(--blue)' : 'var(--text2)', borderBottom: i === 0 ? '2px solid var(--blue)' : '2px solid transparent', cursor: i < 2 ? 'pointer' : 'not-allowed', opacity: i >= 2 ? .35 : 1 }}>{tab}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}>
        {[['📅 Desired Start', startDate], ['⏱ Duration', `${durationWeeks} Weeks`], ['📋 Created On', new Date(createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })], ['👤 Created By', createdBy]].map(([icon, val]) => (
          <div key={String(icon)} style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 8, padding: '14px 16px' }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: 4 }}>{icon}</div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>{val}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: 16 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Required Skills</div>
          <div style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: 'var(--slate-l)' }}>{['Skill Name', 'Level', 'Quantity'].map(h => <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase' }}>{h}</th>)}</tr></thead>
              <tbody>
                {requiredSkills.map(s => (
                  <tr key={s.skill} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '12px 14px', fontSize: 13 }}>{s.skill}</td>
                    <td style={{ padding: '12px 14px' }}><Badge value={s.level} /></td>
                    <td style={{ padding: '12px 14px', fontSize: 13 }}>{s.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Status</div>
          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 8, padding: 16 }}>
            {[['Delivery Need', <Badge value={status} />, ''], ['Recommendations', 'Not generated yet', 'Click Generate to begin'], ['Squad', 'Not assembled yet', '']].map(([label, val, sub]) => (
              <div key={String(label)} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid #F1F5F9', fontSize: 12 }}>
                <div style={{ color: 'var(--text3)', marginBottom: 3, fontWeight: 500 }}>{String(label)}</div>
                <div style={{ fontWeight: 600 }}>{val}</div>
                {sub && <div style={{ color: 'var(--text3)', fontSize: 11 }}>{String(sub)}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ── Confirm Squad ──
interface Assignment { candidateId: string; name: string; role: string; skill: string; agreedStartDate: string; allocationPercent: number; }
interface ConfirmProps { deliveryNeedId: string; assignments: Assignment[]; onBack: () => void; onConfirm: (confirmedBy: string, notes: string, assignments: Assignment[]) => void; loading: boolean; error?: string; }

export function ConfirmSquad({ deliveryNeedId, assignments, onBack, onConfirm, loading, error }: ConfirmProps) {
  const [rows, setRows] = useState(assignments);
  const [confirmedBy, setConfirmedBy] = useState('Alex Johnson');
  const [notes, setNotes] = useState('');
  const [state, setState] = useState<'default' | '409' | '404'>('default');

  const update = (i: number, field: keyof Assignment, val: string | number) => {
    const next = [...rows]; (next[i] as any)[field] = val; setRows(next);
  };

  return (
    <>
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {(['default', '409', '404'] as const).map(s => (
          <button key={s} onClick={() => setState(s)} style={{ padding: '5px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: '1px solid var(--border)', background: state === s ? 'var(--blue)' : 'var(--white)', color: state === s ? '#fff' : 'var(--text2)' }}>{s === 'default' ? 'Happy path' : `${s} error`}</button>
        ))}
      </div>

      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Confirm Squad</div>
      <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 16 }}>Review the selected members and confirm the squad for {deliveryNeedId}.</div>

      {state === '409' && <ErrorBanner><strong>Conflict (409) — Sarah Williams is no longer available.</strong> She has been allocated to another squad since recommendations were generated. Return to recommendations and select an alternative.</ErrorBanner>}
      {state === '404' && <ErrorBanner><strong>Not Found (404) — Candidate E999 could not be found.</strong> This candidateId does not exist. No assignments were created.</ErrorBanner>}
      {error && <ErrorBanner>{error}</ErrorBanner>}

      <Card style={{ marginBottom: 16 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ background: 'var(--slate-l)', borderBottom: '1px solid var(--border)' }}>
            {['Member', 'Skill Slot', 'Start Date', 'Allocation (%)'].map(h => <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase' }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.candidateId} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '10px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--blue-l)', color: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
                      {r.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div><div style={{ fontWeight: 600, fontSize: 13 }}>{r.name}</div><div style={{ fontSize: 11, color: 'var(--text3)' }}>{r.role}</div></div>
                  </div>
                </td>
                <td style={{ padding: '10px 12px', fontSize: 13 }}>{r.skill}</td>
                <td style={{ padding: '10px 12px' }}><input type="date" value={r.agreedStartDate} onChange={e => update(i, 'agreedStartDate', e.target.value)} style={{ height: 32, padding: '0 8px', border: '1px solid var(--border)', borderRadius: 4, fontSize: 13, fontFamily: 'var(--font)', width: 140 }} /></td>
                <td style={{ padding: '10px 12px' }}><input type="number" min={1} max={100} value={r.allocationPercent} onChange={e => update(i, 'allocationPercent', Number(e.target.value))} style={{ width: 70, height: 32, padding: '0 8px', border: '1px solid var(--border)', borderRadius: 4, fontSize: 13, textAlign: 'center', fontFamily: 'var(--font)' }} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text2)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.4px' }}>Notes (Optional)</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} style={{ width: '100%', height: 80, padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 14, fontFamily: 'var(--font)', resize: 'vertical' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text2)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.4px' }}>Confirmed By <span style={{ color: 'var(--red)' }}>★</span></label>
          <input value={confirmedBy} onChange={e => setConfirmedBy(e.target.value)} style={{ width: 320, height: 38, padding: '0 12px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 14, fontFamily: 'var(--font)' }} />
        </div>
      </Card>

      <WarnBanner>Confirming this squad will update each candidate's currentAllocationPercentage. All assignments are written atomically — if any fail, none are saved.</WarnBanner>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Btn variant="ghost" onClick={onBack}>← Back</Btn>
        <Btn onClick={() => onConfirm(confirmedBy, notes, rows)} disabled={!confirmedBy || loading}>{loading ? 'Confirming...' : 'Confirm Squad →'}</Btn>
      </div>
    </>
  );
}

// ── Success ──
export function SuccessScreen({ squadId, deliveryNeedId, status: _status, memberCount, confirmedBy, onDashboard }: {
  squadId: string; deliveryNeedId: string; status: string; memberCount: number; confirmedBy: string; onDashboard: () => void;
}) {
  const [view, setView] = useState<'ASSEMBLED' | 'PARTIALLY_ASSEMBLED'>('ASSEMBLED');
  const isPartial = view === 'PARTIALLY_ASSEMBLED';

  return (
    <>
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {(['ASSEMBLED', 'PARTIALLY_ASSEMBLED'] as const).map(s => (
          <button key={s} onClick={() => setView(s)} style={{ padding: '5px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: '1px solid var(--border)', background: view === s ? 'var(--blue)' : 'var(--white)', color: view === s ? '#fff' : 'var(--text2)' }}>{s}</button>
        ))}
      </div>
      <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center', padding: '40px 0' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: isPartial ? 'var(--amber-l)' : 'var(--green-l)', border: `2px solid ${isPartial ? 'var(--amber-m)' : 'var(--green-m)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke={isPartial ? 'var(--amber)' : 'var(--green)'} strokeWidth="2.5" strokeLinecap="round"><path d="M5 15l7 7L25 8"/></svg>
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>{isPartial ? 'Squad Partially Assembled' : 'Squad Successfully Assembled!'}</div>
        <div style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 24 }}>
          {isPartial ? 'Some skill slots were confirmed. The squad can be completed from the recommendations screen.' : "Your squad has been confirmed and is ready to go. Each member's allocation has been updated."}
        </div>
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', textAlign: 'left', marginBottom: 20 }}>
          {[['Squad ID', <span style={{ fontFamily: 'monospace', fontSize: 15, fontWeight: 700 }}>{squadId}</span>], ['Delivery Need', `${deliveryNeedId}`], ['Members', isPartial ? memberCount - 1 : memberCount], ['Status', <Badge value={view} />], ['Confirmed By', confirmedBy]].map(([label, val]) => (
            <div key={String(label)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: '1px solid #F1F5F9', fontSize: 13 }}>
              <span style={{ color: 'var(--text2)' }}>{String(label)}</span>
              <span style={{ fontWeight: 600 }}>{val as React.ReactNode}</span>
            </div>
          ))}
        </div>
        {isPartial && (
          <div style={{ display: 'flex', gap: 10, background: 'var(--blue-l)', border: '1px solid var(--blue-m)', borderRadius: 8, padding: '12px 16px', marginBottom: 20, textAlign: 'left' }}>
            <span style={{ fontSize: 13, color: 'var(--blue-h)' }}>1 skill slot was not filled (QA Testing). Return to recommendations to complete the squad.</span>
          </div>
        )}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Btn variant="ghost" style={{ opacity: .5, cursor: 'not-allowed' }}>View Squad</Btn>
          <Btn onClick={onDashboard}>Return to Dashboard</Btn>
        </div>
      </div>
    </>
  );
}
