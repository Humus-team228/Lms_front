import React from 'react';
import { useAuth } from '@/app/providers/AuthProvider';
import { ROLES } from '@/shared/constants/roles';
import { OperatorSidebar } from './OperatorSidebar';
import { TeamLeaderSidebar } from './TeamLeaderSidebar';
import { HeadDeptSidebar } from './HeadDeptSidebar';
import { AdminSidebar } from './AdminSidebar';
import styles from './Sidebar.module.css';

export const Sidebar: React.FC = () => {
    const { user } = useAuth();
    if (!user) return null;

    return (
        <aside className={styles.sidebar}>
            <nav className={styles.nav}>
                {user.role === ROLES.OPERATOR && <OperatorSidebar />}
                {user.role === ROLES.TEAM_LEADER && <TeamLeaderSidebar />}
                {user.role === ROLES.HEAD_DEPT && <HeadDeptSidebar />}
                {user.role === ROLES.ADMIN && <AdminSidebar />}
            </nav>
        </aside>
    );
};