import { useState } from "react";
import {
  Mail,
  Phone,
  Calendar,
  User,
  Search,
  Edit,
  Trash2,
} from "lucide-react";
import SendEmailModal from "./SendEmailModal";

export interface Candidate {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  resume_url: string | null;
  interview_date: string;
  initial_email_sent_at: string | null;
  response_status: string;
  candidate_status: string;
  followup_count: number;
  last_followup_sent_at: string | null;
  updated_at: string;
}

const getCandidateStatusStyle = (status: string) => {
  switch (status.toLowerCase()) {
    case "applied":
      return "bg-yellow-100 text-yellow-700";
    case "selected":
      return "bg-blue-100 text-blue-700";
    case "hired":
      return "bg-green-100 text-green-700";
    case "rejected":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getResponseStatusStyle = (status: string) => {
  switch (status.toLowerCase()) {
    case "not sent":
      return "bg-gray-100 text-gray-700";
    case "pending":
      return "bg-orange-100 text-orange-700";
    case "responded":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getFollowupBadge = (count: number) => {
  if (count === 0) return "bg-gray-100 text-gray-700";
  if (count === 1) return "bg-blue-100 text-blue-700";
  if (count === 2) return "bg-orange-100 text-orange-700";
  return "bg-red-100 text-red-700";
};

interface CandidateTableProps {
  candidates: Candidate[];
  onEdit: (candidate: Candidate) => void;
  onDelete: (id: string) => void;
  onEmailSent?: () => void;
}

const CandidateTable = ({
  candidates,
  onEdit,
  onDelete,
  onEmailSent,
}: CandidateTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCandidateForEmail, setSelectedCandidateForEmail] =
    useState<Candidate | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const filteredCandidates = candidates.filter((candidate) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      candidate.name.toLowerCase().includes(search) ||
      candidate.email.toLowerCase().includes(search) ||
      (candidate.phone ?? "").toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "all" ||
      candidate.candidate_status.toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleSendEmail = (candidate: Candidate) => {
    setSelectedCandidateForEmail(candidate);
    setIsEmailModalOpen(true);
  };

  return (
    <>
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Candidates</h2>
              <p className="text-gray-500 mt-1">
                Showing {filteredCandidates.length} of {candidates.length}{" "}
                candidates
              </p>
            </div>

            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-full border border-gray-300 py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex gap-3 mt-6 flex-wrap">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-5 py-2 rounded-full text-sm font-medium ${
                statusFilter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              All
            </button>

            <button
              onClick={() => setStatusFilter("applied")}
              className={`px-5 py-2 rounded-full text-sm font-medium ${
                statusFilter === "applied"
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              Applied
            </button>

            <button
              onClick={() => setStatusFilter("selected")}
              className={`px-5 py-2 rounded-full text-sm font-medium ${
                statusFilter === "selected"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              Selected
            </button>

            <button
              onClick={() => setStatusFilter("hired")}
              className={`px-5 py-2 rounded-full text-sm font-medium ${
                statusFilter === "hired"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              Hired
            </button>

            <button
              onClick={() => setStatusFilter("rejected")}
              className={`px-5 py-2 rounded-full text-sm font-medium ${
                statusFilter === "rejected"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              Rejected
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-sm text-gray-600">
                <th className="px-8 py-4 font-semibold">Candidate</th>
                <th className="px-6 py-4 font-semibold">Resume</th>
                <th className="px-8 py-4 font-semibold">Contact</th>
                <th className="px-6 py-4 font-semibold">Applied</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Response</th>
                <th className="px-6 py-4 font-semibold text-center">
                  Follow-ups
                </th>
                <th className="px-8 py-4 font-semibold text-center">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredCandidates.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-14 text-center text-gray-500">
                    No candidates found.
                  </td>
                </tr>
              ) : (
                filteredCandidates.map((candidate) => (
                  <tr
                    key={candidate.id}
                    className="border-t border-gray-100 hover:bg-blue-50 transition"
                  >
                    {/* Candidate Name */}
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {candidate.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            ID {String(candidate.id).slice(0, 8)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Resume */}
                    <td className="px-6 py-6">
                    {candidate.resume_url ? (
                        <a
                        href={candidate.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                        📄 View
                        </a>
                    ) : (
                        <span className="text-gray-400 text-sm">No Resume</span>
                    )}
                    </td>

                    {/* Contact */}
                    <td className="px-8 py-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-blue-500" />
                          <span className="text-sm">{candidate.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-green-500" />
                          <span className="text-sm">{candidate.phone}</span>
                        </div>
                      </div>
                    </td>

                    {/* Applied Date */}
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-purple-500" />
                        {new Date(
                          candidate.interview_date
                        ).toLocaleDateString()}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-6">
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-semibold ${getCandidateStatusStyle(
                          candidate.candidate_status
                        )}`}
                      >
                        {candidate.candidate_status}
                      </span>
                    </td>

                    {/* Response */}
                    <td className="px-6 py-6">
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-semibold ${getResponseStatusStyle(
                          candidate.response_status
                        )}`}
                      >
                        {candidate.response_status}
                      </span>
                    </td>

                    {/* Follow-ups */}
                    <td className="px-6 py-6 text-center">
                      <div
                        className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full font-bold ${getFollowupBadge(
                          candidate.followup_count
                        )}`}
                      >
                        {candidate.followup_count}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-8 py-6">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => onEdit(candidate)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => handleSendEmail(candidate)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded transition"
                          title="Send Email"
                        >
                          <Mail className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => onDelete(candidate.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Email Modal */}
      {selectedCandidateForEmail && (
        <SendEmailModal
          isOpen={isEmailModalOpen}
          onClose={() => {
            setIsEmailModalOpen(false);
            setSelectedCandidateForEmail(null);
          }}
          candidateId={selectedCandidateForEmail.id}
          candidateName={selectedCandidateForEmail.name}
          candidateEmail={selectedCandidateForEmail.email}
          candidateStatus={selectedCandidateForEmail.candidate_status}
          onEmailSent={() => {
            setIsEmailModalOpen(false);
            setSelectedCandidateForEmail(null);
            onEmailSent?.();
          }}
        />
      )}
    </>
  );
};

export default CandidateTable;