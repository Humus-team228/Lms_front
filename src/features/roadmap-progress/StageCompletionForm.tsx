import React, { useState } from 'react';
import { useCompleteStep } from '@/shared/hooks/useCompleteStep';
import styles from './StageCompletionForm.module.css';

interface StageCompletionFormProps {
    assignmentId: number;
    stepId: number;
    stepType: 'course' | 'task' | 'exam';
    onSuccess: () => void;
}

export const StageCompletionForm: React.FC<StageCompletionFormProps> = ({
                                                                            assignmentId,
                                                                            stepId,
                                                                            stepType,
                                                                            onSuccess,
                                                                        }) => {
    const [reportText, setReportText] = useState('');
    const [employeeComment, setEmployeeComment] = useState('');
    const completeStep = useCompleteStep();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!reportText.trim()) {
            alert('Пожалуйста, заполните отчет о выполнении');
            return;
        }

        try {
            await completeStep.mutateAsync({
                assignmentId,
                request: {
                    stepId,
                    reportText: reportText.trim(),
                    employeeComment: employeeComment.trim(),
                },
            });

            onSuccess();
        } catch (error) {
            console.error('Ошибка при сдаче этапа:', error);
            alert(error instanceof Error ? error.message : 'Не удалось сдать этап');
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.info}>
                <span className={styles.label}>Тип этапа:</span>
                <span className={styles.value}>
          {stepType === 'course' ? '📚 Курс' : stepType === 'task' ? '📝 Задача' : '🎓 Экзамен'}
        </span>
            </div>

            <div className={styles.field}>
                <label htmlFor="reportText">
                    Отчет о выполнении *
                </label>
                <textarea
                    id="reportText"
                    value={reportText}
                    onChange={(e) => setReportText(e.target.value)}
                    placeholder="Опишите, что было сделано, какие результаты получены..."
                    rows={5}
                    required
                    disabled={completeStep.isPending}
                    className={styles.textarea}
                />
                <span className={styles.hint}>
          Основное содержание вашей работы. Будьте максимально конкретны.
        </span>
            </div>

            <div className={styles.field}>
                <label htmlFor="employeeComment">
                    Комментарий (опционально)
                </label>
                <textarea
                    id="employeeComment"
                    value={employeeComment}
                    onChange={(e) => setEmployeeComment(e.target.value)}
                    placeholder="Ваши впечатления, сложности, вопросы руководителю..."
                    rows={3}
                    disabled={completeStep.isPending}
                    className={styles.textarea}
                />
                <span className={styles.hint}>
          Личные заметки, которые не входят в основной отчет
        </span>
            </div>

            <div className={styles.actions}>
                <button
                    type="button"
                    className={styles.btnCancel}
                    onClick={() => setReportText('')}
                    disabled={completeStep.isPending}
                >
                    Очистить
                </button>
                <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={completeStep.isPending || !reportText.trim()}
                >
                    {completeStep.isPending ? 'Отправка...' : '📤 Сдать на проверку'}
                </button>
            </div>
        </form>
    );
};