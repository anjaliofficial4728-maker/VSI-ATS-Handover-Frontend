// src/types/candidate.ts
/**
 * TypeScript types for candidate-related data structures.
 */

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  resume_url?: string;
  interview_date: string;
  candidate_status: string;
  response_status: string;
  followup_count: number;
  initial_email_sent_at?: string;
  last_followup_sent_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CandidateCreateRequest {
  name: string;
  email: string;
  phone?: string;
  interview_date: string;
  resume_url?: string;
}

export interface CandidateUpdateRequest {
  name?: string;
  email?: string;
  phone?: string;
  interview_date?: string;
  resume_url?: string;
  response_status?: string;
  candidate_status?: string;
}

export interface DashboardStats {
  total_candidates: number;
  selected: number;
  hired: number;
  pending_responses: number;
}

export type CandidateStatus =
  | "applied"
  | "screening_passed"
  | "interview_scheduled"
  | "interview_passed"
  | "selected"
  | "hired"
  | "rejected";

export type ResponseStatus = "not_sent" | "pending" | "responded" | "declined";
