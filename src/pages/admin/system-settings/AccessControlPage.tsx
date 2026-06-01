import React from 'react';
import { Layout } from '@/widgets/layout/Layout';
import { SecurityConfigWidget } from '@/widgets/admin-panel/SecurityConfigWidget';
import styles from './AccessControlPage.module.css';

export default function AccessControlPage() {
    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Управление правами доступа</h1>
                    <p className={styles.subtitle}>Row-Level Security, изоляция данных по направлениям и ролям</p>
                </div>
                <SecurityConfigWidget />
            </div>
        </Layout>
    );
}