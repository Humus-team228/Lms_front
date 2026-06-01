import React, { useState, useEffect } from 'react';
import { useCreateUser } from '@/shared/hooks/useUsersQuery';
import { userService } from '@/shared/api/user';
import { UserDTO } from '@/shared/types/user';
import styles from './CreateUserModal.module.css';

interface CreateUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (user: UserDTO) => void;
}

// 🔹 Справочные данные для ролей и статусов (из APP_DICTIONARY)
const ROLE_OPTIONS = [
    { value: 1, label: 'Оператор' },
    { value: 2, label: 'Руководитель группы' },
    { value: 3, label: 'Руководитель направления' },
    { value: 4, label: 'Администратор' },
];

const STATUS_OPTIONS = [
    { value: 1, label: 'На обучении (ON_TRAINING)' },
    { value: 2, label: 'Активен (ACTIVE)' },
    { value: 3, label: 'Болен (SICK)' },
    { value: 4, label: 'Отстранен (SUSPENDED)' },
    { value: 5, label: 'Уволен (FIRED)' },
];

export const CreateUserModal: React.FC<CreateUserModalProps> = ({
                                                                    isOpen,
                                                                    onClose,
                                                                    onSuccess,
                                                                }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        roleId: 1, // Default: Operator
        managerId: '' as string | number,
        statusId: 2, // Default: Active
        hireDate: new Date().toISOString().split('T')[0],
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);

    const createUser = useCreateUser();

    useEffect(() => {
        if (isOpen) {
            // Сброс формы при открытии
            setFormData({
                fullName: '',
                email: '',
                password: '',
                roleId: 1,
                managerId: '',
                statusId: 2,
                hireDate: new Date().toISOString().split('T')[0],
            });
            setErrors({});
        }
    }, [isOpen]);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'ФИО обязательно для заполнения';
        } else if (formData.fullName.trim().length < 3) {
            newErrors.fullName = 'ФИО должно содержать минимум 3 символа';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email обязателен';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
            newErrors.email = 'Некорректный формат email';
        }

        if (!formData.password) {
            newErrors.password = 'Пароль обязателен';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Минимум 8 символов';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'Должен содержать буквы (заглавные/строчные) и цифры';
        }

        if (!formData.roleId) {
            newErrors.roleId = 'Выберите роль';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const response = await userService.createUser({
                fullName: formData.fullName.trim(),
                email: formData.email.trim().toLowerCase(),
                roleId: Number(formData.roleId),
                managerId: formData.managerId ? Number(formData.managerId) : undefined,
                statusId: Number(formData.statusId),
                hireDate: `${formData.hireDate}T00:00:00`,
                password: formData.password,
            });

            onSuccess(response);
            onClose();
        } catch (error) {
            setErrors({
                submit: error instanceof Error ? error.message : 'Не удалось создать пользователя',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Очистка ошибки при вводе
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    // Обработчик закрытия с проверкой выделения текста
    const handleOverlayClick = (e: React.MouseEvent) => {
        // Проверяем, что клик был именно по overlay, а не по modal
        if (e.target === e.currentTarget) {
            // Дополнительная проверка на выделение текста
            const selection = window.getSelection();
            if (!selection || selection.toString().length === 0) {
                onClose();
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <div>
                        <h2 className={styles.title}>👤 Создание пользователя</h2>
                        <p className={styles.subtitle}>Заполните данные для регистрации нового сотрудника</p>
                    </div>
                    <button className={styles.closeBtn} onClick={onClose} disabled={isLoading}>✕</button>
                </div>

                <form onSubmit={handleSubmit} className={styles.body}>
                    {errors.submit && (
                        <div className={styles.errorBanner}>⚠️ {errors.submit}</div>
                    )}

                    <div className={styles.grid}>
                        {/* 🔹 Левая колонка - основная информация */}
                        <div className={styles.column}>
                            <div className={styles.field}>
                                <label htmlFor="fullName">ФИО сотрудника *</label>
                                <input
                                    id="fullName"
                                    type="text"
                                    value={formData.fullName}
                                    onChange={e => handleChange('fullName', e.target.value)}
                                    placeholder="Дворцов Сергей Дмитриевич"
                                    disabled={isLoading}
                                    className={errors.fullName ? styles.error : ''}
                                />
                                {errors.fullName && <span className={styles.errorText}>{errors.fullName}</span>}
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="email">Email *</label>
                                <input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={e => handleChange('email', e.target.value)}
                                    placeholder="erokhov@gmail.com"
                                    disabled={isLoading}
                                    className={errors.email ? styles.error : ''}
                                />
                                {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="password">Пароль *</label>
                                <input
                                    id="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={e => handleChange('password', e.target.value)}
                                    placeholder="••••••••"
                                    disabled={isLoading}
                                    className={errors.password ? styles.error : ''}
                                />
                                {errors.password && <span className={styles.errorText}>{errors.password}</span>}
                                <span className={styles.hint}>Мин. 8 символов, заглавные и строчные буквы, цифры</span>
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="hireDate">Дата найма</label>
                                <input
                                    id="hireDate"
                                    type="date"
                                    value={formData.hireDate}
                                    onChange={e => handleChange('hireDate', e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* 🔹 Правая колонка - роли и статусы */}
                        <div className={styles.column}>
                            <div className={styles.field}>
                                <label htmlFor="roleId">Роль в системе *</label>
                                <select
                                    id="roleId"
                                    value={formData.roleId}
                                    onChange={e => handleChange('roleId', Number(e.target.value))}
                                    disabled={isLoading}
                                    className={errors.roleId ? styles.error : ''}
                                >
                                    {ROLE_OPTIONS.map(role => (
                                        <option key={role.value} value={role.value}>
                                            {role.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.roleId && <span className={styles.errorText}>{errors.roleId}</span>}
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="managerId">Руководитель (ID)</label>
                                <input
                                    id="managerId"
                                    type="number"
                                    value={formData.managerId}
                                    onChange={e => handleChange('managerId', e.target.value ? Number(e.target.value) : '')}
                                    placeholder="Необязательно"
                                    disabled={isLoading}
                                />
                                <span className={styles.hint}>ID руководителя для подчинения в иерархии</span>
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="statusId">Статус сотрудника *</label>
                                <select
                                    id="statusId"
                                    value={formData.statusId}
                                    onChange={e => handleChange('statusId', Number(e.target.value))}
                                    disabled={isLoading}
                                >
                                    {STATUS_OPTIONS.map(status => (
                                        <option key={status.value} value={status.value}>
                                            {status.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.infoCard}>
                                <strong>ℹ️ Примечание</strong>
                                <p>После создания пользователь получит доступ к системе. Убедитесь, что выбран корректный руководитель для правильного отображения в иерархии групп.</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.footer}>
                        <button type="button" className={styles.btnCancel} onClick={onClose} disabled={isLoading}>
                            Отмена
                        </button>
                        <button type="submit" className={styles.btnSubmit} disabled={isLoading}>
                            {isLoading ? 'Создание...' : '✅ Создать пользователя'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};