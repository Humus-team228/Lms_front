// src/shared/hooks/useAssignRoadmap.ts
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { progressService, AssignRoadmapRequest } from '@/shared/api/progress';
import { roadmapService, RoadmapTemplateDTO } from '@/shared/api/roadmap';

// 🔹 Хук для получения списка доступных роадмапов
export function useRoadmapTemplates() {
    return useQuery<RoadmapTemplateDTO[]>({
        queryKey: ['roadmap-templates'],
        queryFn: async () => {
            return roadmapService.getRoadmapTemplates();
        },
        staleTime: 10 * 60 * 1000, // 10 минут
    });
}

// 🔹 Хук для назначения роадмапа
export function useAssignRoadmap() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: AssignRoadmapRequest) =>
            progressService.assignRoadmap(request),
        onSuccess: () => {
            // Инвалидируем кэши для обновления данных
            queryClient.invalidateQueries({ queryKey: ['team-members'] });
            queryClient.invalidateQueries({ queryKey: ['team-progress'] });
            queryClient.invalidateQueries({ queryKey: ['group-stats'] });
        },
    });
}