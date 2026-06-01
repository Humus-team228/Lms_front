import React, { useState } from 'react';
import { Layout } from '@/widgets/layout/Layout';
import { UserAvatar } from '@/entities/user/UserAvatar';
import { UserRoleBadge } from '@/entities/user/UserRoleBadge';
import { CreateUserModal } from '@/features/user-management/CreateUserModal';
import { useUsersQuery, useToggleUserStatus, useUpdateUserStatus, useDeleteUser } from '@/shared/hooks/useUsersQuery';
import { User, UserDTO  } from '@/shared/types/user';
import styles from './UsersManagementPage.module.css';

const STATUS_IDS = {
    ACTIVE: 10,
    INACTIVE: 11,
    // ON_TRAINING, SICK, SUSPENDED, FIRED - если нужно, добавьте сюда их ID
};

export default function UsersManagementPage() {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<'all' | 'active' | 'blocked'>('all');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const { data: users, isLoading, isError } = useUsersQuery();
    const toggleStatus = useToggleUserStatus();
    const updateUserStatus = useUpdateUserStatus();
    const deleteUser = useDeleteUser();

    // Фильтрация
    const filteredUsers = users?.filter(user => {
        const matchesFilter =
            filter === 'all' ? true :
                filter === 'active' ? user.isActive :
                    !user.isActive;

        const searchLower = search.toLowerCase();
        const matchesSearch = !search ||
            user.fullName.toLowerCase().includes(searchLower) ||
            user.email.toLowerCase().includes(searchLower) ||
            user.roleName.toLowerCase().includes(searchLower);

        return matchesFilter && matchesSearch;
    });

    if (isLoading) {
        return (
            <Layout>
                <div className={styles.loader}>Загрузка пользователей...</div>
            </Layout>
        );
    }

    if (isError) {
        return (
            <Layout>
                <div className={styles.error}>⚠️ Не удалось загрузить пользователей</div>
            </Layout>
        );
    }

    const handleStatusChange = async (user: User, newStatusId: number) => {
        const statusLabel = newStatusId === STATUS_IDS.ACTIVE ? 'Активным' : 'Неактивным';
        if (!confirm(`Перевести пользователя ${user.fullName} в статус "${statusLabel}"?`)) return;

        try {
            await updateUserStatus.mutateAsync({ userId: user.id, statusId: newStatusId });
        } catch (error) {
            alert('Ошибка изменения статуса');
        }
    };

    const handleDelete = async (user: User) => {
        if (!confirm(`Деактивировать пользователя ${user.fullName}? Это действие мягкого удаления.`)) return;

        try {
            await deleteUser.mutateAsync(user.id);
        } catch (error) {
            alert('Ошибка удаления');
        }
    };

    const handleUserCreated = (newUser: UserDTO) => {
        refetch(); // Обновляем список пользователей
        // Можно добавить тост/уведомление об успехе
    };

    const handleToggleStatus = async (user: User) => {
        if (!confirm(`${user.isActive ? 'Заблокировать' : 'Разблокировать'} пользователя ${user.fullName}?`)) {
            return;
        }

        try {
            await toggleStatus.mutateAsync({ userId: user.id, isBlocked: user.isActive });
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Не удалось изменить статус пользователя');
        }
    };

    if (isLoading) {
        return (
            <Layout>
                <div className={styles.loader}>
                    <div className={styles.spinner} />
                    Загрузка пользователей...
                </div>
            </Layout>
        );
    }

    if (isError) {
        return (
            <Layout>
                <div className={styles.error}>
                    ⚠️ Не удалось загрузить пользователей. Попробуйте обновить страницу.
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>Управление пользователями</h1>
                        <p className={styles.subtitle}>Создание, редактирование и блокировка учетных записей</p>
                    </div>
                    <button
                        className={styles.btnCreate}
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        Создать пользователя
                    </button>
                </div>

                <div className={styles.controls}>
                    <div className={styles.filterGroup}>
                        <button
                            className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
                            onClick={() => setFilter('all')}
                        >
                            Все
                        </button>
                        <button
                            className={`${styles.filterBtn} ${filter === 'active' ? styles.active : ''}`}
                            onClick={() => setFilter('active')}
                        >
                            Активные
                        </button>
                        <button
                            className={`${styles.filterBtn} ${filter === 'blocked' ? styles.active : ''}`}
                            onClick={() => setFilter('blocked')}
                        >
                            Заблокированные
                        </button>
                    </div>

                    <input
                        type="text"
                        placeholder="🔍 Поиск по имени, email или роли..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>

                <div className={styles.stats}>
                    <div className={styles.statCard}>
                        <span className={styles.statValue}>{users?.length || 0}</span>
                        <span className={styles.statLabel}>Всего пользователей</span>
                    </div>
                    <div className={styles.statCard}>
            <span className={styles.statValue}>
              {users?.filter(u => u.isActive).length || 0}
            </span>
                        <span className={styles.statLabel}>Активных</span>
                    </div>
                    <div className={styles.statCard}>
            <span className={styles.statValue}>
              {users?.filter(u => !u.isActive).length || 0}
            </span>
                        <span className={styles.statLabel}>Заблокированных</span>
                    </div>
                </div>

                <div className={styles.cardFull}>
                    {filteredUsers && filteredUsers.length > 0 ? (
                        <table className={styles.tableFull}>
                            <thead>
                            <tr>
                                <th style={{ width: '60px' }}>ID</th>
                                <th style={{ width: '25%' }}>Пользователь</th>
                                <th style={{ width: '20%' }}>Email</th>
                                <th style={{ width: '15%' }}>Роль</th>
                                <th style={{ width: '15%' }}>Руководитель</th>
                                <th style={{ width: '100px' }}>Статус</th>
                                <th style={{ width: '250px' }}>Действия</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id} className={!user.isActive ? styles.inactive : ''}>
                                    <td className={styles.id}>{user.id}</td>
                                    <td>
                                        <div className={styles.userCell}>
                                            <UserAvatar name={user.fullName} size="sm" />
                                            <div>
                                                <div className={styles.userName}>{user.fullName}</div>
                                                <div className={styles.hireDate}>
                                                    Принят: {new Date(user.hireDate).toLocaleDateString('ru-RU')}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={styles.email}>{user.email}</td>
                                    <td>
                                        <UserRoleBadge role={user.role as any} />
                                    </td>
                                    <td>{user.managerName || '—'}</td>
                                    <td>
                      <span className={`${styles.statusBadge} ${user.isActive ? styles.statusActive : styles.statusBlocked}`}>
                        {user.isActive ? 'Активен' : 'Заблокирован'}
                      </span>
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            {/* 🔹 Кнопка Блокировки/Разблокировки (использует обновление статуса) */}
                                            <button
                                                className={user.isActive ? styles.btnBlock : styles.btnActivate}
                                                onClick={() => handleStatusChange(user, user.isActive ? STATUS_IDS.INACTIVE : STATUS_IDS.ACTIVE)}
                                                disabled={updateUserStatus.isPending}
                                            >
                                                {user.isActive ? '🚫 Блок' : '✅ Разблок'}
                                            </button>

                                            {/* 🔹 Кнопка Деактивации (Soft Delete) */}
                                            <button
                                                className={styles.btnDelete}
                                                onClick={() => handleDelete(user)}
                                                disabled={deleteUser.isPending}
                                            >
                                                {deleteUser.isPending ? '...' : '🗑️ Удалить'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className={styles.empty}>
                            {search || filter !== 'all' ? 'Пользователи не найдены' : 'Пользователи пока не созданы'}
                        </div>
                    )}
                </div>
                <CreateUserModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onSuccess={handleUserCreated}
                />
            </div>
        </Layout>
    );
}