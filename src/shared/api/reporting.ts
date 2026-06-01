import { UserDTO } from '@/shared/types/user';
import { API_CONFIG } from '@/config/api';

const getHeaders = () => {
    const token = localStorage.getItem('lms_token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
    };
};

// 🔹 DTO ответа статистики группы
export interface GroupStatsDTO {
    managerId: number;
    managerName: string;
    totalEmployees: number;
    completedAssignments: number;
    totalAssignments: number;
    completionPercent: number;
    avgScore: number;
    redZoneUsers: UserDTO[];
}

export interface DeptKPIDTO {
    avgOnboardingDays: number;
    firstAttemptPassRate: number;
    totalFired: number;
    groupBreakdown: GroupStatsDTO[];
}

export interface DeptKPI {
    avgOnboardingDays: number;
    firstAttemptPassRate: number;
    totalFired: number;
    groupBreakdown: Array<{
        managerId: number;
        managerName: string;
        totalEmployees: number;
        completedAssignments: number;
        totalAssignments: number;
        completionPercent: number;
        avgScore: number;
        redZoneUsers: import('@/shared/types/user').User[];
    }>;
    }

export const reportingService = {
    async getGroupStats(managerId: number): Promise<GroupStatsDTO> {
        const res = await fetch(`${API_CONFIG.BASE_URL}/api/reporting/group/${managerId}`, {
            method: 'GET',
            headers: getHeaders(),
            signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
        });

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}: Не удалось загрузить статистику группы`);
        }

        return res.json();
    },

    // 🔹 Получить агрегированные KPI для руководителя направления
    async getDepartmentKPI(headId: number): Promise<DeptKPIDTO> {
        const res = await fetch(`${API_CONFIG.BASE_URL}/api/reporting/department/${headId}`, {
            method: 'GET',
            headers: getHeaders(),
            signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
        });

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}: Не удалось загрузить KPI направления`);
        }

        return res.json();
    },
};