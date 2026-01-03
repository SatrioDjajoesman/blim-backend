import { useState, useEffect, useRef, useCallback } from 'react';

const RECONNECT_INTERVAL = 3000;
const WS_URL = `ws://${window.location.hostname || 'localhost'}:3000`;

export const useWebSocket = () => {
  const [status, setStatus] = useState('disconnected'); // 'connected', 'disconnected', 'reconnecting'
  const [lastMessage, setLastMessage] = useState(null);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  const connect = useCallback(() => {
    // If already connected or connecting, don't try again
    if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      setStatus('reconnecting');
      console.log(`Connecting to ${WS_URL}...`);
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket Connected');
        setStatus('connected');
        // Clear any pending reconnects
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };

      ws.onmessage = (event) => {
        try {
          // Attempt to parse, but if it fails, handle gracefully or pass raw
          // The prompt says "No historical data... continuous JSON stream"
          // We pass the raw event data, parsing happens downstream
          setLastMessage(event.data);
        } catch (err) {
          console.error('Error handling message:', err);
        }
      };

      ws.onclose = (event) => {
        console.log('WebSocket Disconnected:', event.code, event.reason);
        setStatus('disconnected');
        wsRef.current = null;
        
        // Attempt reconnect
        if (!reconnectTimeoutRef.current) {
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectTimeoutRef.current = null;
            connect();
          }, RECONNECT_INTERVAL);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket Error:', error);
        ws.close(); // Ensure clean close which triggers onclose
      };

    } catch (error) {
      console.error('Connection setup error:', error);
      setStatus('disconnected');
      if (!reconnectTimeoutRef.current) {
        reconnectTimeoutRef.current = setTimeout(() => {
            reconnectTimeoutRef.current = null;
            connect();
        }, RECONNECT_INTERVAL);
      }
    }
  }, []);

  useEffect(() => {
    connect();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connect]);

  return { status, lastMessage };
};
