// src/shared/hooks/useRoadmapsQuery.ts
import { useQuery } from '@tanstack/react-query';
import { roadmapService } from '@/shared/api/roadmap';
import {
    mapRoadmapTemplateDTO,
    RoadmapTemplate,
    RoadmapTemplateDTO // 🔹 Импортируем DTO
} from '@/shared/types/roadmap';

export function useRoadmapsQuery() {
    return useQuery<RoadmapTemplate[]>({ // 🔹 Возвращаемый тип для UI
        queryKey: ['roadmap-templates'],
        queryFn: async (): Promise<RoadmapTemplate[]> => {
            // 🔹 Явно указываем, что получаем DTO
            const dtoData: RoadmapTemplateDTO[] = await roadmapService.getRoadmapTemplates();
            // 🔹 Маппим в UI-тип
            return dtoData.map(mapRoadmapTemplateDTO);
        },
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
}