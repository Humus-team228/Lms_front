import React from 'react';
import { Layout } from '@/widgets/layout/Layout';
import { TurnoverChart } from '@/widgets/analytics-report/TurnoverChart';
import styles from './TurnoverAnalysisPage.module.css';

const CHURN_STATS = [
    { stage: 'Вводный курс', churnRate: 18, avgDays: 12 },
    { stage: 'Скрипты продаж', churnRate: 12, avgDays: 24 },
    { stage: 'Настройка CRM', churnRate: 8, avgDays: 35 },
    { stage: 'Стажировка с наставником', churnRate: 5, avgDays: 48 },
    { stage: 'Финальный экзамен', churnRate: 2, avgDays: 55 },
];

export default function TurnoverAnalysisPage() {
    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Анализ текучести кадров</h1>
                    <p className={styles.subtitle}>Связка «Этап обучения ↔ Увольнение» для выявления узких мест</p>
                </div>

                <div className={styles.grid}>
                    <TurnoverChart data={CHURN_STATS} />
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Ключевые выводы</h3>
                        <ul className={styles.insights}>
                            <li>⚠️ Максимальная текучка на этапе <b>«Вводный курс»</b> (18%). Рекомендуется пересмотреть интенсивность первых 2 недель.</li>
                            <li>📉 После прохождения <b>CRM</b> текучка падает до 8% → этап работает как фильтр.</li>
                            <li>🎯 Среднее время до увольнения: <b>28 дней</b>. Целевой KPI: 45 дней.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </Layout>
    );
}