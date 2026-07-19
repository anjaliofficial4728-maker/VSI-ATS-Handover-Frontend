import { useEffect, useState } from "react";
import type { Candidate } from "../components/CandidateTable";
import { getCandidates } from "../services/candidateService";

export const useCandidates = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);

      const candidateData = await getCandidates();

      setCandidates(candidateData);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    candidates,
    loading,
    refresh: fetchData,
  };
};