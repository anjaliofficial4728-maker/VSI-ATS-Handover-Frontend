import { useEffect, useState } from "react";

interface CandidateForm {
  name: string;
  email: string;
  phone: string;
  interview_date: string;
  resume_url: string;
}

interface AddCandidateModalProps {
  isOpen: boolean;
  candidate?: any;
  onClose: () => void;
  onSubmit: (candidate: CandidateForm) => void;
}

export default function AddCandidateModal({
  isOpen,
  candidate,
  onClose,
  onSubmit,
}: AddCandidateModalProps) {
  const [form, setForm] = useState<CandidateForm>({
    name: "",
    email: "",
    phone: "",
    interview_date: "",
    resume_url: "",
  });

  useEffect(() => {
    if (candidate) {
      setForm({
        name: candidate.name,
        email: candidate.email,
        phone: candidate.phone,
        interview_date: candidate.interview_date,
        resume_url: candidate.resume_url || "",
      });
    } else {
      setForm({
        name: "",
        email: "",
        phone: "",
        interview_date: "",
        resume_url: "",
      });
    }
  }, [candidate, isOpen]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-xl">

        <h2 className="text-2xl font-bold mb-6">
          {candidate ? "Edit Candidate" : "Add Candidate"}
        </h2>

        <div className="space-y-4">

          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
          />

          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
          />

          <input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
          />

          <input
            type="date"
            name="interview_date"
            value={form.interview_date}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
          />

          <input
            name="resume_url"
            placeholder="Resume URL (optional)"
            value={form.resume_url}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
          />

        </div>

        <div className="flex justify-end gap-3 mt-8">

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg border"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white"
          >
            {candidate ? "Update Candidate" : "Add Candidate"}
          </button>

        </div>

      </div>
    </div>
  );
}