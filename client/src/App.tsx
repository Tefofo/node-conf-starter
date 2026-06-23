import { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './screens/Dashboard';
import { CreateStepA } from './screens/CreateStepA';
import { CreateStepB } from './screens/CreateStepB';
import { Recommendations } from './screens/Recommendations';
import { LoadingScreen, NeedDetail, ConfirmSquad, SuccessScreen } from './screens/Screens';

type Screen = 'dashboard' | 'create-a' | 'create-b' | 'detail' | 'loading' | 'recs' | 'confirm' | 'success';

interface BasicDetails { title: string; description: string; urgency: string; startDate: string; durationWeeks: number; }
interface SkillSlot { skill: string; level: string; quantity: number; }
interface SlotResult { skill: string; level: string; quantityRequired: number; candidates: any[]; }
interface Selection { employeeId: string; skill: string; }
interface SquadResult { squadId: string; deliveryNeedId: string; status: string; memberCount: number; confirmedBy: string; }

export default function App() {
  const [screen, setScreen] = useState<Screen>('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [basicDetails, setBasicDetails] = useState<BasicDetails | null>(null);
  const [submittedSlots, setSubmittedSlots] = useState<SkillSlot[]>([]);
  const [deliveryNeedId, setDeliveryNeedId] = useState('');
  const [skillSlots, setSkillSlots] = useState<SlotResult[]>([]);
  const [generatedAt, setGeneratedAt] = useState('');
  const [selections, setSelections] = useState<Selection[]>([]);
  const [squadResult, setSquadResult] = useState<SquadResult | null>(null);

  const nav = (s: Screen) => { setError(''); setScreen(s); };

  const handleCreateNeed = async (slots: SkillSlot[]) => {
    if (!basicDetails) return;
    setLoading(true);
    setError('');
    setSubmittedSlots(slots);
    try {
      const res = await fetch('/api/v1/delivery-needs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...basicDetails, requiredSkills: slots }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to create delivery need');
      setDeliveryNeedId(json.deliveryNeedId);
      nav('detail');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRecs = async () => {
    nav('loading');
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/delivery-needs/${deliveryNeedId}/recommendations`, { method: 'POST' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to generate recommendations');
      setSkillSlots(json.skillSlots);
      setGeneratedAt(new Date(json.generatedAt).toLocaleString());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSquad = async (confirmedBy: string, notes: string, assignments: any[]) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/v1/delivery-needs/${deliveryNeedId}/squad`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmedBy, notes, assignments: assignments.map(a => ({ candidateId: a.candidateId, skill: a.skill, agreedStartDate: a.agreedStartDate, allocationPercent: a.allocationPercent })) }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to confirm squad');
      setSquadResult(json);
      nav('success');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error');
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbs: Record<Screen, { label: string; screen?: Screen }[]> = {
    'dashboard': [{ label: 'Dashboard' }],
    'create-a': [{ label: 'Dashboard', screen: 'dashboard' }, { label: 'Delivery Needs' }, { label: 'Create New' }],
    'create-b': [{ label: 'Dashboard', screen: 'dashboard' }, { label: 'Delivery Needs' }, { label: 'Create New' }],
    'detail': [{ label: 'Dashboard', screen: 'dashboard' }, { label: 'Delivery Needs' }, { label: deliveryNeedId || 'New Need' }],
    'loading': [{ label: 'Dashboard', screen: 'dashboard' }, { label: 'Delivery Needs' }, { label: deliveryNeedId, screen: 'detail' }, { label: 'Generate Recommendations' }],
    'recs': [{ label: 'Dashboard', screen: 'dashboard' }, { label: 'Delivery Needs' }, { label: deliveryNeedId, screen: 'detail' }, { label: 'Recommendations' }],
    'confirm': [{ label: 'Dashboard', screen: 'dashboard' }, { label: 'Delivery Needs' }, { label: deliveryNeedId, screen: 'detail' }, { label: 'Confirm Squad' }],
    'success': [{ label: 'Dashboard', screen: 'dashboard' }, { label: 'Delivery Needs' }, { label: deliveryNeedId, screen: 'detail' }, { label: 'Squad Assembled' }],
  };

  const topbarRight: Record<Screen, React.ReactNode> = {
    'recs': (
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => nav('loading')} style={{ padding: '0 12px', height: 30, borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--text2)' }}>↺ Regenerate</button>
        <button onClick={() => nav('confirm')} style={{ padding: '0 12px', height: 30, borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none', background: 'var(--blue)', color: '#fff' }}>Review & Confirm Squad →</button>
      </div>
    ),
    'dashboard': null, 'create-a': null, 'create-b': null, 'detail': null, 'loading': null, 'confirm': null, 'success': null,
  };

  const confirmAssignments = selections.map(s => {
    const cand = skillSlots.flatMap(sl => sl.candidates).find(c => c.employeeId === s.employeeId);
    return { candidateId: s.employeeId, name: cand?.name ?? s.employeeId, role: cand?.role ?? '', skill: s.skill, agreedStartDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0], allocationPercent: 50 };
  });

  return (
    <Layout current={screen} onNav={nav} breadcrumbs={breadcrumbs[screen]} topbarRight={topbarRight[screen]}>
      {screen === 'dashboard' && <Dashboard onNav={nav} />}
      {screen === 'create-a' && <CreateStepA onNext={d => { setBasicDetails(d); nav('create-b'); }} onNav={nav} />}
      {screen === 'create-b' && <CreateStepB onBack={() => nav('create-a')} onSubmit={handleCreateNeed} loading={loading} />}
      {screen === 'detail' && <NeedDetail
        deliveryNeedId={deliveryNeedId}
        title={basicDetails?.title ?? ''}
        urgency={basicDetails?.urgency ?? 'HIGH'}
        startDate={basicDetails?.startDate ?? ''}
        durationWeeks={basicDetails?.durationWeeks ?? 4}
        createdBy="deliverylead@company.com"
        createdAt={new Date().toISOString()}
        requiredSkills={submittedSlots}
        status="CREATED"
        onGenerate={handleGenerateRecs}
        onNav={nav}
      />}
      {screen === 'loading' && <LoadingScreen deliveryNeedId={deliveryNeedId} onViewRecs={() => nav('recs')} onRetry={handleGenerateRecs} onBack={() => nav('detail')} />}
      {screen === 'recs' && <Recommendations skillSlots={skillSlots} generatedAt={generatedAt} onNav={nav} onConfirm={sel => { setSelections(sel); nav('confirm'); }} />}
      {screen === 'confirm' && <ConfirmSquad deliveryNeedId={deliveryNeedId} assignments={confirmAssignments} onBack={() => nav('recs')} onConfirm={handleConfirmSquad} loading={loading} error={error} />}
      {screen === 'success' && squadResult && <SuccessScreen {...squadResult} onDashboard={() => nav('dashboard')} />}
    </Layout>
  );
}
