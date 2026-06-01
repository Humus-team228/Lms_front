import { NavLink } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import styles from './Sidebar.module.css';

export const HeadDeptSidebar = () => (
    <nav className={styles.nav}>
        <NavLink to={ROUTES.HEAD_DEPT.ANALYTICS} className={({isActive}) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}>
            📈 Аналитика KPI
        </NavLink>
        <NavLink to={ROUTES.HEAD_DEPT.TEMPLATES} className={({isActive}) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}>
            📋 Шаблоны роадмапов
        </NavLink>
        <NavLink to={ROUTES.HEAD_DEPT.TURNOVER} className={({isActive}) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}>
            📉 Текучесть кадров
        </NavLink>
        { /*<NavLink to={ROUTES.HEAD_DEPT.GAMIFICATION} className={({isActive}) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}>
            🎮 Геймификация
        </NavLink>*/}
        <NavLink to={ROUTES.HEAD_DEPT.PROFILE} className={({isActive}) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}>
            👤 Профиль
        </NavLink>
    </nav>
);