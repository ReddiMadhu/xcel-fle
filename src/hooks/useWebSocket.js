import { useEffect, useState } from 'react';
import { JobWebSocket } from '../services/websocket.js';
import { useJobStore } from '../stores/jobStore.js';
import { useUIStore } from '../stores/uiStore.js';

export const useWebSocket = (jobId) => {
  const [ws, setWs] = useState(null);
  const [connected, setConnected] = useState(false);
  const updateProgress = useJobStore(state => state.actions.updateProgress);
  const showToast = useUIStore(state => state.actions.showToast);
  const setWsConnected = useUIStore(state => state.actions.setWsConnected);

  useEffect(() => {
    if (!jobId) return;

    const handleMessage = (message) => {
      console.log('WebSocket message:', message);

      switch (message.type) {
        case 'connected':
          setConnected(true);
          setWsConnected(true);
          if (message.data) {
            updateProgress(message.data);
          }
          break;
        case 'progress':
          updateProgress(message.data);
          break;
        case 'completed':
          updateProgress({
            status: 'completed',
            progress_percent: 100,
            ...message.data
          });
          showToast('Analysis completed successfully! 🎉', 'success');
          break;
        case 'error':
          updateProgress({
            status: 'failed',
            error: message.data.error
          });
          showToast(`Job failed: ${message.data.error}`, 'error');
          break;
        default:
          console.log('Unknown message type:', message.type);
      }
    };

    const handleError = () => {
      setConnected(false);
      setWsConnected(false);
      showToast('Live updates disconnected. Switching to polling...', 'warning');
    };

    const websocket = new JobWebSocket(jobId, handleMessage, handleError);
    setWs(websocket);

    return () => {
      websocket.close();
      setWsConnected(false);
    };
  }, [jobId, updateProgress, showToast, setWsConnected]);

  return { connected };
};
