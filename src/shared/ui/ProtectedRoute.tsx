// src/shared/ui/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';
import { ROLES } from '@/shared/constants/roles';
import { ROUTES } from '@/config/routes';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: (typeof ROLES)[keyof typeof ROLES][];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) return <div style={{ padding: 20, textAlign: 'center' }}>Загрузка...</div>;

    // 1. Не авторизован → на логин
    if (!user) {
        return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
    }

    // 2. Авторизован, но роль не подходит → редирект на его главный экран
    if (!allowedRoles.includes(user.role)) {
        const defaultRoute =
            user.role === ROLES.OPERATOR ? ROUTES.OPERATOR.ROADMAP :
                user.role === ROLES.TEAM_LEADER ? ROUTES.TEAM_LEADER.STATS :
                    user.role === ROLES.HEAD_DEPT ? ROUTES.HEAD_DEPT.ANALYTICS :
                        ROUTES.ADMIN.USERS;

        return <Navigate to={defaultRoute} replace />;
    }

    return <>{children}</>;
};