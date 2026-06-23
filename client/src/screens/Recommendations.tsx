import { useState } from 'react';
import { Badge, Btn, Avatar } from '../components/ui';

type Screen = 'detail' | 'loading' | 'confirm';

interface ScoreBreakdown { skillMatch: number; availability: number; workload: number; roleAlignment: number; }
interface Candidate { employeeId: string; name: string; role: string; compositeScore: number; scoreBreakdown: ScoreBreakdown; availableFrom: string | null; currentAllocationPercentage: number; }
interface SlotResult { skill: string; level: string; quantityRequired: number; candidates: Candidate[]; }

interface Props { skillSlots: SlotResult[]; generatedAt: string; onNav: (_s: Screen) => void; onConfirm: (sel: { employeeId: string; skill: string }[]) => void; }

function ScoreBar({ label, value }: { label: string; value: number }) {
  const color = value >= 80 ? 'var(--green)' : value >= 50 ? 'var(--blue)' : 'var(--amber)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ fontSize: 10, color: 'var(--text3)', width: 72, flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: 4, background: 'var(--slate-m)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${value}%`, background: color, borderRadius: 2 }} />
      </div>
      <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text2)', minWidth: 20, textAlign: 'right' }}>{value}</span>
    </div>
  );
}

export function Recommendations({ skillSlots, generatedAt, onConfirm }: Props) {
  const [selections, setSelections] = useState<{ employeeId: string; skill: string }[]>([]);
  const selectedIds = selections.map(s => s.employeeId);
  const totalNeeded = skillSlots.reduce((sum, s) => sum + s.quantityRequired, 0);
  const coverage = Math.round((selections.length / Math.max(totalNeeded, 1)) * 100);

  const toggle = (c: Candidate, skill: string) => {
    setSelections(prev => prev.find(s => s.employeeId === c.employeeId)
      ? prev.filter(s => s.employeeId !== c.employeeId)
      : [...prev, { employeeId: c.employeeId, skill }]);
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>Recommendations</div>
        <Badge value="COMPLETED" />
        <span style={{ fontSize: 12, color: 'var(--text3)' }}>Generated {generatedAt}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 20 }}>
        <div>
          {skillSlots.map(slot => (
            <div key={`${slot.skill}-${slot.level}`} style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', marginBottom: 14 }}>
              <div style={{ background: 'var(--navy)', color: '#fff', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>Skill Slot: {slot.skill} ({slot.level})</div>
                  <div style={{ fontSize: 11, opacity: .7 }}>Required: {slot.quantityRequired} {slot.quantityRequired === 1 ? 'person' : 'people'}</div>
                </div>
                <span style={{ background: 'rgba(255,255,255,.15)', color: '#fff', padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 700 }}>{slot.candidates.length} candidates</span>
              </div>
              {slot.candidates.length === 0
                ? <div style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text3)', fontStyle: 'italic' }}>No eligible candidates for this slot.</div>
                : slot.candidates.map((c, idx) => {
                  const selected = selectedIds.includes(c.employeeId);
                  return (
                    <div key={c.employeeId} onClick={() => toggle(c, slot.skill)}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: '1px solid #F8FAFC', cursor: 'pointer', background: selected ? '#EFF6FF' : 'var(--white)', borderLeft: selected ? '3px solid var(--blue)' : '3px solid transparent', transition: 'all .1s' }}>
                      <div style={{ width: 24, height: 24, borderRadius: '50%', background: idx === 0 ? 'var(--navy)' : 'var(--slate)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{idx + 1}</div>
                      <Avatar name={c.name} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{c.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text3)' }}>{c.role}</div>
                        <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 3 }}>
                          {c.availableFrom ? `Available from ${c.availableFrom}` : 'Available now'} · Allocation {c.currentAllocationPercentage}%
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px 16px', marginTop: 6 }}>
                          <ScoreBar label="Skill Match" value={c.scoreBreakdown.skillMatch} />
                          <ScoreBar label="Availability" value={c.scoreBreakdown.availability} />
                          <ScoreBar label="Workload" value={c.scoreBreakdown.workload} />
                          <ScoreBar label="Role Alignment" value={c.scoreBreakdown.roleAlignment} />
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--navy)', lineHeight: 1 }}>{c.compositeScore}</div>
                        <div style={{ fontSize: 10, color: 'var(--text3)' }}>/100</div>
                      </div>
                      <Btn sm variant={selected ? 'primary' : 'ghost'} onClick={() => toggle(c, slot.skill)}>
                        {selected ? '✓ Selected' : 'Select'}
                      </Btn>
                    </div>
                  );
                })}
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 8, padding: 16, position: 'sticky', top: 0, alignSelf: 'start' }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Selected Squad
            <span style={{ fontSize: 11, background: '#F5F3FF', border: '1px solid #DDD6FE', color: '#5B21B6', padding: '2px 8px', borderRadius: 4, marginLeft: 8 }}>Client state</span>
          </div>
          {skillSlots.map(slot => (
            <div key={slot.skill} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: 6 }}>{slot.skill} ({slot.level})</div>
              {selections.filter(s => s.skill === slot.skill).length === 0
                ? <div style={{ fontSize: 12, color: 'var(--text3)', fontStyle: 'italic' }}>No selection yet</div>
                : selections.filter(s => s.skill === slot.skill).map(s => {
                  const cand = skillSlots.flatMap(sl => sl.candidates).find(c => c.employeeId === s.employeeId);
                  return cand ? (
                    <div key={s.employeeId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', background: 'var(--slate-l)', borderRadius: 6, marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 500 }}>{cand.name}</span>
                      <span onClick={() => toggle(cand, slot.skill)} style={{ color: 'var(--text3)', fontSize: 14, cursor: 'pointer' }}>×</span>
                    </div>
                  ) : null;
                })}
            </div>
          ))}
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 600, color: 'var(--text2)', marginBottom: 6 }}>
              <span>Coverage</span><span>{coverage}%</span>
            </div>
            <div style={{ height: 6, background: 'var(--slate-m)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${coverage}%`, background: 'var(--green)', borderRadius: 3, transition: 'width .3s' }} />
            </div>
          </div>
          <Btn style={{ width: '100%', marginTop: 12, justifyContent: 'center' }} disabled={selections.length === 0} onClick={() => onConfirm(selections)}>
            Review & Confirm Squad →
          </Btn>
        </div>
      </div>
    </>
  );
}
