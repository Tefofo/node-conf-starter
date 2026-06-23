interface Props {
  squadId: string;
  deliveryNeedId: string;
  status: string;
  memberCount: number;
  confirmedBy: string;
  onReset: () => void;
}

export function SquadSummary({ squadId, deliveryNeedId, status, memberCount, confirmedBy, onReset }: Props) {
  return (
    <div className="space-y-4 text-center">
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <p className="text-green-700 font-semibold text-xl">✓ Squad {status === 'ASSEMBLED' ? 'Assembled' : 'Partially Assembled'}</p>
        <p className="text-sm text-green-600 mt-2">Squad ID: <span className="font-mono">{squadId}</span></p>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-gray-500">Delivery Need</p>
          <p className="font-medium">{deliveryNeedId}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-gray-500">Members</p>
          <p className="font-medium">{memberCount}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-gray-500">Status</p>
          <p className="font-medium">{status}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-gray-500">Confirmed By</p>
          <p className="font-medium text-xs">{confirmedBy}</p>
        </div>
      </div>

      <button onClick={onReset}
        className="w-full border border-gray-300 text-gray-700 font-medium py-2.5 px-4 rounded-lg hover:bg-gray-50 transition">
        Create Another Delivery Need
      </button>
    </div>
  );
}
