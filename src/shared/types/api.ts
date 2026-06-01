// src/shared/types/api.ts

// --- Справочники (App Dictionary) ---
export interface DictionaryItem {
    id: number;
    parent_id?: number | null;
    category_code: string; // 'ROLE', 'USER_STATUS', 'STEP_STATUS', etc.
    key_code: string;      // 'ADMIN', 'ACTIVE', 'DONE', etc.
    value_name: string;    // 'Administrator', 'Active', 'Done', etc.
    sort_order: number;
    active_flag: boolean;
}

// --- Пользователи ---
export interface User {
    id: number;
    full_name: string;
    role_id: number;       // Ссылка на app_dictionary (ROLE)
    manager_id?: number | null;
    status_id: number;     // Ссылка на app_dictionary (USER_STATUS)
    hire_date: string;     // ISO Date string
    active_flag: boolean;

    // Дополнительные поля для удобства фронтенда (могут приходить с бэкенда через JOIN)
    role?: DictionaryItem;
    status?: DictionaryItem;
    manager?: User;
}

// --- Роадмапы и Шаги ---
export interface Roadmap {
    id: number;
    title: string;
    description: string;
    active_flag: boolean;
}

export interface RoadmapStep {
    id: number;
    title: string;
    description: string;
    step_type_id: number;  // Ссылка на app_dictionary (STEP_TYPE)
    active_flag: boolean;

    step_type?: DictionaryItem;
}

// --- Структура роадмапа (связь многие-ко-многим с порядком) ---
export interface RoadmapStructureItem {
    id: number;
    roadmap_id: number;
    step_id: number;
    step_order: number;
    is_required_flag: boolean;
    active_flag: boolean;

    step?: RoadmapStep; // Вложенный объект шага для удобства отображения
}

// --- Назначение роадмапа пользователю ---
export interface UserAssignment {
    id: number;
    user_id: number;
    roadmap_id: number;
    status_id: number;   // Ссылка на app_dictionary (ASSIGN_STATUS)
    start_date: string;
    end_date?: string | null;

    status?: DictionaryItem;
    roadmap?: Roadmap;
}

// --- Прогресс по конкретному шагу ---
export interface UserStepProgress {
    id: number;
    assignment_id: number;
    step_id: number;
    status_id: number;   // Ссылка на app_dictionary (STEP_STATUS)
    score?: number | null;
    completion_date?: string | null;
    active_flag: boolean;

    status?: DictionaryItem;
    step?: RoadmapStep;
    comments?: StepComment[]; // Список комментариев к этому шагу
}

// --- Комментарии ---
export interface StepComment {
    id: number;
    step_progress_id: number;
    author_id: number;
    comment_text: string;
    created_at: string;

    author?: User; // Автор комментария
}

// --- KPI ---
export interface KpiMetric {
    id: number;
    user_id: number;
    metric_code: string; // 'SALES', 'AHT', etc.
    value: number;
    period_date: string;
}