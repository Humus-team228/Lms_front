import React from 'react';
import { Layout } from '@/widgets/layout/Layout';
import { RoadmapBuilderWidget } from '@/widgets/admin-panel/RoadmapBuilderWidget';
import styles from './RoadmapConstructorPage.module.css';

export default function RoadmapConstructorPage() {
    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Конструктор роадмапов</h1>
                    <p className={styles.subtitle}>Создание траекторий обучения: этапы, связи, условия переходов</p>
                </div>
                <RoadmapBuilderWidget />
            </div>
        </Layout>
    );
}