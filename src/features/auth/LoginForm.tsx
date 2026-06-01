import React, { useState } from 'react';
import { useAuth } from '@/app/providers/AuthProvider';
import styles from './LoginForm.module.css';

export const LoginForm: React.FC = () => {
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await login(email, password);
            // Редирект произойдет автоматически внутри AuthProvider или App
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Произошла неизвестная ошибка');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.header}>
                <span className={styles.icon}>🏦</span>
                <h2 className={styles.title}>Вход в систему LMS</h2>
                <p className={styles.subtitle}>Корпоративный портал контакт-центра</p>
            </div>

            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.field}>
                <label htmlFor="email">Корпоративная почта</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@bank.ru"
                    required
                    disabled={isLoading}
                />
            </div>

            <div className={styles.field}>
                <label htmlFor="password">Пароль</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                />
            </div>

            <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                {isLoading ? 'Вход...' : 'Войти в систему'}
            </button>
        </form>
    );
};