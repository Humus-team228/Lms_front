import React from 'react';
import { Layout } from '@/widgets/layout/Layout';
import { GamificationConfigWidget } from '@/widgets/gamification/GamificationConfigWidget';
import styles from './GamificationSettingsPage.module.css';

export default function GamificationSettingsPage() {
    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Настройка геймификации</h1>
                    <p className={styles.subtitle}>Управление весами баллов, уровнями и наградами направления</p>
                </div>
                <GamificationConfigWidget />
            </div>
        </Layout>
    );
}