import React, { useState } from 'react';
import { Layout } from '@/widgets/layout/Layout';
import { useTeamMembersQuery } from '@/shared/hooks/useTeamMembersQuery';
import { UserAvatar } from '@/entities/user/UserAvatar';
import { UserRoleBadge } from '@/entities/user/UserRoleBadge';
import styles from './TeamLeaderDashboard.module.css';

export default function TeamLeaderDashboard() {
    const [search, setSearch] = useState('');
    const { data: teamMembers, isLoading, isError } = useTeamMembersQuery();

    // Фильтрация
    const filteredMembers = teamMembers?.filter(member => {
        const searchLower = search.toLowerCase();
        return (
            member.fullName.toLowerCase().includes(searchLower) ||
            member.email.toLowerCase().includes(searchLower)
        );
    });

    // Статистика
    const stats = {
        total: teamMembers?.length || 0,
        active: teamMembers?.filter(m => m.isActive).length || 0,
        onTraining: teamMembers?.filter(m => m.status === 'ON_TRAINING').length || 0,
        avgProgress: 78, // Здесь потом будет реальный расчет из API прогресса
    };

    if (isLoading) {
        return (
            <Layout>
                <div className={styles.loader}>
                    <div className={styles.spinner} />
                    Загрузка команды...
                </div>
            </Layout>
        );
    }

    if (isError) {
        return (
            <Layout>
                <div className={styles.error}>
                    ⚠️ Не удалось загрузить данные команды. Попробуйте обновить страницу.
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>Моя команда</h1>
                        <p className={styles.subtitle}>
                            Управление сотрудниками и контроль их прогресса
                        </p>
                    </div>
                    <div className={styles.stats}>
                        <div className={styles.statCard}>
                            <span className={styles.statValue}>{stats.total}</span>
                            <span className={styles.statLabel}>Всего сотрудников</span>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statValue}>{stats.active}</span>
                            <span className={styles.statLabel}>Активных</span>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statValue}>{stats.onTraining}</span>
                            <span className={styles.statLabel}>На обучении</span>
                        </div>
                    </div>
                </div>

                <div className={styles.controls}>
                    <input
                        type="text"
                        placeholder="🔍 Поиск по имени или email..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>

                <div className={styles.cardFull}>
                    {filteredMembers && filteredMembers.length > 0 ? (
                        <table className={styles.tableFull}>
                            <thead>
                            <tr>
                                <th style={{ width: '60px' }}>ID</th>
                                <th style={{ width: '30%' }}>Сотрудник</th>
                                <th style={{ width: '25%' }}>Email</th>
                                <th style={{ width: '15%' }}>Роль</th>
                                <th style={{ width: '15%' }}>Статус</th>
                                <th style={{ width: '150px' }}>Действия</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredMembers.map(member => (
                                <tr key={member.id} className={!member.isActive ? styles.inactive : ''}>
                                    <td className={styles.id}>{member.id}</td>
                                    <td>
                                        <div className={styles.userCell}>
                                            <UserAvatar name={member.fullName} size="sm" />
                                            <div>
                                                <div className={styles.userName}>{member.fullName}</div>
                                                <div className={styles.hireDate}>
                                                    Принят: {new Date(member.hireDate).toLocaleDateString('ru-RU')}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={styles.email}>{member.email}</td>
                                    <td>
                                        <UserRoleBadge role={member.role as any} />
                                    </td>
                                    <td>
                      <span className={`${styles.statusBadge} ${member.isActive ? styles.statusActive : styles.statusInactive}`}>
                        {member.statusName || (member.isActive ? 'Активен' : 'Неактивен')}
                      </span>
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button
                                                className={styles.btnView}
                                                onClick={() => alert(`Просмотр профиля: ${member.fullName}`)}
                                            >
                                                👁️ Просмотр
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className={styles.empty}>
                            {search ? 'Сотрудники не найдены' : 'В вашей команде пока нет сотрудников'}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}