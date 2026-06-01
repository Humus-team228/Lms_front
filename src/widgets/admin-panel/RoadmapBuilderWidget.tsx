import React, { useState } from 'react';
import { roadmapService, CreateStepRequest, AssignStepRequest } from '@/shared/api/roadmap';
import { CreateRoadmapRequest, CreateRoadmapResponse } from '@/shared/types/roadmap';
import styles from './RoadmapBuilderWidget.module.css';

interface Step {
    id: string;
    stepTypeId: number | null; // ID из справочника
    maxScore: number;          // Максимальный балл
    title: string;
    description: string;
    isRequired: boolean;
    order: number;
    createdStepId?: number;    // ID шага после успешного POST /api/roadmaps/steps
}

export const RoadmapBuilderWidget: React.FC = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [steps, setSteps] = useState<Step[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [createdRoadmapId, setCreatedRoadmapId] = useState<number | null>(null);
    const [isCreatingRoadmap, setIsCreatingRoadmap] = useState(false);
    const [isAddingSteps, setIsAddingSteps] = useState(false);

    // 🔹 Добавление нового этапа (заглушка)
    const addStep = () => {
        const newStep: Step = {
            id: `step-${Date.now()}`,
            stepTypeId: null,
            maxScore: 100, // Дефолтное значение
            title: '',
            description: '',
            isRequired: true,
            order: steps.length + 1,
        };
        setSteps([...steps, newStep]);
    };

    // 🔹 Удаление этапа
    const removeStep = async (step: Step) => {
        if (!createdRoadmapId) {
            setSteps(steps.filter(s => s.id !== step.id));
            return;
        }

        if (!step.structureId) {
            alert('Невозможно удалить этап: отсутствует structureId');
            return;
        }

        try {
            setIsLoading(true);
            await roadmapService.removeStepFromRoadmap(createdRoadmapId, step.structureId);
            setSteps(steps.filter(s => s.id !== step.id));
            setSuccess('Этап успешно удален');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Не удалось удалить этап');
            setTimeout(() => setError(null), 3000);
        } finally {
            setIsLoading(false);
        }
    };

    // 🔹 Обновление этапа
    const updateStep = (id: string, field: keyof Step, value: any) => {
        setSteps(steps.map(s => (s.id === id ? { ...s, [field]: value } : s)));
    };

    // 🔹 Шаг 1: Создание роадмапа
    const handleCreateRoadmap = async () => {
        if (!title.trim()) {
            setError('Введите название роадмапа');
            return;
        }

        setIsCreatingRoadmap(true);
        setError(null);
        setSuccess(null);

        try {
            const request: CreateRoadmapRequest = {
                title: title.trim(),
                description: description.trim(),
                steps: [],
            };

            const response: CreateRoadmapResponse = await roadmapService.createRoadmap(request);
            setCreatedRoadmapId(response.id);
            setSuccess(`✅ Роадмап "${response.title}" создан! ID: ${response.id}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Не удалось создать роадмап');
        } finally {
            setIsCreatingRoadmap(false);
        }
    };

    // 🔹 Шаг 2: Создание шагов и привязка к роадмапу
    const handleAddSteps = async () => {
        if (!createdRoadmapId) return setError('Сначала создайте роадмап');
        if (steps.length === 0) return setError('Добавьте хотя бы один этап');

        for (const step of steps) {
            if (!step.title.trim() || !step.stepTypeId) {
                return setError(`Заполните название и выберите тип для этапа #${step.order}`);
            }
        }

        setIsAddingSteps(true);
        setError(null);

        try {
            for (const step of steps) {
                // 1️⃣ Создаем шаг в справочнике
                const stepPayload: CreateStepRequest = {
                    title: step.title.trim(),
                    description: step.description.trim(),
                    stepTypeId: step.stepTypeId!,
                    maxScore: step.maxScore,
                };

                const createdStep = await roadmapService.createStep(stepPayload);

                // 2️⃣ Привязываем к роадмапу
                await roadmapService.assignStepToRoadmap(createdRoadmapId, {
                    stepId: createdStep.id,
                    stepOrder: step.order,
                    isRequired: step.isRequired,
                });
            }

            setSuccess('✅ Этапы успешно созданы и привязаны!');
            setTimeout(() => {
                setTitle(''); setDescription(''); setSteps([]); setCreatedRoadmapId(null); setSuccess(null);
            }, 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка при создании этапов');
        } finally {
            setIsAddingSteps(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>Конструктор роадмапов</h2>
                <p className={styles.subtitle}>
                    Создайте роадмап, затем добавьте к нему этапы обучения
                </p>
            </div>

            {error && <div className={styles.error}>{error}</div>}
            {success && <div className={styles.success}>{success}</div>}

            {/* 🔹 Шаг 1: Основная информация */}
            <div className={styles.card}>
                <h3 className={styles.cardTitle}>1. Основная информация</h3>
                <div className={styles.field}>
                    <label htmlFor="title">Название роадмапа *</label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Например: Онбординг оператора КЦ"
                        disabled={isCreatingRoadmap || isAddingSteps || !!createdRoadmapId}
                    />
                </div>
                <div className={styles.field}>
                    <label htmlFor="desc">Описание</label>
                    <textarea
                        id="desc"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Опишите цель и задачи данного роадмапа..."
                        rows={3}
                        disabled={isCreatingRoadmap || isAddingSteps || !!createdRoadmapId}
                    />
                </div>

                {!createdRoadmapId ? (
                    <button
                        onClick={handleCreateRoadmap}
                        className={styles.btnCreate}
                        disabled={isCreatingRoadmap || !title.trim()}
                    >
                        {isCreatingRoadmap ? 'Создание...' : '📋 Создать роадмап'}
                    </button>
                ) : (
                    <div className={styles.createdBadge}>
                        ✅ Роадмап создан (ID: {createdRoadmapId})
                    </div>
                )}
            </div>

            {/* 🔹 Шаг 2: Этапы обучения */}
            {createdRoadmapId && (
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h3 className={styles.cardTitle}>2. Этапы обучения</h3>
                        <button onClick={addStep} className={styles.btnAddStep} disabled={isAddingSteps}>
                            + Добавить этап
                        </button>
                    </div>

                    {steps.length === 0 ? (
                        <div className={styles.emptySteps}>
                            Нажмите "Добавить этап", чтобы создать и добавить этапы к роадмапу
                        </div>
                    ) : (
                        <div className={styles.stepsList}>
                            {steps.map((step, idx) => (
                                <div key={step.id} className={styles.stepCard}>
                                    <div className={styles.stepHeader}>
                                        <span className={styles.stepNumber}>Этап {idx + 1}</span>
                                        <button
                                            onClick={() => removeStep(step)}
                                            className={styles.btnRemove}
                                            disabled={isAddingSteps}
                                        >
                                            🗑️
                                        </button>
                                    </div>

                                    <div className={styles.stepBody}>
                                        <div className={styles.field}>
                                            <label>Название этапа *</label>
                                            <input
                                                type="text"
                                                value={step.title}
                                                onChange={e => updateStep(step.id, 'title', e.target.value)}
                                                placeholder="Например: Введение в продукты банка"
                                                disabled={isAddingSteps}
                                            />
                                        </div>

                                        <div className={styles.field}>
                                            <label>Описание</label>
                                            <textarea
                                                value={step.description}
                                                onChange={e => updateStep(step.id, 'description', e.target.value)}
                                                placeholder="Опишите содержание этапа..."
                                                rows={2}
                                                disabled={isAddingSteps}
                                            />
                                        </div>

                                        <div className={styles.stepMeta}>
                                            <div className={styles.field}>
                                                <label>Тип этапа (ID из справочника) *</label>
                                                <select
                                                    value={step.stepTypeId || ''}
                                                    onChange={e => updateStep(step.id, 'stepTypeId', Number(e.target.value))}
                                                    disabled={isAddingSteps}
                                                    required
                                                >
                                                    <option value="">-- Выберите тип --</option>
                                                    {/* Значения должны браться из APP_DICTIONARY. Пока захардкодим базовые */}
                                                    <option value={1}> Курс (ID: 1)</option>
                                                    <option value={2}> Задача (ID: 2)</option>
                                                    <option value={3}>🎓 Экзамен (ID: 3)</option>
                                                </select>
                                            </div>

                                            <div className={styles.field}>
                                                <label>Максимальный балл</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    value={step.maxScore}
                                                    onChange={e => updateStep(step.id, 'maxScore', Number(e.target.value))}
                                                    disabled={isAddingSteps}
                                                />
                                            </div>

                                            <label className={styles.checkbox}>
                                                <input
                                                    type="checkbox"
                                                    checked={step.isRequired}
                                                    onChange={e => updateStep(step.id, 'isRequired', e.target.checked)}
                                                    disabled={isAddingSteps}
                                                />
                                                <span>Обязательный этап</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {steps.length > 0 && (
                        <div className={styles.actions}>
                            <button
                                onClick={handleAddSteps}
                                className={styles.btnSave}
                                disabled={isAddingSteps}
                            >
                                {isAddingSteps ? 'Создание и привязка...' : '💾 Создать и добавить все этапы'}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};