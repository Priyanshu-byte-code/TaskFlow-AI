import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../app/store';
import { markAllRead, fetchNotifications } from '../features/notifications/notificationSlice';

const typeConfig: Record<string, { icon: string; color: string; bg: string }> = {
  task_assigned:  { icon: '👤', color: '#6366f1', bg: '#eef2ff' },
  task_updated:   { icon: '✏️', color: '#f59e0b', bg: '#fffbeb' },
  comment_added:  { icon: '💬', color: '#22c55e', bg: '#f0fdf4' },
  sprint_risk:    { icon: '⚠️', color: '#ef4444', bg: '#fef2f2' },
  ai_suggestion:  { icon: '🤖', color: '#8b5cf6', bg: '#f5f3ff' },
};

const timeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

const NotificationBell = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { notifications, unreadCount } = useSelector((s: RootState) => s.notifications);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleOpen = () => {
    const next = !open;
    setOpen(next);
    if (next) dispatch(fetchNotifications());
    if (!next && unreadCount > 0) dispatch(markAllRead());
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={handleOpen} style={{
        position: 'relative', width: 38, height: 38, borderRadius: 10,
        border: '1px solid #e5e7eb', background: open ? '#f3f4f6' : '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', transition: 'all 0.2s'
      }}>
        <svg width="16" height="16" fill="none" stroke="#374151" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: -4, right: -4,
            background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 700,
            borderRadius: '50%', width: 18, height: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid #fff'
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', right: 0, top: 46, width: 360,
          background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16,
          boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.08)',
          zIndex: 1000, overflow: 'hidden'
        }}>
          <div style={{
            padding: '16px 18px 12px', borderBottom: '1px solid #f3f4f6',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: '#111827', margin: 0 }}>Notifications</h3>
              {unreadCount > 0 && (
                <p style={{ fontSize: 12, color: '#6366f1', margin: '2px 0 0', fontWeight: 500 }}>
                  {unreadCount} unread
                </p>
              )}
            </div>
            {unreadCount > 0 && (
              <button onClick={() => dispatch(markAllRead())} style={{
                fontSize: 12, color: '#6366f1', background: '#eef2ff',
                border: 'none', borderRadius: 8, padding: '5px 10px',
                cursor: 'pointer', fontWeight: 500
              }}>Mark all read</button>
            )}
          </div>

          <div style={{ maxHeight: 380, overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '48px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>🔔</div>
                <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>No notifications yet</p>
                <p style={{ fontSize: 12, color: '#d1d5db', margin: '4px 0 0' }}>
                  You'll see updates here when tasks are assigned or updated
                </p>
              </div>
            ) : (
              notifications.map((n, idx) => {
                const config = typeConfig[n.type] || { icon: '🔔', color: '#6b7280', bg: '#f9fafb' };
                return (
                  <div key={n._id} style={{
                    display: 'flex', gap: 12, alignItems: 'flex-start',
                    padding: '14px 18px',
                    background: !n.isRead ? '#fafbff' : '#fff',
                    borderBottom: idx < notifications.length - 1 ? '1px solid #f9fafb' : 'none'
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10, background: config.bg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, fontSize: 16
                    }}>{config.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontSize: 13, color: '#111827', margin: '0 0 4px',
                        lineHeight: 1.5, fontWeight: !n.isRead ? 500 : 400
                      }}>{n.message}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{
                          fontSize: 11, color: config.color, background: config.bg,
                          padding: '2px 8px', borderRadius: 100, fontWeight: 500
                        }}>{n.type.replace(/_/g, ' ')}</span>
                        <span style={{ fontSize: 11, color: '#9ca3af' }}>{timeAgo(n.createdAt)}</span>
                      </div>
                    </div>
                    {!n.isRead && (
                      <div style={{
                        width: 7, height: 7, borderRadius: '50%',
                        background: '#6366f1', flexShrink: 0, marginTop: 5
                      }} />
                    )}
                  </div>
                );
              })
            )}
          </div>

          {notifications.length > 0 && (
            <div style={{ padding: '12px 18px', borderTop: '1px solid #f3f4f6', textAlign: 'center' }}>
              <button onClick={() => { dispatch(markAllRead()); setOpen(false); }} style={{
                fontSize: 12, color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer'
              }}>Clear all notifications</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;