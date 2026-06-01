import React from 'react';
import styles from './UserAvatar.module.css';

interface UserAvatarProps {
    name: string;
    size?: 'sm' | 'md' | 'lg';
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ name, size = 'md' }) => {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    return (
        <div className={`${styles.avatar} ${styles[size]}`}>
            <span>{initials}</span>
        </div>
    );
};