// src/shared/hooks/useGroupStatsQuery.ts
import { useQuery } from '@tanstack/react-query';
import { reportingService, GroupStatsDTO } from '@/shared/api/reporting';
import { mapUserDTO, User } from '@/shared/types/user';
import { useAuth } from '@/app/providers/AuthProvider';

export interface GroupStats {
    managerId: number;
    managerName: string;
    totalEmployees: number;
    completedAssignments: number;
    totalAssignments: number;
    completionPercent: number;
    avgScore: number;
    redZoneUsers: User[];
}

export function useGroupStatsQuery() {
    const { user } = useAuth();
    const managerId = user ? parseInt(user.id, 10) : null;

    return useQuery<GroupStats>({
        queryKey: ['group-stats', managerId],
        queryFn: async () => {
            if (!managerId) throw new Error('Manager ID not found');

            const data: GroupStatsDTO = await reportingService.getGroupStats(managerId);

            return {
                ...data,
                redZoneUsers: data.redZoneUsers.map(mapUserDTO),
            };
        },
        enabled: !!managerId,
        staleTime: 2 * 60 * 1000, // 2 минуты
        refetchOnWindowFocus: true,
    });
}