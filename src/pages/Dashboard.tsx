import {
  createCandidate,
  updateCandidate,
  deleteCandidate,
  sendOfferEmail,
} from "../services/candidateService";

import { useState, useEffect } from "react";
import { getDashboardStats } from "../services/candidateService";
import AddCandidateModal from "../components/AddCandidateModal";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import CandidateTable from "../components/CandidateTable";
import { Users, UserCheck, Briefcase, Mail } from "lucide-react";
import { useCandidates } from "../hooks/useCandidates";

const Dashboard = () => {
  const { candidates, loading, refresh } = useCandidates();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState({
    total_candidates: 0,
    selected: 0,
    hired: 0,
    pending_responses: 0,
  });
  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      }
    };

    loadStats();
  }, [candidates]);

  const [editingCandidate, setEditingCandidate] = useState<any>(null);

const totalCandidates = stats.total_candidates;
const selectedCandidates = stats.selected;
const hiredCandidates = stats.hired;
const pendingResponses = stats.pending_responses;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-semibold">
        Loading candidates...
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        onRefresh={refresh}
        onAddCandidate={() => setIsModalOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Candidates"
            value={totalCandidates}
            icon={Users}
          />

          <StatCard
            title="Selected"
            value={selectedCandidates}
            icon={UserCheck}
          />

          <StatCard
            title="Hired"
            value={hiredCandidates}
            icon={Briefcase}
          />

          <StatCard
            title="Pending Responses"
            value={pendingResponses}
            icon={Mail}
          />
        </div>

        <CandidateTable
          candidates={candidates}
          onEdit={(candidate) => {
            setEditingCandidate(candidate);
            setIsModalOpen(true);
          }}
          onDelete={async (id) => {
            const confirmDelete = window.confirm(
              "Are you sure you want to delete this candidate?"
            );

            if (!confirmDelete) return;

            try {
              await deleteCandidate(id);
              await refresh();
              alert("Candidate deleted successfully!");
            } catch (error) {
              console.error(error);
              alert("Failed to delete candidate.");
            }
          }}
          onSendEmail={async (id) => {
            try {
              const response = await sendOfferEmail(id);

              console.log(response);

              await refresh();

              alert(response.message);
            } catch (error) {
              console.error(error);
              alert("Failed to send offer email.");
            }
          }}
        />
      </main>
      <AddCandidateModal
        isOpen={isModalOpen}
        candidate={editingCandidate}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCandidate(null);
        }}
        onSubmit={async (candidate) => {
          try {
            if (editingCandidate) {
            await updateCandidate(editingCandidate.id, candidate);
            alert("Candidate updated successfully!");
          } else {
            await createCandidate(candidate);
            alert("Candidate added successfully!");
          }

          setIsModalOpen(false);
          setEditingCandidate(null);
          await refresh();
        } catch (error) {
          console.error(error);
          alert("Operation failed.");
        }
       }}
     />
    </div>
  );
};

export default Dashboard;