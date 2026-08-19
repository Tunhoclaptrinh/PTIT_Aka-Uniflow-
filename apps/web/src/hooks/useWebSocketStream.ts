import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { LiveFeedItem, WSEventType } from '@uniflow/shared-types';

const getSocketUrl = (): string => {
  const envWs = import.meta.env.VITE_WS_URL || import.meta.env.VITE_SOCKET_URL;
  if (envWs) return envWs;

  const envApi = import.meta.env.VITE_API_URL;
  if (envApi) {
    return envApi.replace('/api/v1', '');
  }

  if (typeof window !== 'undefined') {
    const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
    const hostname = window.location.hostname || 'localhost';
    const port = window.location.port === '5173' || window.location.port === '3001' ? ':3000' : (window.location.port ? `:${window.location.port}` : '');
    return `${protocol}//${hostname}${port}`;
  }

  return 'http://localhost:3000';
};

export const useWebSocketStream = (initialLogs: any[] = []) => {
  const [events, setEvents] = useState<LiveFeedItem[]>(initialLogs);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketUrl = getSocketUrl();
    const socket: Socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      setIsConnected(true);
      console.log('⚡ [WebSocket Connected] Kết nối tới UniFlow Realtime Server thành công');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.warn('⚠️ [WebSocket Disconnected] Đã ngắt kết nối realtime');
    });

    socket.on(WSEventType.LOG_EMITTED, (data: LiveFeedItem) => {
      console.log('🔔 [WebSocket Event]:', data);
      setEvents((prev) => [data, ...prev.slice(0, 49)]); // Giữ tối đa 50 sự kiện mới nhất
    });

    socket.on(WSEventType.ORDER_SYNCED, (data: LiveFeedItem) => {
      setEvents((prev) => {
        if (prev.some((e) => e.id === data.id)) return prev;
        return [data, ...prev.slice(0, 49)];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const clearEvents = () => setEvents([]);

  return { events, isConnected, clearEvents, setEvents };
};
