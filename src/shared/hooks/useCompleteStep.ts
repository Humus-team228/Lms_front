// src/shared/hooks/useCompleteStep.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { progressService, CompleteStepRequest } from '@/shared/api/progress';

export function useCompleteStep() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
                         assignmentId,
                         request,
                     }: {
            assignmentId: number;
            request: CompleteStepRequest;
        }) => progressService.completeStep(assignmentId, request),
        onSuccess: () => {
            // Инвалидируем кэш роадмапа для обновления статуса
            queryClient.invalidateQueries({ queryKey: ['roadmap'] });
        },
    });
}