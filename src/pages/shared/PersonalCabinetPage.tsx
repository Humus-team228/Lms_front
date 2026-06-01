import React from 'react';
import { Layout } from '@/widgets/layout/Layout';
import { PersonalCabinetWidget } from '@/widgets/personal-cabinet/PersonalCabinetWidget';

export default function PersonalCabinetPage() {
    return (
        <Layout>
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 0' }}>
                <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 24, color: 'var(--color-gray-900)' }}>
                    Личный кабинет
                </h1>
                <PersonalCabinetWidget />
            </div>
        </Layout>
    );
}