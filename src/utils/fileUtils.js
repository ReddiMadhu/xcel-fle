/**
 * File utility functions
 */

/**
 * Extracts the original filename from backend-stored filename
 * Backend format: file_{12-char-hex}_{original_filename}
 *
 * @param {string} storedFilename - The filename as stored by backend
 * @returns {string} - The original filename
 *
 * @example
 * extractOriginalFilename("file_baf644ec0b_agents.xlsx") // "agents.xlsx"
 * extractOriginalFilename("file_abc123def456_my_file_name.xlsx") // "my_file_name.xlsx"
 * extractOriginalFilename("regular_file.xlsx") // "regular_file.xlsx" (unchanged)
 */
export const extractOriginalFilename = (storedFilename) => {
  if (!storedFilename || typeof storedFilename !== 'string') {
    return storedFilename;
  }

  // Pattern: file_{12 hex chars}_
  // Using regex to match exactly 12 hexadecimal characters
  const pattern = /^file_[a-f0-9]{12}_/;

  if (pattern.test(storedFilename)) {
    return storedFilename.replace(pattern, '');
  }

  return storedFilename;
};

/**
 * Check if a filename follows the backend storage pattern
 * @param {string} filename
 * @returns {boolean}
 */
export const isBackendStoredFilename = (filename) => {
  if (!filename || typeof filename !== 'string') return false;
  return /^file_[a-f0-9]{12}_/.test(filename);
};

/**
 * Format file size for display
 * @param {number} bytes
 * @returns {string}
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};
