import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { progressService, ReviewStepRequest } from '@/shared/api/progress';
import { userService } from '@/shared/api/user';
import { BackendAssignmentDTO } from '@/shared/types/roadmap';
import { UserDTO } from '@/shared/types/user';
import { useAuth } from '@/app/providers/AuthProvider';

export interface ReviewQueueItem {
    progressId: number;
    stepId: number;
    stepTitle: string;
    stepTypeCode: string;
    userName: string;
    userId: number;
    roadmapTitle: string;
    assignmentId: number;
    submittedAt: string;
    reportText?: string;
    employeeComment?: string;
}

export function useReviewQueueQuery() {
    const { user } = useAuth(); // Получаем текущего пользователя
    const managerId = user ? parseInt(user.id, 10) : null;
    const queryClient = useQueryClient();

    // 🔹 Шаг 1: Получаем список сотрудников менеджера
    const { data: teamMembers, isLoading: membersLoading } = useQuery<UserDTO[]>({
        queryKey: ['team-members', managerId],
        queryFn: async () => {
            if (!managerId) throw new Error('Manager ID not found');
            return userService.getTeamMembers(managerId);
        },
        enabled: !!managerId,
        staleTime: 2 * 60 * 1000,
    });

    // 🔹 Шаг 2: Для каждого сотрудника получаем его прогресс
    const { data: allProgress, isLoading: progressLoading } = useQuery<
        Map<number, BackendAssignmentDTO[]>
    >({
        queryKey: ['team-progress', teamMembers],
        queryFn: async () => {
            if (!teamMembers || teamMembers.length === 0) return new Map();

            const progressMap = new Map<number, BackendAssignmentDTO[]>();

            await Promise.all(
                teamMembers.map(async (member) => {
                    try {
                        const progress = await progressService.getUserProgress(member.id);
                        progressMap.set(member.id, progress);
                    } catch (error) {
                        console.error(`Failed to load progress for user ${member.id}:`, error);
                    }
                })
            );

            return progressMap;
        },
        enabled: !!teamMembers,
        staleTime: 1 * 60 * 1000,
    });

    // 🔹 Шаг 3: Фильтруем этапы со статусом REVIEW/IN_REVIEW
    const reviewItems: ReviewQueueItem[] = [];

    if (teamMembers && allProgress) {
        teamMembers.forEach((member) => {
            const assignments = allProgress.get(member.id) || [];

            assignments.forEach((assignment) => {
                assignment.steps.forEach((step) => {
                    if (step.statusCode === 'REVIEW' || step.statusCode === 'IN_REVIEW') {
                        reviewItems.push({
                            progressId: step.progressId,
                            stepId: step.stepId,
                            stepTitle: step.stepTitle,
                            stepTypeCode: step.stepTypeCode,
                            userName: member.fullName,
                            userId: member.id,
                            roadmapTitle: assignment.roadmapTitle,
                            assignmentId: assignment.assignmentId,
                            submittedAt: step.completionDate || assignment.startDate,
                            reportText: step.reportText,
                            employeeComment: step.employeeComment
                        });
                    }
                });
            });
        });
    }

    // 🔹 Мутация для проверки этапа (ОБНОВЛЕНО)
    const reviewStepMutation = useMutation({
        mutationFn: ({
                         progressId,
                         request,
                     }: {
            progressId: number;
            request: ReviewStepRequest;
        }) => {
            if (!user) throw new Error('Пользователь не авторизован');
            // 🔹 Передаем ID текущего пользователя как reviewerId
            return progressService.reviewStep(progressId, parseInt(user.id), request);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['team-progress'] });
            queryClient.invalidateQueries({ queryKey: ['group-stats'] });
        },
    });

    return {
        reviewItems,
        isLoading: membersLoading || progressLoading,
        reviewStep: reviewStepMutation.mutateAsync,
        isReviewing: reviewStepMutation.isPending,
    };
}