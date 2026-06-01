import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/widgets/layout/Layout';
import { useTeamMembersQuery } from '@/shared/hooks/useTeamMembersQuery';
import { UserAvatar } from '@/entities/user/UserAvatar';
import { UserRoleBadge } from '@/entities/user/UserRoleBadge';
import { RoadmapAssignModal } from '@/features/roadmap-assign/RoadmapAssignModal';
import styles from './EmployeeListPage.module.css';

export default function EmployeeListPage() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<{id: number, name: string} | null>(null);

    const { data: teamMembers, isLoading, isError } = useTeamMembersQuery();

    const filteredMembers = teamMembers?.filter(member => {
        const searchLower = search.toLowerCase();
        return (
            member.fullName.toLowerCase().includes(searchLower) ||
            member.email.toLowerCase().includes(searchLower) ||
            member.roleName.toLowerCase().includes(searchLower)
        );
    });

    const handleOpenAssignModal = (employee: typeof teamMembers[0]) => {
        setSelectedEmployee({ id: employee.id, name: employee.fullName });
        setAssignModalOpen(true);
    };

    if (isLoading) {
        return (
            <Layout>
                <div className={styles.loader}>
                    <div className={styles.spinner} />
                    Загрузка сотрудников...
                </div>
            </Layout>
        );
    }

    if (isError) {
        return (
            <Layout>
                <div className={styles.error}>
                    ⚠️ Не удалось загрузить список сотрудников
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>Сотрудники группы</h1>
                        <p className={styles.subtitle}>
                            Управление командой и назначение обучения
                        </p>
                    </div>
                    <div className={styles.stats}>
            <span className={styles.statBadge}>
              Всего: {teamMembers?.length || 0}
            </span>
                    </div>
                </div>

                <div className={styles.controls}>
                    <input
                        type="text"
                        placeholder="🔍 Поиск по имени, email или роли..."
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
                                <th style={{ width: '20%' }}>Email</th>
                                <th style={{ width: '15%' }}>Роль</th>
                                <th style={{ width: '15%' }}>Статус</th>
                                <th style={{ width: '280px' }}>Действия</th>
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
                                                className={styles.btnAssignRoadmap}
                                                onClick={() => handleOpenAssignModal(member)}
                                            >
                                                📋 Назначить роадмап
                                            </button>
                                            <button
                                                className={styles.btnView}
                                                onClick={() => navigate(`/team-leader/employee/${member.id}`)}
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

                {selectedEmployee && (
                    <RoadmapAssignModal
                        userId={selectedEmployee.id}
                        userName={selectedEmployee.name}
                        isOpen={assignModalOpen}
                        onClose={() => {
                            setAssignModalOpen(false);
                            setSelectedEmployee(null);
                        }}
                    />
                )}
            </div>
        </Layout>
    );
}