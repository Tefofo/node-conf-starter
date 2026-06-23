interface ScoreBreakdown {
  skillMatch: number;
  availability: number;
  workload: number;
  roleAlignment: number;
}

interface Candidate {
  employeeId: string;
  name: string;
  role: string;
  compositeScore: number;
  scoreBreakdown: ScoreBreakdown;
  availableFrom: string | null;
  currentAllocation: number;
}

interface SkillSlotResult {
  skill: string;
  level: string;
  quantityRequired: number;
  candidates: Candidate[];
}

interface Props {
  skillSlots: SkillSlotResult[];
  selectedIds: string[];
  onToggle: (id: string, skill: string) => void;
  onFormSquad: () => void;
  loading: boolean;
}

export function CandidateList({ skillSlots, selectedIds, onToggle, onFormSquad, loading }: Props) {
  const totalCandidates = skillSlots.reduce((sum, s) => sum + s.candidates.length, 0);

  if (totalCandidates === 0) {
    return <p className="text-gray-500 text-center py-8">No matching candidates found for any skill slot.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Recommended Candidates</h3>
        {selectedIds.length > 0 && (
          <button onClick={onFormSquad} disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
            Confirm Squad ({selectedIds.length})
          </button>
        )}
      </div>

      {skillSlots.map((slot) => (
        <div key={`${slot.skill}-${slot.level}`} className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-800">{slot.skill}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{slot.level}</span>
                <span className="text-xs text-gray-500">Need {slot.quantityRequired}</span>
              </div>
            </div>
          </div>

          {slot.candidates.length === 0 ? (
            <p className="px-4 py-3 text-sm text-gray-400">No eligible candidates for this slot.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {slot.candidates.map((c, idx) => (
                <div key={c.employeeId}
                  className={`px-4 py-3 cursor-pointer transition ${selectedIds.includes(c.employeeId) ? 'bg-green-50' : 'hover:bg-gray-50'}`}
                  onClick={() => onToggle(c.employeeId, slot.skill)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{c.name}</p>
                        <p className="text-xs text-gray-500">{c.role} · {c.currentAllocation}% allocated</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-blue-600">{c.compositeScore}</span>
                      <p className="text-xs text-gray-400">score</p>
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-4 gap-2 text-xs">
                    <ScoreChip label="Skill" value={c.scoreBreakdown.skillMatch} />
                    <ScoreChip label="Avail" value={c.scoreBreakdown.availability} />
                    <ScoreChip label="Capacity" value={c.scoreBreakdown.workload} />
                    <ScoreChip label="Role Fit" value={c.scoreBreakdown.roleAlignment} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ScoreChip({ label, value }: { label: string; value: number }) {
  const color = value >= 80 ? 'text-green-700 bg-green-50' : value >= 50 ? 'text-yellow-700 bg-yellow-50' : 'text-red-700 bg-red-50';
  return (
    <span className={`${color} px-1.5 py-0.5 rounded text-center`}>
      {label}: {value}
    </span>
  );
}
