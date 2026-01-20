import styles from './BottomNav.module.css';

const BottomNav = ({ activeView, onNavigate }) => {
    const navItems = [
        { 
            id: 'home', 
            label: 'Home', 
            icon: (
                <svg viewBox="0 0 24 24">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
            )
        },
        { 
            id: 'markets', 
            label: 'Markets', 
            icon: (
                <svg viewBox="0 0 24 24">
                    <line x1="12" y1="20" x2="12" y2="10"></line>
                    <line x1="18" y1="20" x2="18" y2="4"></line>
                    <line x1="6" y1="20" x2="6" y2="16"></line>
                </svg>
            )
        },
        { 
            id: 'portfolio', 
            label: 'Portfolio', 
            icon: (
                <svg viewBox="0 0 24 24">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
            )
        },
        { 
            id: 'goals', 
            label: 'Goals', 
            icon: (
                <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"></circle>
                    <circle cx="12" cy="12" r="6"></circle>
                    <circle cx="12" cy="12" r="2"></circle>
                </svg>
            )
        },
        { 
            id: 'learn', 
            label: 'Learn', 
            icon: (
                <svg viewBox="0 0 24 24">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
            )
        },
        { 
            id: 'advisor', 
            label: 'Eddy', 
            icon: (
                <svg viewBox="0 0 24 24">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
            )
        },
        { 
            id: 'profile', 
            label: 'Profile', 
            icon: (
                <svg viewBox="0 0 24 24">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
            )
        },
    ];

    return (
        <nav className={styles.bottomNav}>
            {navItems.map((item) => (
                <button
                    key={item.id}
                    className={`${styles.navItem} ${activeView === item.id ? styles.active : ''}`}
                    onClick={() => onNavigate(item.id)}
                >
                    {item.icon}
                    <span className={styles.label}>{item.label}</span>
                </button>
            ))}
        </nav>
    );
};

export default BottomNav;