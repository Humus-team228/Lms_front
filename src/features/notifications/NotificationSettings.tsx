import React, { useState } from 'react';
import styles from './NotificationSettings.module.css';

export const NotificationSettings: React.FC = () => {
    const [settings, setSettings] = useState({
        email: true,
        push: false,
        roadmapUpdates: true,
        reviewResults: true,
        achievements: true,
    });

    const toggle = (key: keyof typeof settings) => setSettings(p => ({ ...p, [key]: !p[key] }));

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Настройка уведомлений</h2>
            <div className={styles.list}>
                <ToggleItem label="Email-уведомления" desc="Получать дайджесты и важные оповещения на почту" active={settings.email} onToggle={() => toggle('email')} />
                <ToggleItem label="Push-уведомления в браузере" desc="Мгновенные оповещения при изменении статуса задач" active={settings.push} onToggle={() => toggle('push')} />
                <ToggleItem label="Обновления дорожной карты" desc="Уведомления о новых этапах или изменении дедлайнов" active={settings.roadmapUpdates} onToggle={() => toggle('roadmapUpdates')} />
                <ToggleItem label="Результаты проверки" desc="Оповещения о принятии/отклонении этапов руководителем" active={settings.reviewResults} onToggle={() => toggle('reviewResults')} />
                <ToggleItem label="Геймификация и достижения" desc="Уведомления о новых баллах, уровнях и наградах" active={settings.achievements} onToggle={() => toggle('achievements')} />
            </div>
            <button className={styles.saveBtn} onClick={() => alert('Настройки сохранены')}>Сохранить настройки</button>
        </div>
    );
};

const ToggleItem: React.FC<{ label: string; desc: string; active: boolean; onToggle: () => void }> = ({ label, desc, active, onToggle }) => (
    <div className={styles.item}>
        <div className={styles.info}>
            <span className={styles.label}>{label}</span>
            <span className={styles.desc}>{desc}</span>
        </div>
        <button className={`${styles.switch} ${active ? styles.active : ''}`} onClick={onToggle}>
            <span className={styles.dot} />
        </button>
    </div>
);