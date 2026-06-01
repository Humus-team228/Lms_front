// src/widgets/roadmap-viewer/StageDetailWidget.tsx
import React, { useState } from 'react';
import { Stage } from '@/entities/course/StageCard';
import { StatusIndicator } from '@/entities/course/StatusIndicator';
import { StageCompletionForm } from '@/features/roadmap-progress/StageCompletionForm';
import { FeedbackHistory, Comment } from '@/features/feedback/FeedbackHistory';
import styles from './StageDetailWidget.module.css';

interface StageDetailWidgetProps {
    stage: Stage;
    assignmentId: number;
    comments: Comment[];
    onClose: () => void;
}

export const StageDetailWidget: React.FC<StageDetailWidgetProps> = ({
                                                                        stage,
                                                                        assignmentId,
                                                                        comments,
                                                                        onClose,
                                                                    }) => {
    const [showCompletionForm, setShowCompletionForm] = useState(false);

    const handleSuccess = () => {
        setShowCompletionForm(false);
        onClose();
    };

    // 🔹 Условие: скрываем форму/кнопку, если этап завершён или находится на проверке
    // (REVIEW покрывает и 'REVIEW', и 'IN_REVIEW' благодаря мапперу)
    const isFinishedOrReviewing =
        stage.status === 'COMPLETED' || stage.status === 'REVIEW';

    return (
        <div className={styles.widget}>
            {/* 🔹 Шапка */}
            <div className={styles.header}>
                <h3 className={styles.title}>{stage.title}</h3>
                <button className={styles.closeBtn} onClick={onClose} aria-label="Закрыть">
                    ✕
                </button>
            </div>

            {/* 🔹 Мета-данные */}
            <div className={styles.meta}>
                <StatusIndicator status={stage.status} />
                {stage.deadline && (
                    <span className={styles.deadline}>
            📅 Дедлайн: {new Date(stage.deadline).toLocaleDateString('ru-RU')}
          </span>
                )}
            </div>

            <p className={styles.description}>{stage.description}</p>

            {/* 🔹 Информационные баннеры */}
            {stage.status === 'REVIEW' && (
                <div className={`${styles.statusBanner} ${styles.bannerReview}`}>
                    <span className={styles.bannerIcon}>⏳</span>
                    <div>
                        <div className={styles.bannerTitle}>На проверке</div>
                        <div className={styles.bannerText}>Руководитель изучает вашу работу. Ожидайте обратную связь.</div>
                    </div>
                </div>
            )}

            {stage.status === 'COMPLETED' && (
                <div className={`${styles.statusBanner} ${styles.bannerCompleted}`}>
                    <span className={styles.bannerIcon}>✅</span>
                    <div>
                        <div className={styles.bannerTitle}>Этап завершён</div>
                        <div className={styles.bannerText}>Отличная работа! Этап успешно пройден.</div>
                    </div>
                </div>
            )}

            {stage.status === 'REJECTED' && (
                <div className={`${styles.statusBanner} ${styles.bannerRejected}`}>
                    <span className={styles.bannerIcon}>⚠️</span>
                    <div>
                        <div className={styles.bannerTitle}>Требуется доработка</div>
                        <div className={styles.bannerText}>Изучите комментарии, исправьте замечания и сдайте этап повторно.</div>
                    </div>
                </div>
            )}

            {/* 🔹 Блок отправки (отображается, если НЕ завершён и НЕ на проверке) */}
            {!isFinishedOrReviewing && (
                <div className={styles.actionBlock}>
                    {showCompletionForm ? (
                        <StageCompletionForm
                            assignmentId={assignmentId}
                            stepId={parseInt(stage.id, 10)}
                            stepType={stage.type}
                            onSuccess={handleSuccess}
                        />
                    ) : (
                        <button
                            className={styles.btnSubmit}
                            onClick={() => setShowCompletionForm(true)}
                        >
                            📝 {stage.status === 'REJECTED' ? 'Сдать повторно' : 'Сдать этап'}
                        </button>
                    )}
                </div>
            )}

            {/* 🔹 История обратной связи */}
            <div className={styles.feedbackSection}>
                <h4 className={styles.feedbackTitle}>📋 История обратной связи</h4>
                <FeedbackHistory comments={comments} />
            </div>
        </div>
    );
};