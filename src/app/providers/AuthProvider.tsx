// src/app/providers/AuthProvider.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/shared/api/auth';
import { ROLES, type Role } from '@/shared/constants/roles';
import { ROUTES } from '@/config/routes';
import { AppUser, mapLoginResponseToUser } from '@/shared/types/auth';

interface AuthContextType {
    user: AppUser | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 🔹 Безопасный парсинг из localStorage
const safeParseStorage = <T,>(key: string): T | null => {
    try {
        const item = localStorage.getItem(key);
        if (!item || item === 'undefined' || item === 'null') return null;
        return JSON.parse(item) as T;
    } catch {
        localStorage.removeItem(key);
        return null;
    }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AppUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // Восстановление сессии
    useEffect(() => {
        const storedUser = safeParseStorage<AppUser>('lms_user');
        const storedToken = localStorage.getItem('lms_token');

        if (storedUser && storedToken) {
            setUser(storedUser);
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            // 1. Вызов API
            const response = await authService.login({ email, password });

            // 2. Маппинг ответа бэкенда → внутренний тип
            const appUser = mapLoginResponseToUser(response, email);

            // 3. Сохранение в localStorage (только безопасные данные)
            localStorage.setItem('lms_token', response.token);
            localStorage.setItem('lms_user', JSON.stringify(appUser));

            setUser(appUser);

            // 4. Редирект по роли
            const redirectMap: Record<Role, string> = {
                [ROLES.OPERATOR]: ROUTES.OPERATOR.ROADMAP,
                [ROLES.TEAM_LEADER]: ROUTES.TEAM_LEADER.STATS,
                [ROLES.HEAD_DEPT]: ROUTES.HEAD_DEPT.ANALYTICS,
                [ROLES.ADMIN]: ROUTES.ADMIN.USERS,
            };

            navigate(redirectMap[appUser.role] || '/');
        } catch (error) {
            // Пробрасываем ошибку для обработки в LoginForm
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('lms_token');
        localStorage.removeItem('lms_user');
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};