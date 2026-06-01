import React, { useState } from 'react';
import { authService } from '@/shared/api/auth';
import styles from './ChangePasswordForm.module.css';

export const ChangePasswordForm: React.FC = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (newPassword !== confirmPassword) {
            setError('Новый пароль и подтверждение не совпадают');
            return;
        }
        if (newPassword.length < 8) {
            setError('Пароль должен содержать минимум 8 символов');
            return;
        }
        if (oldPassword === newPassword) {
            setError('Новый пароль не должен совпадать с текущим');
            return;
        }

        setIsLoading(true);
        try {
            await authService.changePassword({ oldPassword, newPassword, confirmPassword });
            setSuccess('Пароль успешно изменён. Используйте новый при следующем входе.');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            if (err instanceof Error) setError(`${err.message}`);
            else setError('Произошла неизвестная ошибка');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h3 className={styles.title}>Смена пароля</h3>

            {error && <div className={styles.error}>{error}</div>}
            {success && <div className={styles.success}>{success}</div>}

            <div className={styles.field}>
                <label htmlFor="oldPass">Текущий пароль</label>
                <input
                    id="oldPass"
                    type="password"
                    value={oldPassword}
                    onChange={e => setOldPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    autoComplete="current-password"
                />
            </div>

            <div className={styles.field}>
                <label htmlFor="newPass">Новый пароль</label>
                <input
                    id="newPass"
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                    minLength={8}
                    disabled={isLoading}
                    autoComplete="new-password"
                />
            </div>

            <div className={styles.field}>
                <label htmlFor="confirmPass">Подтвердите новый пароль</label>
                <input
                    id="confirmPass"
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    disabled={isLoading}
                    autoComplete="new-password"
                />
            </div>

            <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                {isLoading ? 'Сохранение...' : 'Сохранить пароль'}
            </button>
        </form>
    );
};