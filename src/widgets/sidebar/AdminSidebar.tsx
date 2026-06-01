import React from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import styles from './Sidebar.module.css';

export const AdminSidebar: React.FC = () => (
    <>
        <NavLink to={ROUTES.ADMIN.USERS} className={({isActive}) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}>
            👥 Пользователи
        </NavLink>
        <NavLink to={ROUTES.ADMIN.ROADMAP_BUILDER} className={({isActive}) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}>
            ️ Конструктор роадмапов
        </NavLink>
        <NavLink to={ROUTES.ADMIN.ROADMAPS} className={({isActive}) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}>
            📋 Все роадмапы
        </NavLink>
        {/*<NavLink to={ROUTES.ADMIN.ACCESS_CONTROL} className={({isActive}) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}>
            🔐 Права доступа (RLS)
        </NavLink>*/}
        <NavLink to={ROUTES.ADMIN.PROFILE} className={({isActive}) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}>
            👤 Профиль
        </NavLink>
    </>
);