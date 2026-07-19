import { RefreshCw, Plus } from "lucide-react";

interface HeaderProps {
  onRefresh: () => void;
  onAddCandidate: () => void;
}

const Header = ({
  onRefresh,
  onAddCandidate,
}: HeaderProps) => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl text-white shadow-lg">
      <div className="flex items-center justify-between px-10 py-8">
        <div>
          <p className="uppercase tracking-widest text-sm text-blue-100">
            HR Console
          </p>

          <h1 className="text-5xl font-bold mt-2">
            Candidate Follow-up Dashboard
          </h1>

          <p className="text-blue-100 mt-2 text-lg">
            Track applications, interviews and offer responses in one place.
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 transition px-6 py-3 rounded-xl"
          >
            <RefreshCw size={18} />
            Refresh
          </button>

          <button
            onClick={onAddCandidate}
            className="flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 transition font-semibold px-6 py-3 rounded-xl"
          >
            <Plus size={18} />
            Add Candidate
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;