import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../app/store';
import { socketTaskCreated, socketTaskUpdated, socketTaskDeleted, socketStatusChanged } from '../features/tasks/taskSlice';
import { addNotification, fetchNotifications } from '../features/notifications/notificationSlice';

let socket: Socket;

export const useSocket = (userId: string | undefined, projectId: string | undefined) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!userId) return;

    socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      socket.emit('join:user', userId);
      if (projectId) socket.emit('join:project', projectId);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    // Task events
    socket.on('task:created', (task) => dispatch(socketTaskCreated(task)));
    socket.on('task:updated', (task) => dispatch(socketTaskUpdated(task)));
    socket.on('task:deleted', ({ taskId }) => dispatch(socketTaskDeleted(taskId)));
    socket.on('task:statusChanged', (payload) => dispatch(socketStatusChanged(payload)));

    // Notification events — backend emits 'notification:new'
    socket.on('notification:new', (notif) => {
      dispatch(addNotification(notif));
      // Also refresh full list to get populated sender data
      dispatch(fetchNotifications());
    });

    // Legacy event name support
    socket.on('notification', (notif) => {
      dispatch(addNotification(notif));
      dispatch(fetchNotifications());
    });

    return () => {
      if (projectId) socket.emit('leave:project', projectId);
      socket.disconnect();
    };
  }, [userId, projectId, dispatch]);

  return socket;
};