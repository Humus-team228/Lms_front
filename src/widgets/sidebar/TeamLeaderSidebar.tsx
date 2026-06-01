import { NavLink } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import styles from './Sidebar.module.css';

export const TeamLeaderSidebar = () => (
    <nav className={styles.nav}>
        <NavLink to={ROUTES.TEAM_LEADER.STATS} className={({isActive}) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}>
            📊 Статистика группы
        </NavLink>
        <NavLink to={ROUTES.TEAM_LEADER.REVIEW} className={({isActive}) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}>
            ✅ Очередь проверки
        </NavLink>
        <NavLink to={ROUTES.TEAM_LEADER.EMPLOYEES} className={({isActive}) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}>
            👥 Сотрудники
        </NavLink>
        <NavLink to={ROUTES.TEAM_LEADER.PROFILE} className={({isActive}) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}>
            👤 Профиль
        </NavLink>
    </nav>
);