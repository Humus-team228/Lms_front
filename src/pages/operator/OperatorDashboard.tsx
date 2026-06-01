import React from 'react';
import { Layout } from '@/widgets/layout/Layout';
import { RoadmapViewer } from '@/widgets/roadmap-viewer/RoadmapViewer';
import { MOCK_STEPS, MOCK_PROGRESS } from '@/widgets/roadmap-viewer/RoadmapViewer';
import styles from './OperatorDashboard.module.css';

export default function OperatorDashboard() {
    return (
        <Layout>
            <div className={styles.dashboard}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Моя дорожная карта</h1>
                    <p className={styles.subtitle}>
                        Отслеживайте свой прогресс обучения и выполняйте этапы
                    </p>
                </div>

                <RoadmapViewer steps={MOCK_STEPS} progress={MOCK_PROGRESS} />
            </div>
        </Layout>
    );
}