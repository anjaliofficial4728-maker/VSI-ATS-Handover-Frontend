import api from "./api";

export interface SendEmailRequest {
  candidate_id: string;
  email_type: string;
  extra_data?: Record<string, any>;
}

export interface SendEmailResponse {
  success: boolean;
  message: string;
  email_log_id?: string;
  error?: string;
}

export interface EmailType {
  key: string;
  name: string;
  description: string;
  allowed_statuses: string[];
  subject: string;
  requires_extra_data?: string[];
}

export const sendEmail = async (request: SendEmailRequest): Promise<SendEmailResponse> => {
  const response = await api.post("/api/emails/send", request);
  return response.data;
};

export const getEmailTypes = async () => {
  const response = await api.get("/api/emails/types");
  return response.data;
};

export const getValidationError = (
  emailType: string,
  candidateStatus: string,
  emailTypes: EmailType[]
): string => {
  const emailTypeDef = emailTypes.find((et) => et.key === emailType);
  if (!emailTypeDef) return `Invalid email type`;
  if (!emailTypeDef.allowed_statuses.includes(candidateStatus)) {
    return `Cannot send to this status`;
  }
  return "";
};