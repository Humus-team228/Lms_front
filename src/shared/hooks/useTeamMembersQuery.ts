// src/shared/hooks/useTeamMembersQuery.ts
import { useQuery } from '@tanstack/react-query';
import { userService } from '@/shared/api/user';
import { mapUserDTO, User } from '@/shared/types/user';
import { useAuth } from '@/app/providers/AuthProvider';

export function useTeamMembersQuery() {
    const { user } = useAuth();
    const managerId = user ? parseInt(user.id, 10) : null;

    return useQuery<User[]>({
        queryKey: ['team-members', managerId],
        queryFn: async () => {
            if (!managerId) throw new Error('Manager ID not found');
            const data = await userService.getTeamMembers(managerId);
            return data.map(mapUserDTO);
        },
        enabled: !!managerId,
        staleTime: 2 * 60 * 1000, // 2 минуты
        refetchOnWindowFocus: true,
    });
}