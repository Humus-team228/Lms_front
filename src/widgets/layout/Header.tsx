// src/widgets/layout/Header.tsx
import React from 'react';
import { useAuth } from '@/app/providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/shared/hooks/useTheme';
import styles from './Header.module.css';

export const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                <span className={styles.logoIcon}>📚</span>
                <span className={styles.logoText}>LMS</span>
            </div>

            <div className={styles.userInfo}>
                <button
                    onClick={toggleTheme}
                    className={styles.themeToggle}
                    aria-label="Переключить тему"
                    title={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
                >
                    {theme === 'dark' ? '☀️' : '🌙'}
                </button>

                <div className={styles.userName}>
                    <span className={styles.userRole}>{user?.role}</span>
                    {user?.name || user?.full_name}
                </div>
                <button onClick={handleLogout} className={styles.logoutBtn}>
                    Выйти
                </button>
            </div>
        </header>
    );
};