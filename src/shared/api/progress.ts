import { BackendAssignmentDTO } from '@/shared/types/roadmap';
import { UserDTO } from '@/shared/types/user';
import { API_CONFIG } from '@/config/api';


const getHeaders = () => {
    const token = localStorage.getItem('lms_token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
    };
};

// 🔹 DTO запроса на завершение этапа
export interface CompleteStepRequest {
    stepId: number;
    reportText: string;
    employeeComment: string;
}

export interface ReviewStepRequest {
    approved: boolean;
    score: number;
    commentText: string;
}

export interface AssignRoadmapRequest {
    userId: number;
    roadmapId: number;
}

export interface AssignRoadmapResponse {
    assignmentId: number;
    userId: number;
    userName: string;
    roadmapId: number;
    roadmapTitle: string;
    statusCode: string;
    startDate: string;
    endDate: string | null;
    steps: Array<{
        progressId: number;
        stepId: number;
        stepTitle: string;
        stepTypeCode: string;
        statusCode: string;
        score: number | null;
        completionDate: string | null;
        comments: Array<{
            commentId: number;
            authorId: number;
            authorName: string;
            commentText: string;
            createdAt: string;
        }>;
    }>;
}

// 🔹 DTO ответа
export interface ReviewStepResponse {
    success: boolean;
    message: string;
}

// 🔹 DTO ответа
export interface CompleteStepResponse {
    success: boolean;
    message: string;
    progressId: number;
}

export const progressService = {
    // 🔹 Завершить этап (сдать на проверку)
    async getTeamAssignments(managerId: number): Promise<BackendAssignmentDTO[]> {
        // Получаем всех сотрудников и их назначения
        // В реальности бэкенд должен вернуть только назначения с этапами на проверке
        const res = await fetch(`${API_CONFIG.BASE_URL}/api/progress/users/${managerId}`, {
            method: 'GET',
            headers: getHeaders(),
            signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
        });

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}: Не удалось загрузить данные`);
        }

        return res.json();
    },

    async assignRoadmap(request: AssignRoadmapRequest): Promise<AssignRoadmapResponse> {
        const res = await fetch(
            `${API_CONFIG.BASE_URL}/api/progress/assign?userId=${request.userId}&roadmapId=${request.roadmapId}`,
            {
                method: 'POST',
                headers: getHeaders(),
                signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
            }
        );

        if (!res.ok) {
            let errorMsg = 'Не удалось назначить роадмап';
            try {
                const error = await res.json();
                errorMsg = error.message || errorMsg;
            } catch {}
            throw new Error(errorMsg);
        }

        return res.json();
    },

    async getUserProgress(userId: number): Promise<BackendAssignmentDTO[]> {
        const res = await fetch(
            `${API_CONFIG.BASE_URL}/api/progress/users/${userId}`,
            {
                method: 'GET',
                headers: getHeaders(),
                signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
            }
        );

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}: Не удалось загрузить прогресс`);
        }

        return res.json();
    },

    async reviewStep(
        progressId: number,
        reviewerId: number,
        request: ReviewStepRequest
    ): Promise<{ success: boolean; message: string }> {
        // 🔹 Добавляем reviewerId в параметры запроса
        const url = `${API_CONFIG.BASE_URL}/api/progress/steps/${progressId}/review?reviewerId=${reviewerId}`;

        const res = await fetch(url, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(request),
            signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
        });

        if (!res.ok) {
            let errorMsg = 'Не удалось проверить этап';
            try {
                const error = await res.json();
                errorMsg = error.detail || error.message || errorMsg;
            } catch {}
            throw new Error(errorMsg);
        }

        return res.json();
    },

    async completeStep(
        assignmentId: number,
        request: { stepId: number; reportText: string; employeeComment: string }
    ): Promise<{ success: boolean; message: string; progressId: number }> {
        const res = await fetch(
            `${API_CONFIG.BASE_URL}/api/progress/assignments/${assignmentId}/complete-step`,
            {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(request),
                signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
            }
        );

        if (!res.ok) {
            let errorMsg = 'Не удалось сдать этап';
            try {
                const error = await res.json();
                errorMsg = error.message || errorMsg;
            } catch {}
            throw new Error(errorMsg);
        }

        return res.json();
    },
};