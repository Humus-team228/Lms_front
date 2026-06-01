import React from 'react';
import { StatusIndicator } from './StatusIndicator';
import styles from './StageCard.module.css';

export interface Stage {
    id: string;
    title: string;
    description: string;
    type: 'course' | 'task' | 'exam';
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED' | 'REJECTED';
    deadline?: string;
}

interface StageCardProps {
    stage: Stage;
    order: number;
    isSelected?: boolean;
    onSelect: () => void;
}

export const StageCard: React.FC<StageCardProps> = ({ stage, order, onSelect }) => (
    <div className={styles.card} onClick={onSelect}>
        <div className={styles.header}>
            <span className={styles.order}>#{order}</span>
            <StatusIndicator status={stage.status} />
        </div>
        <h3 className={styles.title}>{stage.title}</h3>
        <p className={styles.description}>{stage.description}</p>
        <div className={styles.meta}>
            <span className={styles.type}>{stage.type === 'course' ? '📚 Курс' : stage.type === 'task' ? ' Задача' : '🎓 Экзамен'}</span>
            {stage.deadline && <span className={styles.deadline}> {new Date(stage.deadline).toLocaleDateString('ru-RU')}</span>}
        </div>
    </div>
);