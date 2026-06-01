import { NavLink } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import styles from './Sidebar.module.css';

export const OperatorSidebar = () => (
    <>
        <NavLink to={ROUTES.OPERATOR.ROADMAP} className={({isActive}) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}>
            🗺️ Моя дорожная карта
        </NavLink>
        <NavLink to={ROUTES.OPERATOR.ACHIEVEMENTS} className={({isActive}) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}>
            🏆 Достижения
        </NavLink>
        <NavLink to={ROUTES.OPERATOR.PROFILE} className={({isActive}) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}>
            👤 Профиль
        </NavLink>
    </>
);