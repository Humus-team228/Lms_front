// src/shared/api/roadmap.ts
import {
    RoadmapTemplateDTO,
    BackendAssignmentDTO,
    CreateRoadmapRequest,
    CreateRoadmapResponse,
    RoadmapTemplate,
} from '@/shared/types/roadmap';
import { API_CONFIG } from '@/config/api';

const getHeaders = () => {
    const token = localStorage.getItem('lms_token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
    };
};

export interface AddStepRequest {
    stepId: number;
    stepOrder: number;
    isRequired: boolean;
}

export interface CreateStepRequest {
    title: string;
    description: string;
    stepTypeId: number;   // ID типа шага из APP_DICTIONARY (например: 1=COURSE, 2=TASK, 3=EXAM)
    maxScore: number;     // Максимальный балл за этап
}

export interface CreateStepResponse {
    id: number;
    title: string;
    description: string;
    stepTypeId: number;
    maxScore: number;
}

export interface AssignStepRequest {
    stepId: number;
    stepOrder: number;
    isRequired: boolean;
}
export const roadmapService = {
    async getMyRoadmap(userId: number): Promise<BackendAssignmentDTO[]> {
        const res = await fetch(`${API_CONFIG.BASE_URL}/api/progress/users/${userId}`, {
          method: 'GET',
          headers: getHeaders(),
          signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
        });

        if (!res.ok) {
          let errorMsg = `HTTP ${res.status}: Не удалось загрузить роадмап`;
          try {
            const errorData = await res.json();
            errorMsg = errorData.message || errorMsg;
          } catch {
            // Игнорируем, если тело не JSON
          }
          throw new Error(errorMsg);
        }

        return res.json();


        // 🟡 ИМИТАЦИЯ (удалить при подключении БД)
        // Структура ТОЧНО соответствует Swagger API
    },
    async getRoadmapTemplates(): Promise<RoadmapTemplateDTO[]> {
        const res = await fetch(`${API_CONFIG.BASE_URL}/api/roadmaps`, {
            method: 'GET',
            headers: getHeaders(),
            signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}: Не удалось загрузить шаблоны`);
        return res.json(); // 🔹 JSON парсится как RoadmapTemplateDTO[]
    },

    async createRoadmap(request: CreateRoadmapRequest): Promise<CreateRoadmapResponse> {
        const res = await fetch(`${API_CONFIG.BASE_URL}/api/roadmaps`, {
            method: 'POST',
            headers: {
                ...getHeaders(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
            signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
        });

        if (!res.ok) {
            let errorMsg = 'Не удалось создать роадмап';
            try {
                const error = await res.json();
                errorMsg = error.message || errorMsg;
            } catch {}
            throw new Error(errorMsg);
        }

        return res.json();
    },

    async createStep(request: CreateStepRequest): Promise<CreateStepResponse> {
        const res = await fetch(`${API_CONFIG.BASE_URL}/api/roadmaps/steps`, {
            method: 'POST',
            headers: {
                ...getHeaders(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
            signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
        });

        if (!res.ok) {
            let errorMsg = 'Не удалось создать шаг';
            try {
                const error = await res.json();
                errorMsg = error.message || errorMsg;
            } catch {}
            throw new Error(errorMsg);
        }

        return res.json();
    },

    async assignStepToRoadmap(roadmapId: number, request: AssignStepRequest): Promise<void> {
        const res = await fetch(`${API_CONFIG.BASE_URL}/api/roadmaps/${roadmapId}/steps`, {
            method: 'POST',
            headers: {
                ...getHeaders(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
            signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
        });

        if (!res.ok) {
            let errorMsg = 'Не удалось привязать шаг к роадмапу';
            try {
                const error = await res.json();
                errorMsg = error.message || errorMsg;
            } catch {}
            throw new Error(errorMsg);
        }
    },

    async removeStepFromRoadmap(roadmapId: number, structureId: number): Promise<void> {
        const res = await fetch(`${API_CONFIG.BASE_URL}/api/roadmaps/${roadmapId}/steps/${structureId}`, {
            method: 'DELETE',
            headers: getHeaders(),
            signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
        });

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}: Не удалось удалить этап`);
        }
    },

    async updateRoadmap(roadmapId: number, request: CreateRoadmapRequest): Promise<CreateRoadmapResponse> {
        const res = await fetch(`${API_CONFIG.BASE_URL}/api/roadmaps/${roadmapId}`, {
            method: 'PUT',
            headers: {
                ...getHeaders(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
            signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
        });

        if (!res.ok) {
            let errorMsg = 'Не удалось обновить роадмап';
            try {
                const error = await res.json();
                errorMsg = error.message || errorMsg;
            } catch {}
            throw new Error(errorMsg);
        }

        return res.json();
    },

    async addStepToRoadmap(roadmapId: number, request: AddStepRequest): Promise<void> {
        const res = await fetch(`${API_CONFIG.BASE_URL}/api/roadmaps/${roadmapId}/steps`, {
            method: 'POST',
            headers: {
                ...getHeaders(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
            signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
        });

        if (!res.ok) {
            let errorMsg = 'Не удалось добавить этап';
            try {
                const error = await res.json();
                errorMsg = error.message || errorMsg;
            } catch {}
            throw new Error(errorMsg);
        }
    },

    async getPersonalRoadmap(userId: number): Promise<BackendAssignmentDTO[]> {
        const res = await fetch(`${API_CONFIG.BASE_URL}/api/progress/users/${userId}`, {
            method: 'GET',
            headers: getHeaders(),
            signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
        });

        if (!res.ok) {
            let errorMsg = `HTTP ${res.status}: Не удалось загрузить роадмап`;
            try {
                const error = await res.json();
                errorMsg = error.message || errorMsg;
            } catch {}
            throw new Error(errorMsg);
        }

        return res.json();
    },
    // 🔹 Удалить роадмап
    async deleteRoadmap(id: number): Promise<void> {
        const res = await fetch(`${API_CONFIG.BASE_URL}/api/roadmaps/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
            signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}: Не удалось удалить роадмап`);
    },

    // 🔹 Активировать/деактивировать роадмап
    async toggleRoadmapStatus(id: number, isActive: boolean): Promise<void> {
        const res = await fetch(`${API_CONFIG.BASE_URL}/api/roadmaps/${id}/status`, {
            method: 'PATCH',
            headers: {
                ...getHeaders(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ activeFlag: isActive }),
            signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
        });

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}: Не удалось изменить статус`);
        }
    },
    // 🔹 Деактивировать роадмап
    async deactivateRoadmap(roadmapId: number): Promise<void> {
        const res = await fetch(`${API_CONFIG.BASE_URL}/api/roadmaps/${roadmapId}/deactivate`, {
            method: 'PATCH',
            headers: getHeaders(),
            signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}: Не удалось деактивировать роадмап`);
    },

    // 🔹 Активировать роадмап
    async activateRoadmap(roadmapId: number): Promise<void> {
        const res = await fetch(`${API_CONFIG.BASE_URL}/api/roadmaps/${roadmapId}/activate`, {
            method: 'PATCH',
            headers: getHeaders(),
            signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}: Не удалось активировать роадмап`);
    },
};