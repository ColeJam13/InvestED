import { useState } from 'react';
import styles from './BottomNav.module.css';

const BottomNav = () => {
    const [activeNav, setActiveNav] = useState('home');

    const navItems = [
        {
            id: 'home',
            label: 'Home',
            icon: (
                <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
            ),
        },
        {
            id: 'markets',
            label: 'Markets',
            icon: (
                <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10"></line>
                    <line x1="12" y1="20" x2="12" y2="4"></line>
                    <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
            ),
        },
        {
            id: 'advisor',
            label: 'AI Advisor',
            icon: (
                <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
            ),
        },
        {
            id: 'learn',
            label: 'Learn',
            icon: (
                <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
            ),
        },
        {
            id: 'profile',
            label: 'Profile',
            icon: (
                <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
            ),
        },
    ];

    return (
        <nav className={styles.bottomNav}>
            {navItems.map((item) => (
                <button
                    key={item.id}
                    className={`${styles.navItem} ${activeNav === item.id ? styles.active : ''}`}
                    onClick={() => setActiveNav(item.id)}
                >
                    {item.icon}
                    <span>{item.label}</span>
                </button>
            ))}
        </nav>
    );
};

export default BottomNav;
