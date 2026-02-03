import { useEffect, useRef } from 'react';
import { jobsApi } from '../services/jobsApi.js';
import { useJobStore } from '../stores/jobStore.js';
import { config } from '../config.js';

export const useJobPolling = (jobId, enabled = false) => {
  const intervalRef = useRef(null);
  const updateProgress = useJobStore(state => state.actions.updateProgress);
  const currentStatus = useJobStore(state => state.currentJob?.status);

  useEffect(() => {
    if (!enabled || !jobId) return;
    if (currentStatus === 'completed' || currentStatus === 'failed') {
      return; // Stop polling if job finished
    }

    const poll = async () => {
      try {
        const data = await jobsApi.getJobStatus(jobId);
        updateProgress(data);

        if (data.status === 'completed' || data.status === 'failed') {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    };

    intervalRef.current = setInterval(poll, config.pollInterval);
    poll(); // Initial poll

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [jobId, enabled, currentStatus, updateProgress]);
};
