import { useQuery } from '@tanstack/react-query';
import { reportingService, DeptKPIDTO, DeptKPI } from '@/shared/api/reporting';
import { mapUserDTO, User } from '@/shared/types/user';
import { useAuth } from '@/app/providers/AuthProvider';

export function useDeptKPIQuery() {
    const { user } = useAuth();
    const headId = user ? parseInt(user.id, 10) : null;

    return useQuery<DeptKPI>({
        queryKey: ['dept-kpi', headId],
        queryFn: async () => {
            if (!headId) throw new Error('Head ID not found');

            const data: DeptKPIDTO = await reportingService.getDepartmentKPI(headId);

            // Маппим redZoneUsers в UI формат
            return {
                ...data,
                groupBreakdown: data.groupBreakdown.map(group => ({
                    ...group,
                    redZoneUsers: group.redZoneUsers.map(mapUserDTO),
                })),
            };
        },
        enabled: !!headId,
        staleTime: 5 * 60 * 1000, // 5 минут
        refetchOnWindowFocus: true,
    });
}