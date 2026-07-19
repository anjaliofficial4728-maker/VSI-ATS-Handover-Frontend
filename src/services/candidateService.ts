// src/services/candidateService.ts
/**
 * Service for candidate-related API calls.
 * Updated for Phase 1 with email integration.
 */

import api from "./api";
import type { Candidate, CandidateCreateRequest, CandidateUpdateRequest, DashboardStats } from "../types/candidate";

/**
 * Get all candidates
 */
export const getCandidates = async (): Promise<Candidate[]> => {
  try {
    const response = await api.get("/candidates/");
    return response.data;
  } catch (error: any) {
    console.error("Error fetching candidates:", error);
    throw error;
  }
};

/**
 * Get candidate by ID
 */
export const getCandidateById = async (id: string): Promise<Candidate> => {
  try {
    const response = await api.get(`/candidates/${id}`);
    return response.data[0];
  } catch (error: any) {
    console.error("Error fetching candidate:", error);
    throw error;
  }
};

/**
 * Delete a candidate
 */
export const deleteCandidate = async (id: string): Promise<any> => {
  try {
    const response = await api.delete(`/candidates/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Error deleting candidate:", error);
    throw error;
  }
};

/**
 * Update candidate information
 */
export const updateCandidate = async (
  id: string,
  data: Partial<CandidateUpdateRequest>
): Promise<any> => {
  try {
    const response = await api.put(`/candidates/${id}`, data);
    return response.data;
  } catch (error: any) {
    console.error("Error updating candidate:", error);
    throw error;
  }
};

/**
 * Create a new candidate
 */
export const createCandidate = async (
  candidate: CandidateCreateRequest
): Promise<any> => {
  try {
    const response = await api.post("/candidates/", candidate);
    return response.data;
  } catch (error: any) {
    console.error("Error creating candidate:", error);
    throw error;
  }
};

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const response = await api.get("/candidates/dashboard");
    return response.data;
  } catch (error: any) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
};

/**
 * Legacy method - now use emailService.sendEmail() instead
 * @deprecated Use emailService.sendEmail() with email_type parameter
 */
export const sendOfferEmail = async (id: string): Promise<any> => {
  console.warn("sendOfferEmail is deprecated. Use emailService.sendEmail() instead.");
  try {
    const response = await api.post(`/candidates/${id}/send-email`, {
      email_type: "offer",
    });
    console.log("Backend Response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error sending email:", error);
    throw error;
  }
};
