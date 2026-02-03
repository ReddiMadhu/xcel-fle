// Application configuration
export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  wsBaseUrl: import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:8000',
  maxFileSize: 100 * 1024 * 1024, // 100MB
  maxFiles: 5,
  allowedExtensions: ['.xlsx', '.xls', '.xlsm', '.csv'],
  pollInterval: 3000, // 3 seconds
  uploadTimeout: 300000 // 5 minutes
};
