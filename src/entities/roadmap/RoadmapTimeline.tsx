import React from 'react';
import { Stage, StageCard } from '../course/StageCard';
import styles from './RoadmapTimeline.module.css';

interface RoadmapTimelineProps {
    stages: Stage[];
    onSelectStage: (id: string) => void;
}

export const RoadmapTimeline: React.FC<RoadmapTimelineProps> = ({ stages, onSelectStage }) => (
    <div className={styles.timeline}>
        {stages.map((stage, idx) => (
            <div key={stage.id} className={styles.item}>
                <div className={styles.line} />
                <StageCard
                    stage={stage}
                    order={idx + 1}
                    onSelect={() => onSelectStage(stage.id)}
                />
            </div>
        ))}
    </div>
);