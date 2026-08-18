import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { LiveFeedItem, WSEventType } from '@uniflow/shared-types';

const SOCKET_URL = 'http://localhost:3000';

export const useWebSocketStream = (initialLogs: any[] = []) => {
  const [events, setEvents] = useState<LiveFeedItem[]>(initialLogs);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket: Socket = io(SOCKET_URL, {
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
