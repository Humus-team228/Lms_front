import React, { useState } from 'react';
import { useAssignRoadmap, useRoadmapTemplates } from '@/shared/hooks/useAssignRoadmap';
import styles from './RoadmapAssignModal.module.css';

interface RoadmapAssignModalProps {
    userId: number;
    userName: string;
    isOpen: boolean;
    onClose: () => void;
}

export const RoadmapAssignModal: React.FC<RoadmapAssignModalProps> = ({
                                                                          userId,
                                                                          userName,
                                                                          isOpen,
                                                                          onClose,
                                                                      }) => {
    const [selectedRoadmapId, setSelectedRoadmapId] = useState<number | null>(null);
    const { data: roadmaps, isLoading: roadmapsLoading } = useRoadmapTemplates();
    const assignRoadmap = useAssignRoadmap();

    const handleAssign = async () => {
        if (!selectedRoadmapId) {
            alert('Выберите роадмап для назначения');
            return;
        }

        try {
            await assignRoadmap.mutateAsync({
                userId,
                roadmapId: selectedRoadmapId,
            });
            onClose();
            alert(`Роадмап успешно назначен сотруднику ${userName}`);
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Ошибка при назначении роадмапа');
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modal} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Назначить роадмап</h2>
                    <button className={styles.btnClose} onClick={onClose}>✕</button>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.userInfo}>
                        <span className={styles.userLabel}>Сотрудник:</span>
                        <span className={styles.userNameValue}>{userName}</span>
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="roadmap">Выберите траекторию обучения</label>
                        {roadmapsLoading ? (
                            <div className={styles.loading}>Загрузка роадмапов...</div>
                        ) : roadmaps && roadmaps.length > 0 ? (
                            <select
                                id="roadmap"
                                value={selectedRoadmapId || ''}
                                onChange={e => setSelectedRoadmapId(Number(e.target.value))}
                                className={styles.select}
                            >
                                <option value="">-- Выберите роадмап --</option>
                                {roadmaps.map(roadmap => (
                                    <option key={roadmap.id} value={roadmap.id}>
                                        {roadmap.title} {roadmap.activeFlag ? '(Активен)' : '(Неактивен)'}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <div className={styles.empty}>Роадмапы не найдены</div>
                        )}
                    </div>

                    {selectedRoadmapId && roadmaps && (
                        <div className={styles.roadmapInfo}>
                            <h4>Информация о роадмапе:</h4>
                            {roadmaps
                                .filter(r => r.id === selectedRoadmapId)
                                .map(roadmap => (
                                    <div key={roadmap.id}>
                                        <p className={styles.description}>{roadmap.description}</p>
                                        <p className={styles.stepsCount}>
                                            Этапов: {roadmap.steps?.length || 0}
                                        </p>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>

                <div className={styles.modalFooter}>
                    <button className={styles.btnCancel} onClick={onClose}>
                        Отмена
                    </button>
                    <button
                        className={styles.btnAssign}
                        onClick={handleAssign}
                        disabled={!selectedRoadmapId || assignRoadmap.isPending}
                    >
                        {assignRoadmap.isPending ? 'Назначение...' : '📋 Назначить роадмап'}
                    </button>
                </div>
            </div>
        </div>
    );
};