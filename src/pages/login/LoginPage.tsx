import React from 'react';
import { LoginForm } from '@/features/auth/LoginForm';
import styles from './LoginPage.module.css';

export default function LoginPage() {
    return (
        <div className={styles.page}>
            <div className={styles.branding}>
                <h1>LMS Контакт-центра</h1>
                <p>Управление обучением и развитие сотрудников</p>
            </div>
            <div className={styles.formContainer}>
                <LoginForm />
            </div>
        </div>
    );
}