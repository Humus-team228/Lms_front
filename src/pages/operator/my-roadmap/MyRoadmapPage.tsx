// src/pages/operator/MyRoadmapPage.tsx
import React, { useState, useEffect } from 'react';
import { Layout } from '@/widgets/layout/Layout';
import { RoadmapTimeline } from '@/entities/roadmap/RoadmapTimeline';
import { StageDetailWidget } from '@/widgets/roadmap-viewer/StageDetailWidget';
import { useRoadmapQuery } from '@/shared/hooks/useRoadmapQuery';
import styles from './MyRoadmapPage.module.css';

export default function MyRoadmapPage() {
    const [selectedRoadmapId, setSelectedRoadmapId] = useState<string | null>(null);
    const [selectedStageId, setSelectedStageId] = useState<string | null>(null);

    const { data: roadmaps, isLoading, isError, error } = useRoadmapQuery();

    // 🔹 Автовыбор первого роадмапа при загрузке
    useEffect(() => {
        if (roadmaps && roadmaps.length > 0 && !selectedRoadmapId) {
            setSelectedRoadmapId(roadmaps[0].id);
        }
    }, [roadmaps]);

    const activeRoadmap = roadmaps?.find(r => r.id === selectedRoadmapId);
    const selectedStage = activeRoadmap?.stages.find(s => s.id === selectedStageId);

    if (isLoading) return <Layout><div className={styles.loader}><div className={styles.spinner} />Загрузка дорожных карт...</div></Layout>;
    if (isError || !roadmaps?.length) return <Layout><div className={styles.error}>⚠️ {error instanceof Error ? error.message : 'Нет активных роадмапов'}</div></Layout>;

    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Моя дорожная карта</h1>

                    {/* 🔹 Селектор роадмапов (показывается, если их > 1) */}
                    {roadmaps.length > 1 && (
                        <div className={styles.selector}>
                            <label htmlFor="roadmapSelect">Активная траектория:</label>
                            <select
                                id="roadmapSelect"
                                value={selectedRoadmapId || ''}
                                onChange={e => {
                                    setSelectedRoadmapId(e.target.value);
                                    setSelectedStageId(null); // Сброс выбранного этапа при переключении
                                }}
                                className={styles.roadmapSelect}
                            >
                                {roadmaps.map(r => (
                                    <option key={r.id} value={r.id}>
                                        {r.title} — {r.overall_progress}%
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {activeRoadmap && (
                    <>
                        <p className={styles.subtitle}>
                            Прогресс по траектории: <b>{activeRoadmap.overall_progress}%</b>
                        </p>

                        {activeRoadmap.stages.length === 0 ? (
                            <div className={styles.emptyRoadmap}>
                                📋 Этапы для этой траектории пока не добавлены. Ожидайте назначения от руководителя.
                            </div>
                        ) : (
                            <div className={styles.grid}>
                                <div className={styles.timelineSection}>
                                    <RoadmapTimeline stages={activeRoadmap.stages} onSelectStage={setSelectedStageId} />
                                </div>

                                {selectedStage && (
                                    <div className={styles.detailSection}>
                                        <StageDetailWidget
                                            stage={selectedStage}
                                            assignmentId={activeRoadmap.assignmentId}
                                            comments={selectedStage.comments ?? []}
                                            onClose={() => setSelectedStageId(null)}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </Layout>
    );
}