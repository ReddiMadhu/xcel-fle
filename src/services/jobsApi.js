import apiClient from './api.js';

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
    return response.data;
  },

  // DELETE /api/v1/jobs/{job_id} - Delete job (future feature)
  deleteJob: async (jobId) => {
    const response = await apiClient.delete(`/jobs/${jobId}`);
    return response.data;
  }
};
