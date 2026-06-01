import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/widgets/layout/Layout';
import { UserAvatar } from '@/entities/user/UserAvatar';
import { EmployeeStatusSelector } from '@/features/user-management/EmployeeStatusSelector';
import { FeedbackHistory } from '@/features/feedback/FeedbackHistory';
import styles from './EmployeeDetailPage.module.css';

const EMPLOYEE_MOCK = {
    id: '3',
    name: 'Сидоров Дмитрий Константинович',
    role: 'Оператор КЦ',
    hireDate: '2026-03-15',
    currentStage: 'Настройка CRM',
    overallProgress: 34,
    status: 'TRAINING' as const,
};

const PROGRESS_STEPS = [
    { id: 1, title: 'Вводный курс', status: 'completed', date: '2026-03-20' },
    { id: 2, title: 'Скрипты продаж', status: 'completed', date: '2026-04-02' },
    { id: 3, title: 'Настройка CRM', status: 'in_progress', date: '2026-05-10' },
    { id: 4, title: 'Стажировка с наставником', status: 'locked', date: '-' },
];

const COMMENTS = [
    { id: 'c1', author: 'Вы (Тимлид)', text: 'Обрати внимание на поле "Источник заявки" в CRM.', date: '2026-05-09', role: 'team_leader' }
];

export default function EmployeeDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState(EMPLOYEE_MOCK.status);

    const handleStatusChange = (newStatus: typeof EMPLOYEE_MOCK.status) => {
        setStatus(newStatus);
        console.log(`Статус сотрудника ${id} изменен на ${newStatus}`);
    };

    return (
        <Layout>
            <div className={styles.container}>
                <button className={styles.backBtn} onClick={() => navigate(-1)}>← Назад к группе</button>

                <div className={styles.headerCard}>
                    <div className={styles.profileInfo}>
                        <UserAvatar name={EMPLOYEE_MOCK.name} size="lg" />
                        <div>
                            <h1 className={styles.name}>{EMPLOYEE_MOCK.name}</h1>
                            <p className={styles.meta}>{EMPLOYEE_MOCK.role} • Принят: {new Date(EMPLOYEE_MOCK.hireDate).toLocaleDateString('ru-RU')}</p>
                            <div className={styles.progressMini}>
                                <span>Общий прогресс: {EMPLOYEE_MOCK.overallProgress}%</span>
                                <div className={styles.miniBarWrapper}>
                                    <div className={styles.miniBar} style={{ width: `${EMPLOYEE_MOCK.overallProgress}%` }} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <EmployeeStatusSelector currentStatus={status} onChange={handleStatusChange} />
                </div>

                <div className={styles.grid}>
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Траектория обучения</h3>
                        <div className={styles.stepsList}>
                            {PROGRESS_STEPS.map(step => (
                                <div key={step.id} className={`${styles.step} ${styles[step.status]}`}>
                                    <div className={styles.stepIcon}>{step.status === 'completed' ? '✓' : step.status === 'in_progress' ? '●' : '○'}</div>
                                    <div className={styles.stepInfo}>
                                        <span className={styles.stepTitle}>{step.title}</span>
                                        <span className={styles.stepDate}>{step.date !== '-' ? new Date(step.date).toLocaleDateString('ru-RU') : 'Ожидает'}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>История обратной связи</h3>
                        <FeedbackHistory comments={COMMENTS} />
                    </div>
                </div>
            </div>
        </Layout>
    );
}