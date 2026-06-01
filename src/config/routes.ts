// src/config/routes.ts
export const ROUTES = {
    LOGIN: '/login',
    OPERATOR: {
        ROOT: '/operator',
        ROADMAP: '/operator/roadmap',
        ACHIEVEMENTS: '/operator/achievements',
        PROFILE: '/operator/profile',
    },
    TEAM_LEADER: {
        ROOT: '/team-leader',
        STATS: '/team-leader/stats',
        REVIEW: '/team-leader/review',
        EMPLOYEES: '/team-leader/employees',
        EMPLOYEE_DETAIL: '/team-leader/employee/:id',
        PROFILE: '/leader/profile',
    },
    HEAD_DEPT: {
        ROOT: '/head-dept',
        ANALYTICS: '/head-dept/analytics',
        TEMPLATES: '/head-dept/templates',
        TURNOVER: '/head-dept/turnover',
        GAMIFICATION: '/head-dept/gamification',
        PROFILE: '/head-dept/profile',
    },
    ADMIN: {
        ROOT: '/admin',
        USERS: '/admin/users',
        ROADMAP_BUILDER: '/admin/roadmap-builder',
        ROADMAPS: '/admin/roadmaps',
        ACCESS_CONTROL: '/admin/access-control',
        PROFILE: '/admin/profile',
    },
} as const;