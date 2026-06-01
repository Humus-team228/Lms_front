import React from 'react';
import { Layout } from '@/widgets/layout/Layout';
import { TemplateApprovalList } from '@/widgets/roadmap-templates/TemplateApprovalList';
import styles from './RoadmapTemplatesPage.module.css';

export default function RoadmapTemplatesPage() {
    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Шаблоны роадмапов</h1>
                    <p className={styles.subtitle}>Утверждение траекторий обучения перед запуском в группы</p>
                </div>
                <TemplateApprovalList />
            </div>
        </Layout>
    );
}