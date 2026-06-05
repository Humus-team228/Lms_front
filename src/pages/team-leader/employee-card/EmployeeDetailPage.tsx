import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/widgets/layout/Layout';
import { UserAvatar } from '@/entities/user/UserAvatar';
import { EmployeeStatusSelector } from '@/features/user-management/EmployeeStatusSelector';
import { FeedbackHistory } from '@/features/feedback/FeedbackHistory';
import { useQuery } from '@tanstack/react-query';
import { userService, UserDTO } from '@/shared/api/user';
import { progressService } from '@/shared/api/progress';
import { BackendAssignmentDTO } from '@/shared/types/roadmap';
import styles from './EmployeeDetailPage.module.css';

export default function EmployeeDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const userId = parseInt(id || '0', 10);

    // 🔹 Получение данных сотрудника
    const { data: employee, isLoading: employeeLoading, isError: employeeError } = useQuery<UserDTO>({
        queryKey: ['employee', userId],
        queryFn: () => userService.getUserById(userId),
        enabled: !!userId,
    });

    // 🔹 Получение прогресса сотрудника
    const { data: assignments, isLoading: progressLoading, isError: progressError } = useQuery<BackendAssignmentDTO[]>({
        queryKey: ['employee-progress', userId],
        queryFn: () => progressService.getUserProgress(userId),
        enabled: !!userId,
    });

    const [status, setStatus] = useState(employee?.statusCode || 'ACTIVE');

    const handleStatusChange = (newStatus: string) => {
        setStatus(newStatus);
        console.log(`Статус сотрудника ${id} изменен на ${newStatus}`);
        // TODO: Добавить API-запрос для обновления статуса
    };

    // 🔹 Вычисляем общий прогресс
    const overallProgress = assignments && assignments.length > 0
        ? Math.round(
            (assignments[0].steps.filter(s => s.statusCode === 'DONE').length / assignments[0].steps.length) * 100
        )
        : 0;

    // 🔹 Преобразуем этапы в формат для отображения
    const progressSteps = assignments && assignments.length > 0
        ? assignments[0].steps.map(step => ({
            id: step.stepId,
            title: step.stepTitle,
            status: step.statusCode === 'DONE' ? 'completed'
                : step.statusCode === 'IN_PROGRESS' ? 'in_progress'
                    : step.statusCode === 'REVIEW' || step.statusCode === 'IN_REVIEW' ? 'in_progress'
                        : 'locked',
            date: step.completionDate || '-',
        }))
        : [];

    //  Собираем все комментарии из всех этапов
    const allComments = assignments?.flatMap(assignment =>
        assignment.steps.flatMap(step =>
            step.comments.map(comment => ({
                id: String(comment.commentId),
                author: comment.authorName,
                text: comment.commentText,
                date: comment.createdAt,
                role: 'team_leader' as const,
            }))
        )
    ) || [];

    if (employeeLoading || progressLoading) {
        return (
            <Layout>
                <div className={styles.loader}>
                    <div className={styles.spinner} />
                    Загрузка данных сотрудника...
                </div>
            </Layout>
        );
    }

    if (employeeError || progressError || !employee) {
        return (
            <Layout>
                <div className={styles.error}>
                    ️ Не удалось загрузить данные сотрудника. Попробуйте обновить страницу.
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className={styles.container}>
                <button className={styles.backBtn} onClick={() => navigate(-1)}>← Назад к группе</button>

                <div className={styles.headerCard}>
                    <div className={styles.profileInfo}>
                        <UserAvatar name={employee.fullName} size="lg" />
                        <div>
                            <h1 className={styles.name}>{employee.fullName}</h1>
                            <p className={styles.meta}>
                                {employee.roleName} • Принят: {new Date(employee.hireDate).toLocaleDateString('ru-RU')}
                            </p>
                            <div className={styles.progressMini}>
                                <span>Общий прогресс: {overallProgress}%</span>
                                <div className={styles.miniBarWrapper}>
                                    <div className={styles.miniBar} style={{ width: `${overallProgress}%` }} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <EmployeeStatusSelector currentStatus={status} onChange={handleStatusChange} />
                </div>

                <div className={styles.grid}>
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Траектория обучения</h3>
                        {progressSteps.length === 0 ? (
                            <div className={styles.emptyState}>
                                У сотрудника пока нет назначенных этапов обучения
                            </div>
                        ) : (
                            <div className={styles.stepsList}>
                                {progressSteps.map(step => (
                                    <div key={step.id} className={`${styles.step} ${styles[step.status]}`}>
                                        <div className={styles.stepIcon}>
                                            {step.status === 'completed' ? '✓' : step.status === 'in_progress' ? '●' : '○'}
                                        </div>
                                        <div className={styles.stepInfo}>
                                            <span className={styles.stepTitle}>{step.title}</span>
                                            <span className={styles.stepDate}>
                                                {step.date !== '-' ? new Date(step.date).toLocaleDateString('ru-RU') : 'Ожидает'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>История обратной связи</h3>
                        {allComments.length === 0 ? (
                            <div className={styles.emptyState}>
                                Обратная связь пока не предоставлена
                            </div>
                        ) : (
                            <FeedbackHistory comments={allComments} />
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}