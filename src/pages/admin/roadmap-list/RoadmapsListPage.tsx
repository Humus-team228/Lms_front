import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/widgets/layout/Layout';
import { useRoadmapsQuery } from '@/shared/hooks/useRoadmapsQuery';
import { roadmapService } from '@/shared/api/roadmap';
import { RoadmapTemplate, CreateRoadmapRequest } from '@/shared/types/roadmap';
import styles from './RoadmapsListPage.module.css';

export default function RoadmapsListPage() {
    const navigate = useNavigate();
    const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [search, setSearch] = useState('');
    const [loadingActionId, setLoadingActionId] = useState<number | null>(null);
    const [editingRoadmap, setEditingRoadmap] = useState<RoadmapTemplate | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);

    // Форма редактирования
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');

    const { data: roadmaps, isLoading, isError, refetch } = useRoadmapsQuery();

    const filteredRoadmaps = roadmaps?.filter(r => {
        const matchesFilter =
            filter === 'all' ? true :
                filter === 'active' ? r.isActive :
                    !r.isActive;

        const searchLower = search.toLowerCase();
        const title = (r.title || '').toLowerCase();
        const desc = (r.description || '').toLowerCase();

        const matchesSearch = !search ||
            title.includes(searchLower) ||
            desc.includes(searchLower);

        return matchesFilter && matchesSearch;
    });

    // 🔹 Открытие модального окна редактирования с заполненными полями
    const handleEdit = (roadmap: RoadmapTemplate) => {
        setEditingRoadmap(roadmap);
        setEditTitle(roadmap.title);
        setEditDescription(roadmap.description);
        setShowEditModal(true);
    };

    // 🔹 Сохранение изменений
    const handleSaveEdit = async () => {
        if (!editingRoadmap || !editTitle.trim()) {
            alert('Введите название роадмапа');
            return;
        }

        setLoadingActionId(editingRoadmap.id);
        try {
            const request: CreateRoadmapRequest = {
                title: editTitle,
                description: editDescription,
                steps: [], // Этапы редактируются отдельно
            };

            // 🔹 Используем PUT для обновления существующего роадмапа
            await roadmapService.updateRoadmap(editingRoadmap.id, request);

            await refetch();
            setShowEditModal(false);
            setEditingRoadmap(null);
        } catch (error) {
            console.error('Ошибка при обновлении:', error);
            alert('Не удалось обновить роадмап');
        } finally {
            setLoadingActionId(null);
        }
    };

    // 🔹 Обработка активации/деактивации
    const handleToggleStatus = async (roadmapId: number, currentStatus: boolean) => {
        setLoadingActionId(roadmapId);
        try {
            if (currentStatus) {
                await roadmapService.deactivateRoadmap(roadmapId);
            } else {
                await roadmapService.activateRoadmap(roadmapId);
            }
            await refetch();
        } catch (error) {
            console.error('Ошибка при изменении статуса:', error);
            alert('Не удалось изменить статус роадмапа');
        } finally {
            setLoadingActionId(null);
        }
    };

    if (isLoading) {
        return (
            <Layout>
                <div className={styles.loader}>
                    <div className={styles.spinner} />
                    Загрузка шаблонов роадмапов...
                </div>
            </Layout>
        );
    }

    if (isError) {
        return (
            <Layout>
                <div className={styles.error}>
                    ⚠️ Не удалось загрузить роадмапы. Попробуйте обновить страницу.
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>Шаблоны роадмапов</h1>
                        <p className={styles.subtitle}>Управление траекториями обучения сотрудников</p>
                    </div>
                    <button className={styles.btnCreate} onClick={() => navigate('/admin/roadmap-builder')}>
                        + Создать роадмап
                    </button>
                </div>

                <div className={styles.controls}>
                    <div className={styles.filterGroup}>
                        <button className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`} onClick={() => setFilter('all')}>Все</button>
                        <button className={`${styles.filterBtn} ${filter === 'active' ? styles.active : ''}`} onClick={() => setFilter('active')}>Активные</button>
                        <button className={`${styles.filterBtn} ${filter === 'inactive' ? styles.active : ''}`} onClick={() => setFilter('inactive')}>Неактивные</button>
                    </div>
                    <input
                        type="text"
                        placeholder="🔍 Поиск по названию или описанию..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>

                <div className={styles.stats}>
                    <div className={styles.statCard}>
                        <span className={styles.statValue}>{roadmaps?.length || 0}</span>
                        <span className={styles.statLabel}>Всего шаблонов</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statValue}>{roadmaps?.filter(r => r.isActive).length || 0}</span>
                        <span className={styles.statLabel}>Активных</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statValue}>{roadmaps?.filter(r => !r.isActive).length || 0}</span>
                        <span className={styles.statLabel}>Неактивных</span>
                    </div>
                </div>

                {/* 🔹 Таблица на всю ширину */}
                <div className={styles.cardFull}>
                    {filteredRoadmaps && filteredRoadmaps.length > 0 ? (
                        <table className={styles.tableFull}>
                            <thead>
                            <tr>
                                <th style={{ width: '60px' }}>ID</th>
                                <th style={{ width: '25%' }}>Название</th>
                                <th style={{ width: '40%' }}>Описание</th>
                                <th style={{ width: '100px' }}>Этапов</th>
                                <th style={{ width: '120px' }}>Статус</th>
                                <th style={{ width: '250px' }}>Действия</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredRoadmaps.map(roadmap => (
                                <tr key={roadmap.id} className={!roadmap.isActive ? styles.inactive : ''}>
                                    <td className={styles.id}>{roadmap.id}</td>
                                    <td className={styles.name}>{roadmap.title}</td>
                                    <td className={styles.description}>{roadmap.description || '—'}</td>
                                    <td>{roadmap.stepsCount}</td>
                                    <td>
                      <span className={`${styles.statusBadge} ${roadmap.isActive ? styles.statusActive : styles.statusInactive}`}>
                        {roadmap.isActive ? 'Активен' : 'Неактивен'}
                      </span>
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button
                                                className={styles.btnEdit}
                                                onClick={() => handleEdit(roadmap)}
                                                disabled={loadingActionId === roadmap.id}
                                            >
                                                {loadingActionId === roadmap.id ? '...' : '✏️ Редактировать'}
                                            </button>
                                            <button
                                                className={roadmap.isActive ? styles.btnDeactivate : styles.btnActivate}
                                                onClick={() => handleToggleStatus(roadmap.id, roadmap.isActive)}
                                                disabled={loadingActionId === roadmap.id}
                                            >
                                                {loadingActionId === roadmap.id
                                                    ? '...'
                                                    : roadmap.isActive
                                                        ? '🚫 Деактивировать'
                                                        : '✅ Активировать'
                                                }
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className={styles.empty}>
                            {search || filter !== 'all' ? 'По запросу ничего не найдено' : 'Шаблоны роадмапов пока не созданы'}
                        </div>
                    )}
                </div>

                {/* 🔹 Модальное окно редактирования */}
                {showEditModal && editingRoadmap && (
                    <div className={styles.modal} onClick={() => setShowEditModal(false)}>
                        <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                            <div className={styles.modalHeader}>
                                <h2 className={styles.modalTitle}>Редактирование роадмапа</h2>
                                <button className={styles.btnClose} onClick={() => setShowEditModal(false)}>✕</button>
                            </div>

                            <div className={styles.modalBody}>
                                <div className={styles.field}>
                                    <label htmlFor="editTitle">Название роадмапа *</label>
                                    <input
                                        id="editTitle"
                                        type="text"
                                        value={editTitle}
                                        onChange={e => setEditTitle(e.target.value)}
                                        placeholder="Например: Онбординг оператора КЦ"
                                        disabled={loadingActionId === editingRoadmap.id}
                                    />
                                </div>

                                <div className={styles.field}>
                                    <label htmlFor="editDesc">Описание</label>
                                    <textarea
                                        id="editDesc"
                                        value={editDescription}
                                        onChange={e => setEditDescription(e.target.value)}
                                        placeholder="Опишите цель и задачи данного роадмапа..."
                                        rows={4}
                                        disabled={loadingActionId === editingRoadmap.id}
                                    />
                                </div>
                            </div>

                            <div className={styles.modalFooter}>
                                <button className={styles.btnCancel} onClick={() => setShowEditModal(false)}>
                                    Отмена
                                </button>
                                <button
                                    className={styles.btnSave}
                                    onClick={handleSaveEdit}
                                    disabled={loadingActionId === editingRoadmap.id || !editTitle.trim()}
                                >
                                    {loadingActionId === editingRoadmap.id ? 'Сохранение...' : '💾 Сохранить изменения'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}