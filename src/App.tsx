// src/app/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ROLES } from '@/shared/constants/roles';
import { ROUTES } from '@/config/routes';
import { ProtectedRoute } from '@/shared/ui/ProtectedRoute';

// Operator
import MyRoadmapPage from '@/pages/operator/my-roadmap/MyRoadmapPage';
import AchievementsPage from '@/pages/operator/achievements/AchievementsPage';
import ProfilePage from '@/pages/operator/profile/ProfilePage';

// Team Leader
import TeamLeaderDashboard from '@/pages/team-leader/TeamLeaderDashboard';

// Head of Department
import HeadDeptDashboard from '@/pages/head-dept/HeadDeptDashboard';

// Admin
import AdminDashboard from '@/pages/admin/AdminDashboard';

import LoginPage from '@/pages/login/LoginPage';
import GroupStatsPage from '@/pages/team-leader/group-stats/GroupStatsPage';
import ReviewQueuePage from '@/pages/team-leader/review-queue/ReviewQueuePage';
import EmployeeListPage from '@/pages/team-leader/employee-list/EmployeeListPage';
import EmployeeDetailPage from '@/pages/team-leader/employee-card/EmployeeDetailPage';

import GlobalAnalyticsPage from '@/pages/head-dept/global-analytics/GlobalAnalyticsPage';
import RoadmapTemplatesPage from '@/pages/head-dept/roadmap-templates/RoadmapTemplatesPage';
import TurnoverAnalysisPage from '@/pages/head-dept/turnover-analysis/TurnoverAnalysisPage';
import GamificationSettingsPage from '@/pages/head-dept/gamification/GamificationSettingsPage';

import UsersManagementPage from '@/pages/admin/users/UsersManagementPage';
import RoadmapConstructorPage from '@/pages/admin/roadmap-constructor/RoadmapConstructorPage';
import RoadmapsListPage from '@/pages/admin/roadmap-list/RoadmapsListPage';
import AccessControlPage from '@/pages/admin/system-settings/AccessControlPage';
import PersonalCabinetPage from "./pages/shared/PersonalCabinetPage";

function App() {
    return (
            <Routes>
                {/* Публичный вход */}
                <Route path={ROUTES.LOGIN} element={<LoginPage />} />

                {/* 👤 Оператор */}
                <Route path={ROUTES.OPERATOR.ROOT} element={
                    <ProtectedRoute allowedRoles={[ROLES.OPERATOR]}>
                        <Navigate to={ROUTES.OPERATOR.ROADMAP} replace />
                    </ProtectedRoute>
                } />
                <Route path={ROUTES.OPERATOR.ROADMAP} element={<ProtectedRoute allowedRoles={[ROLES.OPERATOR]}><MyRoadmapPage /></ProtectedRoute>} />
                <Route path={ROUTES.OPERATOR.ACHIEVEMENTS} element={<ProtectedRoute allowedRoles={[ROLES.OPERATOR]}><AchievementsPage /></ProtectedRoute>} />
                <Route path={ROUTES.OPERATOR.PROFILE} element={<ProtectedRoute allowedRoles={[ROLES.OPERATOR]}><PersonalCabinetPage /></ProtectedRoute>} />



                {/* 👥 Тимлид */}
                <Route path={ROUTES.TEAM_LEADER.ROOT} element={<ProtectedRoute allowedRoles={[ROLES.TEAM_LEADER]}><Navigate to={ROUTES.TEAM_LEADER.EMPLOYEES} replace /></ProtectedRoute>} />
                <Route path={ROUTES.TEAM_LEADER.STATS} element={<ProtectedRoute allowedRoles={[ROLES.TEAM_LEADER]}><GroupStatsPage /></ProtectedRoute>} />
                <Route path={ROUTES.TEAM_LEADER.EMPLOYEES} element={<ProtectedRoute allowedRoles={[ROLES.TEAM_LEADER]}><EmployeeListPage /></ProtectedRoute>} />
                <Route path={ROUTES.TEAM_LEADER.REVIEW} element={<ProtectedRoute allowedRoles={[ROLES.TEAM_LEADER]}><ReviewQueuePage /></ProtectedRoute>} />
                <Route path={ROUTES.TEAM_LEADER.EMPLOYEE_DETAIL} element={<ProtectedRoute allowedRoles={[ROLES.TEAM_LEADER]}><EmployeeDetailPage /></ProtectedRoute>} />
                <Route path={ROUTES.TEAM_LEADER.PROFILE} element={<ProtectedRoute allowedRoles={[ROLES.TEAM_LEADER]}><PersonalCabinetPage /></ProtectedRoute>} />


                {/* 📊 Руководитель направления */}
                <Route path={ROUTES.HEAD_DEPT.ROOT} element={<ProtectedRoute allowedRoles={[ROLES.HEAD_DEPT]}><Navigate to={ROUTES.HEAD_DEPT.ANALYTICS} replace /></ProtectedRoute>} />
                <Route path={ROUTES.HEAD_DEPT.ANALYTICS} element={<ProtectedRoute allowedRoles={[ROLES.HEAD_DEPT]}><GlobalAnalyticsPage /></ProtectedRoute>} />
                <Route path={ROUTES.HEAD_DEPT.TEMPLATES} element={<ProtectedRoute allowedRoles={[ROLES.HEAD_DEPT]}><RoadmapTemplatesPage /></ProtectedRoute>} />
                <Route path={ROUTES.HEAD_DEPT.TURNOVER} element={<ProtectedRoute allowedRoles={[ROLES.HEAD_DEPT]}><TurnoverAnalysisPage /></ProtectedRoute>} />
                <Route path={ROUTES.HEAD_DEPT.GAMIFICATION} element={<ProtectedRoute allowedRoles={[ROLES.HEAD_DEPT]}><GamificationSettingsPage /></ProtectedRoute>} />
                <Route path={ROUTES.HEAD_DEPT.PROFILE} element={<ProtectedRoute allowedRoles={[ROLES.HEAD_DEPT]}><PersonalCabinetPage /></ProtectedRoute>} />


                <Route path={ROUTES.HEAD_DEPT.ANALYTICS} element={<ProtectedRoute allowedRoles={[ROLES.HEAD_DEPT]}><HeadDeptDashboard /></ProtectedRoute>} />

                {/* 🛡️ Администратор */}
                <Route path={ROUTES.ADMIN.ROOT} element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]}><Navigate to={ROUTES.ADMIN.USERS} replace /></ProtectedRoute>} />
                <Route path={ROUTES.ADMIN.USERS} element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]}><UsersManagementPage /></ProtectedRoute>} />
                <Route path={ROUTES.ADMIN.ROADMAP_BUILDER} element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]}><RoadmapConstructorPage /></ProtectedRoute>} />
                <Route path={ROUTES.ADMIN.ACCESS_CONTROL} element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]}><AccessControlPage /></ProtectedRoute>} />
                <Route path={ROUTES.ADMIN.PROFILE} element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]}><PersonalCabinetPage /></ProtectedRoute>} />
                <Route path="/admin/roadmaps" element={
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <RoadmapsListPage />
                    </ProtectedRoute>
                } />

                {/* Глобальные редиректы */}
                <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
                <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
            </Routes>
    );
}

export default App;