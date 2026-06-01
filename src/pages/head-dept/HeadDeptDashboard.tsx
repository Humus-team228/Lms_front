// src/pages/head-dept/HeadDeptDashboard.tsx
import React from 'react';
import { Layout } from '@/widgets/layout/Layout';
import { TurnoverWidget } from '@/widgets/analytics-report/TurnoverWidget';
import styles from './HeadDeptDashboard.module.css';

export default function HeadDeptDashboard() {
    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Аналитика Направления</h1>
                    <p>KPI эффективности обучения</p>
                </div>

                <div className={styles.kpiRow}>
                    <div className={styles.kpiCard}>
                        <span className={styles.val}>14 дней</span>
                        <span className={styles.lbl}>Ср. время ввода в должность</span>
                    </div>
                    <div className={styles.kpiCard}>
                        <span className={styles.val}>88%</span>
                        <span className={styles.lbl}>Сдача экзамена с 1-й попытки</span>
                    </div>
                    <div className={styles.kpiCard}>
                        <span className={styles.val}>4.2/5</span>
                        <span className={styles.lbl}>CSAT сотрудников</span>
                    </div>
                </div>

                <div className={styles.grid}>
                    <TurnoverWidget />
                    <div className={styles.card}>
                        <h3>Шаблоны роадмапов</h3>
                        <ul className={styles.list}>
                            <li className={styles.listItem}><span>Онбординг Q3-2026</span> <span className={styles.statusApproved}>Утвержден</span></li>
                            <li className={styles.listItem}><span>Стажировка (Тест)</span> <span className={styles.statusPending}>На согласовании</span></li>
                        </ul>
                    </div>
                </div>
            </div>
        </Layout>
    );
}