import { useState } from 'react';
import { Btn, Card } from '../components/ui';

type Screen = 'dashboard' | 'create-a' | 'create-b' | 'detail' | 'loading' | 'recs' | 'confirm' | 'success';

interface BasicDetails { title: string; description: string; urgency: string; startDate: string; durationWeeks: number; }

interface Props { onNext: (d: BasicDetails) => void; onNav?: (s: Screen) => void; }

const Stepper = ({ step }: { step: number }) => (
  <div style={{ width: 180, display: 'flex', flexDirection: 'column' }}>
    {[['Basic Details', 'Provide need information'], ['Skill Requirements', 'Add required skills'], ['Review & Confirm', 'Review and create']].map(([label, sub], i) => {
      const state = i < step ? 'done' : i === step ? 'active' : 'pending';
      return (
        <div key={i} style={{ display: 'flex', gap: 12, paddingBottom: i < 2 ? 24 : 0, position: 'relative' }}>
          {i < 2 && <div style={{ position: 'absolute', left: 14, top: 30, bottom: 0, width: 1, background: 'var(--border)' }} />}
          <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0, zIndex: 1, background: state !== 'pending' ? 'var(--blue)' : 'var(--white)', color: state !== 'pending' ? '#fff' : 'var(--text3)', border: state === 'pending' ? '1.5px solid var(--border)' : 'none', boxShadow: state === 'active' ? '0 0 0 4px rgba(37,99,235,.15)' : 'none' }}>
            {state === 'done' ? '✓' : i + 1}
          </div>
          <div style={{ paddingTop: 5 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: state === 'pending' ? 'var(--text3)' : 'var(--text)' }}>{label}</div>
            <div style={{ fontSize: 11, color: 'var(--text3)' }}>{sub}</div>
          </div>
        </div>
      );
    })}
  </div>
);

export function CreateStepA({ onNext }: Props) {
  const [title, setTitle] = useState('Digital Onboarding Platform');
  const [description, setDescription] = useState('Build a secure and scalable onboarding platform for our enterprise customers.');
  const [urgency, setUrgency] = useState('HIGH');
  const [startDate, setStartDate] = useState('2026-07-01');
  const [durationWeeks, setDurationWeeks] = useState(8);

  const label = (text: string, required?: boolean, extra?: React.ReactNode) => (
    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text2)', marginBottom: 6, textTransform: 'uppercase' as const, letterSpacing: '.4px' }}>
      {text} {required && <span style={{ color: 'var(--red)' }}>★</span>} {extra}
    </label>
  );

  const input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} style={{ width: '100%', padding: '0 12px', height: 38, border: '1px solid var(--border)', borderRadius: 6, fontSize: 14, fontFamily: 'var(--font)', color: 'var(--text)', background: 'var(--white)' }} />
  );

  return (
    <>
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Create New Delivery Need</div>
      <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 24 }}>
        <Stepper step={0} />
        <Card>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Basic Details</div>

          <div style={{ marginBottom: 18 }}>
            {label('Title', true, <span style={{ float: 'right', fontSize: 11, fontWeight: 400, color: 'var(--text3)', textTransform: 'none' }}>{title.length} / 120</span>)}
            {input({ value: title, maxLength: 120, onChange: e => setTitle(e.target.value) })}
            <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>A short, descriptive name. Max 120 characters.</div>
          </div>

          <div style={{ marginBottom: 18 }}>
            {label('Description', false, <span style={{ color: 'var(--text3)', fontSize: 10, fontWeight: 400, textTransform: 'none' }}>(optional)</span>)}
            <textarea value={description} onChange={e => setDescription(e.target.value)} style={{ width: '100%', height: 90, padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 14, fontFamily: 'var(--font)', resize: 'vertical' }} />
            <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>Provide context about the work. Stored and returned in retrieval responses.</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <div>
              {label('Urgency', true)}
              <select value={urgency} onChange={e => setUrgency(e.target.value)} style={{ width: '100%', height: 38, padding: '0 12px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 14, fontFamily: 'var(--font)' }}>
                <option value="LOW">LOW — 4+ weeks</option>
                <option value="MEDIUM">MEDIUM — 2–4 weeks</option>
                <option value="HIGH">HIGH — 1–2 weeks</option>
                <option value="CRITICAL">CRITICAL — within days</option>
              </select>
            </div>
            <div>
              {label('Desired Start Date', true)}
              {input({ type: 'date', value: startDate, onChange: e => setStartDate(e.target.value) })}
              <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>Must not be in the past.</div>
            </div>
            <div>
              {label('Duration (Weeks)', true)}
              {input({ type: 'number', min: 1, value: durationWeeks, onChange: e => setDurationWeeks(Number(e.target.value)) })}
              <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>Minimum 1 week.</div>
            </div>
          </div>

          <div style={{ height: 1, background: 'var(--border)', margin: '16px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Btn onClick={() => onNext({ title, description, urgency, startDate, durationWeeks })}>Continue →</Btn>
          </div>
        </Card>
      </div>
    </>
  );
}
