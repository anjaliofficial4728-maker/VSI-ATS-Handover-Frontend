// src/components/SendEmailModal.tsx
/**
 * Modal component for sending emails to candidates.
 * Allows selection of email type and input of extra data.
 */

import { useState, useEffect } from "react";
import { Loader2, X, AlertCircle, CheckCircle } from "lucide-react";
const DEFAULT_APPLICATION_FORM_URL = "https://forms.gle/b8q8k5xa7JoY2Sup8";

import {
  sendEmail,
  getEmailTypes,
  getValidationError,
} from "../services/emailService";

import type {
  EmailType,
  SendEmailResponse,
} from "../services/emailService";

interface SendEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidateStatus: string;
  onEmailSent?: (response: SendEmailResponse) => void;
}

const SendEmailModal = ({
  isOpen,
  onClose,
  candidateId,
  candidateName,
  candidateEmail,
  candidateStatus,
  onEmailSent,
}: SendEmailModalProps) => {
  const [emailTypes, setEmailTypes] = useState<EmailType[]>([]);
  const [selectedEmailType, setSelectedEmailType] = useState<string>("");
  const [extraData, setExtraData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch email types on component mount
  useEffect(() => {
    const fetchEmailTypes = async () => {
      try {
        setLoading(true);
        const response = await getEmailTypes();
        setEmailTypes(response.email_types);
      } catch (err: any) {
        setError("Failed to load email types");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchEmailTypes();
    }
  }, [isOpen]);

  // Get selected email type definition
  const selectedEmailTypeDef = emailTypes.find((et) => et.key === selectedEmailType);

  // Check if current selection is valid
  const validationError = selectedEmailType
    ? getValidationError(selectedEmailType, candidateStatus, emailTypes)
    : "";

  const isValidSelection = !validationError && selectedEmailType;

  // Handle email type selection
const handleEmailTypeChange = (value: string) => {
    setSelectedEmailType(value);
    setError("");
    setSuccess(false);
    // Reset extra data, but pre-fill the form URL for application
    // form emails since it's the same form for every candidate.
    if (value === "application_form") {
      setExtraData({ form_url: DEFAULT_APPLICATION_FORM_URL });
    } else {
      setExtraData({});
    }
  };

  // Handle extra data input
  const handleExtraDataChange = (key: string, value: string) => {
    setExtraData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Validate required extra data
  const requiredFields = selectedEmailTypeDef?.requires_extra_data || [];
  const hasAllRequiredData = requiredFields.every((field) => extraData[field]?.trim() !== "");

  // Send email
  const handleSendEmail = async () => {
    if (!isValidSelection) {
      setError("Please select a valid email type");
      return;
    }

    if (!hasAllRequiredData) {
      setError(`Missing required fields: ${requiredFields.join(", ")}`);
      return;
    }

    try {
      setSending(true);
      setError("");

      const response = await sendEmail({
        candidate_id: candidateId,
        email_type: selectedEmailType,
        extra_data: Object.keys(extraData).length > 0 ? extraData : undefined,
      });

      if (response.success) {
        setSuccess(true);
        setSuccessMessage(response.message);
        setTimeout(() => {
          onEmailSent?.(response);
          handleClose();
        }, 2000);
      } else {
        setError(response.error || response.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to send email");
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  // Close modal and reset state
  const handleClose = () => {
    setSelectedEmailType("");
    setExtraData({});
    setError("");
    setSuccess(false);
    setSuccessMessage("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">Send Email to {candidateName}</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Candidate Info */}
          <div className="bg-blue-50 p-4 rounded-lg text-sm">
            <p>
              <strong>Candidate:</strong> {candidateName} ({candidateEmail})
            </p>
            <p>
              <strong>Current Status:</strong> {candidateStatus}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          )}

          {/* Email Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Type *
            </label>
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              </div>
            ) : (
              <select
                value={selectedEmailType}
                onChange={(e) => handleEmailTypeChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select an email type...</option>
                {emailTypes.map((emailType) => {
                  const isValid = !getValidationError(
                    emailType.key,
                    candidateStatus,
                    emailTypes
                  );
                  return (
                    <option
                      key={emailType.key}
                      value={emailType.key}
                      disabled={!isValid}
                    >
                      {emailType.name}
                      {!isValid ? " (Not available for current status)" : ""}
                    </option>
                  );
                })}
              </select>
            )}
            {validationError && (
              <p className="text-sm text-red-600 mt-2">{validationError}</p>
            )}
          </div>

          {/* Email Type Description */}
          {selectedEmailTypeDef && (
            <div className="bg-gray-50 p-4 rounded-lg text-sm">
              <p className="text-gray-700">{selectedEmailTypeDef.description}</p>
            </div>
          )}

          {/* Extra Data Fields */}
          {selectedEmailTypeDef && selectedEmailTypeDef.requires_extra_data && (
            <div className="space-y-3 pt-4 border-t">
              <h3 className="font-medium text-gray-700">Required Information:</h3>
              {selectedEmailTypeDef.requires_extra_data.map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.replace(/_/g, " ").toUpperCase()} *
                  </label>
                  {field === "interview_date" ? (
                    <input
                      type="date"
                      value={extraData[field] || ""}
                      onChange={(e) => handleExtraDataChange(field, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : field === "meeting_link" || field === "form_url" || field === "registration_form_url" ? (
                    <input
                      type="url"
                      placeholder="https://..."
                      value={extraData[field] || ""}
                      onChange={(e) => handleExtraDataChange(field, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <input
                      type="text"
                      value={extraData[field] || ""}
                      onChange={(e) => handleExtraDataChange(field, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t">
          <button
            onClick={handleClose}
            disabled={sending}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSendEmail}
            disabled={!isValidSelection || !hasAllRequiredData || sending || success}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending && <Loader2 className="w-4 h-4 animate-spin" />}
            {sending ? "Sending..." : "Send Email"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendEmailModal;
