'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface User {
    id: number;
    name: string;
    email: string;
    role: 'seeker' | 'employer' | 'admin';
    avatar: string | null;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string, password_confirmation: string, role: 'seeker' | 'employer') => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Load token from localStorage on mount
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            setToken(savedToken);
            fetchMe(savedToken);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchMe = async (t: string) => {
        try {
            const res = await axios.get(`${API}/auth/me`, {
                headers: { Authorization: `Bearer ${t}` },
            });
            setUser(res.data.user);
        } catch {
            // Token invalid or expired
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        const res = await axios.post(`${API}/auth/login`, { email, password });
        const { user, token } = res.data;
        localStorage.setItem('token', token);
        setToken(token);
        setUser(user);
    };

    const register = async (
        name: string,
        email: string,
        password: string,
        password_confirmation: string,
        role: 'seeker' | 'employer'
    ) => {
        const res = await axios.post(`${API}/auth/register`, {
            name, email, password, password_confirmation, role,
        });
        const { user, token } = res.data;
        localStorage.setItem('token', token);
        setToken(token);
        setUser(user);
    };

    const logout = async () => {
        try {
            await axios.post(`${API}/auth/logout`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
        } finally {
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{
            user, token, loading,
            login, register, logout,
            isAuthenticated: !!user,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
}