import apiClient from './api.js';
import { validateAndLog } from '../utils/apiResponseValidator.js';

export const jobsApi = {
  // POST /api/v1/jobs - Upload files
  createJob: async (files, onUploadProgress) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    const response = await apiClient.post('/jobs', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onUploadProgress(percentCompleted);
        }
      }
    });

    return response.data; // { job_id, status, created_at, file_count }
  },

  // GET /api/v1/jobs/{job_id} - Get job status
  getJobStatus: async (jobId) => {
    const response = await apiClient.get(`/jobs/${jobId}`);
    return response.data;
  },

  // GET /api/v1/jobs/{job_id}/result - Get analysis result
  getJobResult: async (jobId) => {
    const response = await apiClient.get(`/jobs/${jobId}/result`);

    // Validate API response in development mode
    if (import.meta.env.DEV) {
      console.group(`📋 API Response Validation for Job: ${jobId}`);
      validateAndLog(response.data);
      console.groupEnd();
    }

    return response.data;
  },

  // DELETE /api/v1/jobs/{job_id} - Delete job (future feature)
  deleteJob: async (jobId) => {
    const response = await apiClient.delete(`/jobs/${jobId}`);
    return response.data;
  },

  // ==================== Preview Endpoints ====================

  // POST /api/v1/jobs/preview - Upload files for preview
  createPreview: async (files, onUploadProgress) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    const response = await apiClient.post('/jobs/preview', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onUploadProgress?.(percentCompleted);
        }
      }
    });

    return response.data; // { preview_id, files, total_duplicates_detected, ... }
  },

  // POST /api/v1/jobs/preview/{preview_id}/confirm - Confirm and start processing
  confirmPreview: async (previewId, fileSelections) => {
    const response = await apiClient.post(
      `/jobs/preview/${previewId}/confirm`,
      { file_selections: fileSelections }
    );

    return response.data; // { job_id, status, columns_removed, ... }
  },

  // DELETE /api/v1/jobs/preview/{preview_id} - Cancel preview
  cancelPreview: async (previewId) => {
    const response = await apiClient.delete(`/jobs/preview/${previewId}`);
    return response.data;
  }
};
