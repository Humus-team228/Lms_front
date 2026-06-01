// src/shared/hooks/useRoadmapQuery.ts
import { useQuery } from '@tanstack/react-query';
import { roadmapService } from '@/shared/api/roadmap';
import { mapBackendToRoadmaps, RoadmapData } from '@/shared/types/roadmap';
import { useAuth } from '@/app/providers/AuthProvider';

export function useRoadmapQuery() {
    const { user } = useAuth();
    const userId = user ? parseInt(user.id, 10) : null;

    return useQuery<RoadmapData[]>({
        queryKey: ['roadmap', 'personal', userId],
        queryFn: () => roadmapService.getPersonalRoadmap(userId!).then(mapBackendToRoadmaps),
        enabled: !!userId,
        staleTime: 2 * 60 * 1000,
        refetchOnWindowFocus: true,
    });
}