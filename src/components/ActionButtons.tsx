import { useState } from "react";
import { Loader2, RefreshCw, Plus } from "lucide-react";

interface ActionButtonsProps {
  onRefresh: () => void;
  onAddCandidate: () => void;
  loading?: boolean;
}

const ActionButtons = ({
  onRefresh,
  onAddCandidate,
  loading = false,
}: ActionButtonsProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <button
        onClick={onRefresh}
        disabled={loading}
        className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-100 transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <RefreshCw className="w-5 h-5" />
        )}
        Refresh
      </button>

      <button
        onClick={onAddCandidate}
        disabled={loading}
        className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <Plus className="w-5 h-5" />
        Add Candidate
      </button>
    </div>
  );
};

export default ActionButtons;