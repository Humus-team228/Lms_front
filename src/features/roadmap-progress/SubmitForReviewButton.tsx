import React, { useState } from 'react';
import styles from './SubmitForReviewButton.module.css';

export const SubmitForReviewButton: React.FC<{ onClick: () => void; disabled?: boolean }> = ({ onClick, disabled }) => (
    <button
        className={`${styles.btn} ${disabled ? styles.disabled : ''}`}
        onClick={onClick}
        disabled={disabled}
    >
        {disabled ? 'Ожидает проверки' : 'Отправить на проверку'}
    </button>
);