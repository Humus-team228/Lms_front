import React, { useState } from 'react';
import styles from './TemplateApprovalList.module.css';

const TEMPLATES = [
    { id: 't1', name: 'Онбординг Q3-2026 (Розница)', author: 'Методист Иванова', version: '2.1', status: 'pending', created: '2026-05-08' },
    { id: 't2', name: 'Адаптация переводов (Кредиты)', author: 'Методист Петров', version: '1.0', status: 'approved', created: '2026-05-05' },
    { id: 't3', name: 'Стажировка (Телемаркетинг)', author: 'Методист Сидорова', version: '1.3', status: 'rejected', created: '2026-05-07' },
];

export const TemplateApprovalList: React.FC = () => {
    const [templates, setTemplates] = useState(TEMPLATES);

    const handleAction = (id: string, action: 'approved' | 'rejected') => {
        setTemplates(prev => prev.map(t => t.id === id ? { ...t, status: action } : t));
    };

    return (
        <div className={styles.card}>
            <table className={styles.table}>
                <thead>
                <tr>
                    <th>Шаблон</th>
                    <th>Автор</th>
                    <th>Версия</th>
                    <th>Создан</th>
                    <th>Статус</th>
                    <th>Действие</th>
                </tr>
                </thead>
                <tbody>
                {templates.map(t => (
                    <tr key={t.id}>
                        <td className={styles.name}>{t.name}</td>
                        <td>{t.author}</td>
                        <td>v{t.version}</td>
                        <td>{new Date(t.created).toLocaleDateString('ru-RU')}</td>
                        <td>
                <span className={`${styles.badge} ${styles[`badge${t.status}`]}`}>
                  {t.status === 'pending' ? 'На согласовании' : t.status === 'approved' ? 'Утвержден' : 'Отклонен'}
                </span>
                        </td>
                        <td>
                            {t.status === 'pending' && (
                                <div className={styles.actions}>
                                    <button className={styles.btnApprove} onClick={() => handleAction(t.id, 'approved')}>✓</button>
                                    <button className={styles.btnReject} onClick={() => handleAction(t.id, 'rejected')}>✕</button>
                                </div>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};