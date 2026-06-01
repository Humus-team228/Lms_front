import React from 'react';
import { UserStepProgress, RoadmapStructureItem } from '@/shared/types/api';
import styles from './RoadmapViewer.module.css';

// Моковые данные для демонстрации
const MOCK_DICTIONARY = {
    30: { id: 30, category_code: 'STEP_STATUS', key_code: 'NOT_STARTED', value_name: 'Не начат', sort_order: 1, active_flag: true },
    31: { id: 31, category_code: 'STEP_STATUS', key_code: 'IN_PROGRESS', value_name: 'В процессе', sort_order: 2, active_flag: true },
    32: { id: 32, category_code: 'STEP_STATUS', key_code: 'DONE', value_name: 'Выполнен', sort_order: 3, active_flag: true },
    40: { id: 40, category_code: 'STEP_TYPE', key_code: 'COURSE', value_name: 'Курс', sort_order: 1, active_flag: true },
    41: { id: 41, category_code: 'STEP_TYPE', key_code: 'TASK', value_name: 'Задача', sort_order: 2, active_flag: true },
};

export const MOCK_STEPS: RoadmapStructureItem[] = [
    {
        id: 1,
        roadmap_id: 1,
        step_id: 1,
        step_order: 1,
        is_required_flag: true,
        active_flag: true,
        step: {
            id: 1,
            title: 'Введение в компанию',
            description: 'Ознакомление с миссией и ценностями банка. Изучение организационной структуры и ключевых продуктов.',
            step_type_id: 40,
            active_flag: true,
            step_type: MOCK_DICTIONARY[40]
        }
    },
    {
        id: 2,
        roadmap_id: 1,
        step_id: 2,
        step_order: 2,
        is_required_flag: true,
        active_flag: true,
        step: {
            id: 2,
            title: 'Настройка рабочего места',
            description: 'Установка ПО, получение доступов к CRM и телефонии. Настройка VPN и корпоративной почты.',
            step_type_id: 41,
            active_flag: true,
            step_type: MOCK_DICTIONARY[41]
        }
    },
    {
        id: 3,
        roadmap_id: 1,
        step_id: 3,
        step_order: 3,
        is_required_flag: true,
        active_flag: true,
        step: {
            id: 3,
            title: 'Продуктовый тренинг',
            description: 'Изучение кредитных продуктов, депозитов и карт. Скрипты продаж и работа с возражениями.',
            step_type_id: 40,
            active_flag: true,
            step_type: MOCK_DICTIONARY[40]
        }
    },
    {
        id: 4,
        roadmap_id: 1,
        step_id: 4,
        step_order: 4,
        is_required_flag: true,
        active_flag: true,
        step: {
            id: 4,
            title: 'Стажировка с наставником',
            description: 'Практическая работа под руководством опытного сотрудника. Прослушивание звонков и обратная связь.',
            step_type_id: 41,
            active_flag: true,
            step_type: MOCK_DICTIONARY[41]
        }
    },
    {
        id: 5,
        roadmap_id: 1,
        step_id: 5,
        step_order: 5,
        is_required_flag: true,
        active_flag: true,
        step: {
            id: 5,
            title: 'Финальный экзамен',
            description: 'Комплексное тестирование по всем продуктам и стандартам обслуживания. Минимальный проходной балл — 80%.',
            step_type_id: 40,
            active_flag: true,
            step_type: MOCK_DICTIONARY[40]
        }
    }
];

export const MOCK_PROGRESS: Record<number, UserStepProgress> = {
    1: {
        id: 101,
        assignment_id: 1,
        step_id: 1,
        status_id: 32,
        score: 100,
        completion_date: '2026-05-01T10:00:00Z',
        active_flag: true,
        status: MOCK_DICTIONARY[32],
        step: MOCK_STEPS[0].step,
        comments: []
    },
    2: {
        id: 102,
        assignment_id: 1,
        step_id: 2,
        status_id: 32,
        score: null,
        completion_date: '2026-05-03T14:30:00Z',
        active_flag: true,
        status: MOCK_DICTIONARY[32],
        step: MOCK_STEPS[1].step,
        comments: []
    },
    3: {
        id: 103,
        assignment_id: 1,
        step_id: 3,
        status_id: 31,
        score: null,
        completion_date: null,
        active_flag: true,
        status: MOCK_DICTIONARY[31],
        step: MOCK_STEPS[2].step,
        comments: []
    },
    4: {
        id: 104,
        assignment_id: 1,
        step_id: 4,
        status_id: 30,
        score: null,
        completion_date: null,
        active_flag: true,
        status: MOCK_DICTIONARY[30],
        step: MOCK_STEPS[3].step,
        comments: []
    },
    5: {
        id: 105,
        assignment_id: 1,
        step_id: 5,
        status_id: 30,
        score: null,
        completion_date: null,
        active_flag: true,
        status: MOCK_DICTIONARY[30],
        step: MOCK_STEPS[4].step,
        comments: []
    }
};

interface RoadmapViewerProps {
    steps: RoadmapStructureItem[];
    progress: Record<number, UserStepProgress>;
}

export const RoadmapViewer: React.FC<RoadmapViewerProps> = ({ steps, progress }) => {
    const sortedSteps = [...steps].sort((a, b) => a.step_order - b.step_order);

    const getStatusClass = (statusId: number) => {
        if (statusId === 32) return 'completed';
        if (statusId === 31) return 'inProgress';
        return 'notStarted';
    };

    const getStatusIndicatorClass = (statusId: number) => {
        if (statusId === 32) return `${styles.statusIndicator} ${styles.completed}`;
        if (statusId === 31) return `${styles.statusIndicator} ${styles.inProgress}`;
        return `${styles.statusIndicator} ${styles.notStarted}`;
    };

    return (
        <div className={styles.container}>
            {sortedSteps.map((structureItem) => {
                const step = structureItem.step;
                const progressItem = progress[step?.id || 0];

                if (!step) return null;

                const statusClass = getStatusClass(progressItem?.status_id || 30);
                const cardClass = `${styles.stepCard} ${styles[statusClass]}`;

                return (
                    <div key={structureItem.id} className={cardClass}>
                        <div className={styles.stepHeader}>
                            <div style={{ flex: 1 }}>
                                <h3 className={styles.stepTitle}>
                                    {structureItem.step_order}. {step.title}
                                </h3>
                                <p className={styles.stepDescription}>{step.description}</p>
                            </div>

                            <div className={styles.stepStatus}>
                                <div className={getStatusIndicatorClass(progressItem?.status_id || 30)} />
                                <span>{progressItem?.status?.value_name || 'Нет данных'}</span>
                            </div>
                        </div>

                        <div className={styles.stepMeta}>
              <span className={styles.stepType}>
                {step.step_type?.value_name || 'Шаг'}
              </span>
                            {progressItem?.score !== null && progressItem?.score !== undefined && (
                                <span className={styles.stepType}>
                  Баллы: {progressItem.score}
                </span>
                            )}
                            {progressItem?.completion_date && (
                                <span className={styles.stepType}>
                  Завершен: {new Date(progressItem.completion_date).toLocaleDateString('ru-RU')}
                </span>
                            )}
                        </div>

                        <div className={styles.stepActions}>
                            {progressItem?.status_id === 30 && (
                                <button className={`${styles.actionButton} ${styles.primary}`}>
                                    Начать выполнение
                                </button>
                            )}
                            {progressItem?.status_id === 31 && (
                                <button className={`${styles.actionButton} ${styles.primary}`}>
                                    Отправить на проверку
                                </button>
                            )}
                            {progressItem?.status_id === 32 && (
                                <div className={styles.completedBadge}>
                                    <span>✓</span>
                                    <span>Этап выполнен</span>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export { MOCK_DICTIONARY };