// src/shared/types/roadmap.ts
import { Stage } from '@/entities/course/StageCard';
import { Comment } from '@/features/feedback/FeedbackHistory';

// ============================================================================
// 🟦 СЕКЦИЯ 1: Личный роадмап сотрудника (для оператора)
// ============================================================================

// DTO ответа от GET /api/progress/users/{userId}
export interface BackendAssignmentDTO {
    assignmentId: number;
    userId: number;
    userName: string;
    roadmapId: number;
    roadmapTitle: string;
    startDate: string;
    endDate: string | null;
    statusCode: string;
    steps: BackendStepDTO[];
}

export interface BackendStepDTO {
    progressId: number;
    stepId: number;
    stepTitle: string;
    stepTypeCode: string;
    statusCode: string;
    score: number | null;
    completionDate: string | null;
    reportText?: string;         // 🔹 Добавлено: основной отчет сотрудника
    employeeComment?: string;    // 🔹 Добавлено: доп. комментарий
    comments: BackendCommentDTO[];
}

export interface BackendCommentDTO {
    commentId: number;
    authorId: number;
    authorName: string;
    commentText: string;
    createdAt: string;
}

// UI-тип для отображения личного роадмапа
export interface RoadmapData {
    id: string;
    assignmentId: number;
    title: string;
    overall_progress: number;
    stages: Stage[];
}

// ============================================================================
// 🟩 СЕКЦИЯ 2: Шаблоны роадмапов (для админа)
// ============================================================================

// DTO ответа от GET /api/roadmaps
export interface RoadmapTemplateDTO {
    id: number;
    title: string;
    description: string;
    activeFlag: boolean;
    steps: RoadmapTemplateStepDTO[]; // 🔹 Обязательно для подсчёта stepsCount
}

export interface RoadmapTemplateStepDTO {
    structureId: number;
    stepId: number;
    stepTitle: string;
    stepTypeCode: string;
    stepOrder: number;
    isRequiredFlag: boolean;
}

// UI-тип для отображения в таблице админа
export interface RoadmapTemplate {
    id: number;
    title: string;
    description: string;
    isActive: boolean;
    stepsCount: number;
    createdAt?: string; // опционально, если бэкенд добавит
}

// ============================================================================
// 🟨 СЕКЦИЯ 3: Создание/обновление роадмапа
// ============================================================================

export interface CreateRoadmapRequest {
    title: string;
    description: string;
    steps: RoadmapStepRequest[];
}

export interface RoadmapStepRequest {
    title: string;
    description: string;
    stepTypeCode: 'COURSE' | 'TASK' | 'EXAM';
    isRequired: boolean;
    order: number;
}

export interface CreateRoadmapResponse {
    id: number;
    title: string;
    description: string;
    activeFlag: boolean;
    createdAt: string;
    steps?: RoadmapStepResponse[];
}

export interface RoadmapStepResponse {
    id: number;
    title: string;
    description: string;
    stepTypeCode: string;
    stepOrder: number;
    isRequiredFlag: boolean;
}

// ============================================================================
// 🔧 МАППЕРЫ
// ============================================================================

// Маппинг: BackendAssignmentDTO[] → RoadmapData (для личного кабинета)

// 🔹 Замените старую mapBackendToRoadmap на эту:
export function mapBackendToRoadmaps(data: BackendAssignmentDTO[]): RoadmapData[] {
    if (!data || data.length === 0) return [];

    return data.map(assignment => {
        const total = assignment.steps.length;
        const completed = assignment.steps.filter(s => s.statusCode === 'DONE').length;
        const overall_progress = total > 0 ? Math.round((completed / total) * 100) : 0;

        return {
            id: String(assignment.assignmentId),
            assignmentId: assignment.assignmentId,
            title: assignment.roadmapTitle,
            overall_progress,
            stages: assignment.steps.map(mapStepToStage),
        };
    });
}

function mapStepToStage(step: BackendStepDTO): Stage {
    return {
        id: String(step.stepId),
        title: step.stepTitle,
        description: '', // Бэкенд пока не отдаёт description для шагов
        type: step.stepTypeCode.toLowerCase() as 'course' | 'task' | 'exam',
        status: mapStatusCode(step.statusCode),
        deadline: step.completionDate || undefined,
        score: step.score,
        comments: step.comments.map(mapComment),
    };
}

function mapStatusCode(code: string): Stage['status'] {
    const map: Record<string, Stage['status']> = {
        'NOT_STARTED': 'NOT_STARTED',
        'IN_PROGRESS': 'IN_PROGRESS',
        'DONE': 'COMPLETED',
        'REVIEW': 'REVIEW',
        'IN_REVIEW': 'REVIEW',  // 🔹 Добавлено: маппим "IN_REVIEW" → "REVIEW"
        'REJECTED': 'REJECTED',
        'REWORK': 'REJECTED',
    };
    return map[code] || 'NOT_STARTED';
}

function mapComment(c: BackendCommentDTO): Comment {
    return {
        id: String(c.commentId),
        author: c.authorName,
        text: c.commentText,
        date: c.createdAt,
        role: 'team_leader',
    };
}

// Маппинг: RoadmapTemplateDTO → RoadmapTemplate (для админ-панели)
export function mapRoadmapTemplateDTO(dto: RoadmapTemplateDTO): RoadmapTemplate {
    return {
        id: dto.id,
        title: dto.title || 'Без названия',
        description: dto.description || '',
        isActive: dto.activeFlag ?? true,
        stepsCount: dto.steps?.length || 0,
        createdAt: undefined, // если бэкенд добавит поле — раскомментировать
    };
}