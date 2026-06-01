import React, { useState } from 'react';
import { Layout } from '@/widgets/layout/Layout';
import { useReviewQueueQuery } from '@/shared/hooks/useReviewQueueQuery';
import { UserAvatar } from '@/entities/user/UserAvatar';
import styles from './ReviewQueuePage.module.css';

export default function ReviewQueuePage() {
    const [selectedItem, setSelectedItem] = useState<number | null>(null);
    const [commentText, setCommentText] = useState('');
    const [score, setScore] = useState(80);

    const { reviewItems, isLoading, isError, reviewStep, isReviewing } = useReviewQueueQuery();

    const handleReview = async (progressId: number, approved: boolean) => {
        if (!approved && !commentText.trim()) {
            alert('Пожалуйста, укажите причину отклонения');
            return;
        }

        try {
            await reviewStep({
                progressId,
                request: {
                    approved,
                    score: approved ? score : 0,
                    commentText: commentText.trim(),
                },
            });

            // Очистка формы
            setSelectedItem(null);
            setCommentText('');
            setScore(80);
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Ошибка при проверке');
        }
    };

    if (isLoading) {
        return (
            <Layout>
                <div className={styles.loader}>
                    <div className={styles.spinner} />
                    Загрузка очереди проверок...
                </div>
            </Layout>
        );
    }

    if (isError) {
        return (
            <Layout>
                <div className={styles.error}>
                    ⚠️ Не удалось загрузить очередь проверок. Попробуйте обновить страницу.
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>Ожидают проверки</h1>
                        <p className={styles.subtitle}>
                            Этапы, отправленные сотрудниками на проверку
                        </p>
                    </div>
                    <div className={styles.stats}>
            <span className={styles.statBadge}>
              Всего: {reviewItems.length}
            </span>
                    </div>
                </div>

                {reviewItems.length === 0 ? (
                    <div className={styles.empty}>
                        <div className={styles.emptyIcon}>✅</div>
                        <h3>Все этапы проверены</h3>
                        <p>На данный момент нет этапов, ожидающих проверки</p>
                    </div>
                ) : (
                    <div className={styles.queueList}>
                        {reviewItems.map(item => (
                            <div key={item.progressId} className={styles.queueCard}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.userInfo}>
                                        <UserAvatar name={item.userName} size="md" />
                                        <div>
                                            <div className={styles.userName}>{item.userName}</div>
                                            <div className={styles.roadmapTitle}>{item.roadmapTitle}</div>
                                        </div>
                                    </div>
                                    <div className={styles.stepInfo}>
                    <span className={styles.stepType}>
                      {item.stepTypeCode === 'COURSE' ? '📚' :
                          item.stepTypeCode === 'TASK' ? '📝' : '🎓'}
                        {item.stepTypeCode === 'COURSE' ? 'Курс' :
                            item.stepTypeCode === 'TASK' ? 'Задача' : 'Экзамен'}
                    </span>
                                    </div>
                                </div>

                                <div className={styles.cardBody}>
                                    <h4 className={styles.stepTitle}>{item.stepTitle}</h4>
                                    <div className={styles.submittedAt}>
                                        📅 Отправлено: {new Date(item.submittedAt).toLocaleString('ru-RU')}
                                    </div>
                                </div>
                                <div className={styles.reportSection}>
                                    <div className={styles.reportHeader}>
                                        <span className={styles.reportIcon}>📄</span>
                                        <span className={styles.reportLabel}>Отчет сотрудника</span>
                                    </div>
                                    <div className={styles.reportContent}>
                                        {item.reportText ? (
                                            <p className={styles.reportText}>{item.reportText}</p>
                                        ) : (
                                            <p className={styles.reportEmpty}>Отчет не предоставлен</p>
                                        )}
                                    </div>

                                    {item.employeeComment && (
                                        <div className={styles.employeeComment}>
                                            <span className={styles.commentBadge}>💬 Комментарий</span>
                                            <p className={styles.commentText}>{item.employeeComment}</p>
                                        </div>
                                    )}
                                </div>
                                {selectedItem === item.progressId ? (
                                    <div className={styles.reviewForm}>
                                        <div className={styles.formField}>
                                            <label>Оценка (баллы)</label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={score}
                                                onChange={e => setScore(Number(e.target.value))}
                                                className={styles.scoreInput}
                                                disabled={isReviewing}
                                            />
                                        </div>

                                        <div className={styles.formField}>
                                            <label>Комментарий *</label>
                                            <textarea
                                                value={commentText}
                                                onChange={e => setCommentText(e.target.value)}
                                                placeholder="Введите комментарий для сотрудника..."
                                                rows={4}
                                                className={styles.commentTextarea}
                                                disabled={isReviewing}
                                            />
                                        </div>

                                        <div className={styles.formActions}>
                                            <button
                                                className={styles.btnReject}
                                                onClick={() => handleReview(item.progressId, false)}
                                                disabled={isReviewing}
                                            >
                                                ❌ Отклонить
                                            </button>
                                            <button
                                                className={styles.btnApprove}
                                                onClick={() => handleReview(item.progressId, true)}
                                                disabled={isReviewing}
                                            >
                                                {isReviewing ? '...' : '✅ Принять'}
                                            </button>
                                        </div>

                                        <button
                                            className={styles.btnCancel}
                                            onClick={() => {
                                                setSelectedItem(null);
                                                setCommentText('');
                                                setScore(80);
                                            }}
                                            disabled={isReviewing}
                                        >
                                            Отмена
                                        </button>
                                    </div>
                                ) : (
                                    <div className={styles.cardActions}>
                                        <button
                                            className={styles.btnReview}
                                            onClick={() => setSelectedItem(item.progressId)}
                                        >
                                            🔍 Проверить
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}