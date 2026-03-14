import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface AppNotification {
    id: number;
    type: string;
    title: string;
    body: string;
    link: string | null;
    is_read: boolean;
    read_at: string | null;
    created_at: string;
}

export function useNotifications() {
    const { token, user } = useAuth();
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const headers = { Authorization: `Bearer ${token}` };

    const fetchUnreadCount = useCallback(async () => {
        if (!token) return;
        try {
            const res = await axios.get(`${API}/notifications/unread-count`, { headers });
            setUnreadCount(res.data.count);
        } catch { }
    }, [token]);

    const fetchNotifications = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await axios.get(`${API}/notifications`, { headers });
            setNotifications(res.data.data || []);
            setUnreadCount((res.data.data || []).filter((n: AppNotification) => !n.is_read).length);
        } catch { }
        finally { setLoading(false); }
    }, [token]);

    const markRead = async (id: number) => {
        try {
            await axios.patch(`${API}/notifications/${id}/read`, {}, { headers });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch { }
    };

    const markAllRead = async () => {
        try {
            await axios.post(`${API}/notifications/read-all`, {}, { headers });
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true, read_at: new Date().toISOString() })));
            setUnreadCount(0);
        } catch { }
    };

    const deleteNotification = async (id: number) => {
        try {
            await axios.delete(`${API}/notifications/${id}`, { headers });
            const n = notifications.find(x => x.id === id);
            setNotifications(prev => prev.filter(x => x.id !== id));
            if (n && !n.is_read) setUnreadCount(prev => Math.max(0, prev - 1));
        } catch { }
    };

    // Poll unread count every 30s
    useEffect(() => {
        if (!token || !user) return;
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, [token, user]);

    return { notifications, unreadCount, loading, fetchNotifications, markRead, markAllRead, deleteNotification };
}