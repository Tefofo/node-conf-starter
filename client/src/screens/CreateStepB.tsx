import { useState } from 'react';
import { Btn, Card, InfoBanner } from '../components/ui';

const LEVELS = ['JUNIOR', 'MID', 'SENIOR', 'LEAD', 'PRINCIPAL'] as const;

interface Slot { skill: string; level: string; quantity: number; }
interface Props { onBack: () => void; onSubmit: (slots: Slot[]) => void; loading: boolean; }

const Stepper = () => (
  <div style={{ width: 180, display: 'flex', flexDirection: 'column' }}>
    {[['Basic Details', 'done'], ['Skill Requirements', 'active'], ['Review & Confirm', 'pending']].map(([label, state], i) => (
      <div key={i} style={{ display: 'flex', gap: 12, paddingBottom: i < 2 ? 24 : 0, position: 'relative' }}>
        {i < 2 && <div style={{ position: 'absolute', left: 14, top: 30, bottom: 0, width: 1, background: 'var(--border)' }} />}
        <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0, zIndex: 1, background: state !== 'pending' ? 'var(--blue)' : 'var(--white)', color: state !== 'pending' ? '#fff' : 'var(--text3)', border: state === 'pending' ? '1.5px solid var(--border)' : 'none', boxShadow: state === 'active' ? '0 0 0 4px rgba(37,99,235,.15)' : 'none' }}>
          {state === 'done' ? '✓' : i + 1}
        </div>
        <div style={{ paddingTop: 5 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: state === 'pending' ? 'var(--text3)' : 'var(--text)' }}>{label}</div>
        </div>
      </div>
    ))}
  </div>
);

export function CreateStepB({ onBack, onSubmit, loading }: Props) {
  const [slots, setSlots] = useState<Slot[]>([
    { skill: 'Solution Architecture', level: 'SENIOR', quantity: 1 },
    { skill: 'Java Development', level: 'MID', quantity: 2 },
    { skill: 'QA Testing', level: 'MID', quantity: 1 },
  ]);

  const update = (i: number, field: keyof Slot, val: string | number) => {
    const next = [...slots];
    (next[i] as any)[field] = val;
    setSlots(next);
  };

  const inputStyle: React.CSSProperties = { height: 36, padding: '0 10px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 13, fontFamily: 'var(--font)', color: 'var(--text)', background: 'var(--white)' };

  return (
    <>
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Create New Delivery Need</div>
      <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 24 }}>
        <Stepper />
        <Card>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>Required Skill Slots</div>
          <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 16 }}>Add the skills and level of expertise required for this delivery need.</div>
          <InfoBanner>Skill names must match your seed data exactly — e.g. "Solution Architecture", "Java Development", "QA Testing". Typos return zero candidates.</InfoBanner>

          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px 90px 40px', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.5px' }}>
            <span>Skill Name</span><span>Level</span><span>Quantity</span><span />
          </div>

          {slots.map((slot, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 160px 90px 40px', gap: 10, alignItems: 'center', padding: '10px 0', borderBottom: i < slots.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
              <input value={slot.skill} onChange={e => update(i, 'skill', e.target.value)} style={{ ...inputStyle, width: '100%' }} placeholder="e.g. Solution Architecture" />
              <select value={slot.level} onChange={e => update(i, 'level', e.target.value)} style={inputStyle}>
                {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <input type="number" min={1} value={slot.quantity} onChange={e => update(i, 'quantity', Number(e.target.value))} style={{ ...inputStyle, width: '100%' }} />
              <button onClick={() => setSlots(slots.filter((_, idx) => idx !== i))} style={{ width: 32, height: 32, border: '1px solid var(--border)', borderRadius: 6, background: 'var(--white)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="var(--text3)" strokeWidth="2" strokeLinecap="round"><path d="M2 4h10M5 4V2h4v2M11 4l-1 8H4L3 4"/></svg>
              </button>
            </div>
          ))}

          <div style={{ marginTop: 12 }}>
            <Btn variant="ghost" sm onClick={() => setSlots([...slots, { skill: '', level: 'MID', quantity: 1 }])}>+ Add Skill Slot</Btn>
          </div>

          <div style={{ height: 1, background: 'var(--border)', margin: '16px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Btn variant="ghost" onClick={onBack}>← Back</Btn>
            <Btn onClick={() => onSubmit(slots)} disabled={slots.length === 0 || slots.some(s => !s.skill) || loading}>
              {loading ? 'Creating...' : 'Continue →'}
            </Btn>
          </div>
        </Card>
      </div>
    </>
  );
}
