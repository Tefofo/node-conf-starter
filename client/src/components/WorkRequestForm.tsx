import { useState } from 'react';

const SKILL_OPTIONS = [
  'Solution Architecture', 'Cloud Architecture', 'Java Development', 'React Development',
  'QA Testing', 'QA Automation', 'Performance Testing', 'Data Engineering', 'Python',
  'SQL', 'DevOps', 'Kubernetes', 'UX Design', 'User Research', 'Prototyping',
  'Agile Delivery', 'Stakeholder Management', 'Requirements Analysis', 'Facilitation',
  'Microservices', 'API Design', 'Security Architecture',
];

const LEVELS = ['JUNIOR', 'MID', 'SENIOR', 'LEAD', 'PRINCIPAL'] as const;
const URGENCY = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;

interface SkillSlot {
  skill: string;
  level: string;
  quantity: number;
}

interface FormData {
  title: string;
  description: string;
  urgency: string;
  startDate: string;
  durationWeeks: number;
  requiredSkills: SkillSlot[];
}

interface Props {
  onSubmit: (data: FormData) => void;
  loading: boolean;
}

export function WorkRequestForm({ onSubmit, loading }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<string>('HIGH');
  const [startDate, setStartDate] = useState(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
  const [durationWeeks, setDurationWeeks] = useState(8);
  const [slots, setSlots] = useState<SkillSlot[]>([{ skill: 'Solution Architecture', level: 'SENIOR', quantity: 1 }]);

  const addSlot = () => setSlots([...slots, { skill: '', level: 'MID', quantity: 1 }]);
  const removeSlot = (i: number) => setSlots(slots.filter((_, idx) => idx !== i));
  const updateSlot = (i: number, field: keyof SkillSlot, value: string | number) => {
    const updated = [...slots];
    (updated[i] as any)[field] = value;
    setSlots(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || slots.length === 0 || slots.some((s) => !s.skill)) return;
    onSubmit({ title, description, urgency, startDate, durationWeeks, requiredSkills: slots });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Initiative Title *</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Digital Onboarding Platform" maxLength={120}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of the delivery need..." rows={2}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Urgency *</label>
          <select value={urgency} onChange={(e) => setUrgency(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2">
            {URGENCY.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Duration (weeks)</label>
          <input type="number" min={1} value={durationWeeks} onChange={(e) => setDurationWeeks(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Required Skill Slots *</label>
          <button type="button" onClick={addSlot} className="text-sm text-blue-600 hover:underline">+ Add slot</button>
        </div>
        <div className="space-y-2">
          {slots.map((slot, i) => (
            <div key={i} className="flex gap-2 items-center">
              <select value={slot.skill} onChange={(e) => updateSlot(i, 'skill', e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-2 py-1.5 text-sm">
                <option value="">Select skill...</option>
                {SKILL_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={slot.level} onChange={(e) => updateSlot(i, 'level', e.target.value)}
                className="w-28 border border-gray-300 rounded-lg px-2 py-1.5 text-sm">
                {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
              <input type="number" min={1} value={slot.quantity} onChange={(e) => updateSlot(i, 'quantity', Number(e.target.value))}
                className="w-16 border border-gray-300 rounded-lg px-2 py-1.5 text-sm" />
              {slots.length > 1 && (
                <button type="button" onClick={() => removeSlot(i)} className="text-red-400 hover:text-red-600 text-lg">×</button>
              )}
            </div>
          ))}
        </div>
      </div>

      <button type="submit" disabled={loading || !title || slots.some((s) => !s.skill)}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2.5 px-4 rounded-lg transition">
        {loading ? 'Creating...' : 'Create Delivery Need'}
      </button>
    </form>
  );
}
