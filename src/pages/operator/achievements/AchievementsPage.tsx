import { Layout } from '@/widgets/layout/Layout';
import { LeaderboardWidget } from '@/features/gamification/LeaderboardWidget';
import styles from './AchievementsPage.module.css';

const ACHIEVEMENTS = [
    { id: 'a1', title: 'Быстрый старт', desc: 'Завершил вводный курс за 2 дня', icon: '🚀', earned: true },
    { id: 'a2', title: 'Эксперт CRM', desc: 'Сдал тест по CRM на 100%', icon: '💻', earned: true },
    { id: 'a3', title: 'Наставник', desc: 'Помог коллеге пройти этап', icon: '', earned: false },
    { id: 'a4', title: 'Без ошибок', desc: '10 заявок подряд без правок', icon: '✨', earned: false },
];

export default function AchievementsPage() {
    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Достижения и Рейтинг</h1>
                    <p className={styles.subtitle}>Ваш прогресс в системе геймификации</p>
                </div>

                <div className={styles.stats}>
                    <div className={styles.statCard}>
                        <span className={styles.statValue}>980</span>
                        <span className={styles.statLabel}>Баллов</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statValue}>2/4</span>
                        <span className={styles.statLabel}>Ачивок</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statValue}>3</span>
                        <span className={styles.statLabel}>Место в группе</span>
                    </div>
                </div>

                <div className={styles.grid}>
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}> Мои достижения</h2>
                        <div className={styles.achievementGrid}>
                            {ACHIEVEMENTS.map((a) => (
                                <div key={a.id} className={`${styles.achievementCard} ${!a.earned ? styles.locked : ''}`}>
                                    <span className={styles.icon}>{a.icon}</span>
                                    <h4 className={styles.aTitle}>{a.title}</h4>
                                    <p className={styles.aDesc}>{a.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={styles.section}>
                        <LeaderboardWidget />
                    </div>
                </div>
            </div>
        </Layout>
    );
}