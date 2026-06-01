import React, { useState } from 'react';
import { RoadmapTimeline } from '@/entities/roadmap/RoadmapTimeline';
import { FeedbackHistory, Comment } from '@/features/feedback/FeedbackHistory';
import { SubmitForReviewButton } from '@/features/roadmap-progress/SubmitForReviewButton';
import { Stage } from '@/entities/course/StageCard';
import styles from './FullRoadmapView.module.css';

const MOCK_STAGES: Stage[] = [
    { id: '1', title: 'Введение в продукты банка', description: 'Изучение базовых кредитных и депозитных продуктов.', type: 'course', status: 'COMPLETED', deadline: '2026-05-10' },
    { id: '2', title: 'Работа в CRM', description: 'Практическое задание: создать 5 тестовых заявок.', type: 'task', status: 'REVIEW', deadline: '2026-05-15' },
    { id: '3', title: 'Скрипты продаж', description: 'Онлайн-тест по работе с возражениями.', type: 'exam', status: 'IN_PROGRESS', deadline: '2026-05-20' },
    { id: '4', title: 'Стажировка с наставником', description: 'Прослушивание звонков и разбор ошибок.', type: 'task', status: 'NOT_STARTED', deadline: '2026-05-25' },
];

const MOCK_COMMENTS: Record<string, Comment[]> = {
    '1': [{ id: 'c1', author: 'Петр Петров', text: 'Отличное понимание базовых продуктов. Переходим к CRM.', date: '2026-05-11', role: 'team_leader' }],
    '2': [{ id: 'c2', author: 'Петр Петров', text: 'Заявки созданы верно, но обратите внимание на поле "Источник".', date: '2026-05-16', role: 'team_leader' }],
};

export const FullRoadmapView: React.FC = () => {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const selectedStage = MOCK_STAGES.find(s => s.id === selectedId);

    const handleSubmit = () => alert('Этап отправлен на проверку!');

    return (
        <div className={styles.container}>
            <div className={styles.timelineWrapper}>
                <h2 className={styles.sectionTitle}>Моя дорожная карта</h2>
                <RoadmapTimeline stages={MOCK_STAGES} onSelectStage={setSelectedId} />
            </div>

            {selectedStage && (
                <div className={styles.detailPanel}>
                    <h3 className={styles.detailTitle}>Детали этапа: {selectedStage.title}</h3>
                    <p className={styles.detailDesc}>{selectedStage.description}</p>

                    {selectedStage.status === 'IN_PROGRESS' && (
                        <SubmitForReviewButton onClick={handleSubmit} />
                    )}
                    {selectedStage.status === 'REVIEW' && (
                        <SubmitForReviewButton onClick={() => {}} disabled />
                    )}

                    <FeedbackHistory comments={MOCK_COMMENTS[selectedStage.id] || []} />
                </div>
            )}
        </div>
    );
};