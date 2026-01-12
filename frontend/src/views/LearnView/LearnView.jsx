import { useState } from 'react';
import styles from './LearnView.module.css';

const LearnView = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [expandedLesson, setExpandedLesson] = useState(null);

    const categories = [
        { id: 'all', label: 'All Topics' },
        { id: 'basics', label: 'Investing Basics' },
        { id: 'stocks', label: 'Stocks' },
        { id: 'crypto', label: 'Crypto' },
        { id: 'risk', label: 'Risk Management' },
        { id: 'strategies', label: 'Strategies' },
    ];

    const featuredLesson = {
        id: 'featured',
        title: 'Welcome to InvestED',
        description: 'Learn how to use the platform and start your investment education journey risk-free with paper money.',
        duration: '5 min',
        difficulty: 'Beginner',
        category: 'basics',
        icon: '🎓',
        progress: 0,
    };

    const lessons = [
        // Investing Basics
        {
            id: 1,
            title: 'What is Investing?',
            description: 'Understand the fundamentals of investing and why it matters for building wealth over time.',
            duration: '10 min',
            difficulty: 'Beginner',
            category: 'basics',
            icon: '📚',
            progress: 100,
        },
        {
            id: 2,
            title: 'Understanding Market Basics',
            description: 'Learn how financial markets work, including exchanges, trading hours, and market participants.',
            duration: '15 min',
            difficulty: 'Beginner',
            category: 'basics',
            icon: '🏛️',
            progress: 60,
        },
        {
            id: 3,
            title: 'Paper Trading vs Real Trading',
            description: 'Discover the benefits of practicing with simulated money before investing real funds.',
            duration: '8 min',
            difficulty: 'Beginner',
            category: 'basics',
            icon: '📝',
            progress: 0,
        },
        // Stocks
        {
            id: 4,
            title: 'Stocks 101',
            description: 'Learn what stocks are, how they work, and why companies issue shares to the public.',
            duration: '12 min',
            difficulty: 'Beginner',
            category: 'stocks',
            icon: '📈',
            progress: 0,
        },
        {
            id: 5,
            title: 'Reading Stock Quotes',
            description: 'Understand price, volume, market cap, P/E ratio, and other key metrics when evaluating stocks.',
            duration: '15 min',
            difficulty: 'Beginner',
            category: 'stocks',
            icon: '🔍',
            progress: 0,
        },
        {
            id: 6,
            title: 'Dividends Explained',
            description: 'Learn how dividend-paying stocks work and how to evaluate dividend yield and payout ratios.',
            duration: '10 min',
            difficulty: 'Intermediate',
            category: 'stocks',
            icon: '💰',
            progress: 0,
        },
        // Crypto
        {
            id: 7,
            title: 'Crypto 101',
            description: 'Understand blockchain technology, cryptocurrencies, and how digital assets differ from traditional investments.',
            duration: '15 min',
            difficulty: 'Beginner',
            category: 'crypto',
            icon: '₿',
            progress: 0,
        },
        {
            id: 8,
            title: 'Bitcoin vs Altcoins',
            description: 'Learn the differences between Bitcoin and alternative cryptocurrencies like Ethereum.',
            duration: '12 min',
            difficulty: 'Intermediate',
            category: 'crypto',
            icon: '🪙',
            progress: 0,
        },
        {
            id: 9,
            title: 'Crypto Volatility',
            description: 'Understand why crypto markets are more volatile and how to manage expectations.',
            duration: '10 min',
            difficulty: 'Intermediate',
            category: 'crypto',
            icon: '📊',
            progress: 0,
        },
        // Risk Management
        {
            id: 10,
            title: 'Understanding Risk',
            description: 'Learn about different types of investment risk including market risk, volatility, and liquidity risk.',
            duration: '12 min',
            difficulty: 'Beginner',
            category: 'risk',
            icon: '⚠️',
            progress: 0,
        },
        {
            id: 11,
            title: 'Alpha & Beta Explained',
            description: 'Understand risk metrics like Alpha and Beta and how to use them to match your risk tolerance.',
            duration: '15 min',
            difficulty: 'Intermediate',
            category: 'risk',
            icon: '📐',
            progress: 0,
        },
        {
            id: 12,
            title: 'Diversification Strategies',
            description: 'Learn why "don\'t put all eggs in one basket" matters and how to build a diversified portfolio.',
            duration: '12 min',
            difficulty: 'Intermediate',
            category: 'risk',
            icon: '🥚',
            progress: 0,
        },
        // Strategies
        {
            id: 13,
            title: 'Goal-Based Investing',
            description: 'Learn how to align your investments with specific goals like saving for a house or retirement.',
            duration: '10 min',
            difficulty: 'Beginner',
            category: 'strategies',
            icon: '🎯',
            progress: 0,
        },
        {
            id: 14,
            title: 'Dollar-Cost Averaging',
            description: 'Understand this popular strategy of investing fixed amounts at regular intervals.',
            duration: '8 min',
            difficulty: 'Beginner',
            category: 'strategies',
            icon: '📅',
            progress: 0,
        },
        {
            id: 15,
            title: 'Common Beginner Mistakes',
            description: 'Learn about emotional decision-making, timing the market, and other pitfalls to avoid.',
            duration: '12 min',
            difficulty: 'Beginner',
            category: 'strategies',
            icon: '🚫',
            progress: 0,
        },
        {
            id: 16,
            title: 'Value vs Growth Investing',
            description: 'Explore different investment philosophies from Warren Buffett to Peter Lynch.',
            duration: '15 min',
            difficulty: 'Advanced',
            category: 'strategies',
            icon: '⚖️',
            progress: 0,
        },
    ];

    const filteredLessons = activeCategory === 'all' 
        ? lessons 
        : lessons.filter(lesson => lesson.category === activeCategory);

    const completedCount = lessons.filter(l => l.progress === 100).length;
    const inProgressCount = lessons.filter(l => l.progress > 0 && l.progress < 100).length;

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Beginner': return styles.beginner;
            case 'Intermediate': return styles.intermediate;
            case 'Advanced': return styles.advanced;
            default: return '';
        }
    };

    return (
        <div className={styles.learnContainer}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>Learn</h1>
                    <p className={styles.subtitle}>
                        Build your investment knowledge risk-free
                    </p>
                </div>
                <div className={styles.stats}>
                    <div className={styles.statItem}>
                        <span className={styles.statValue}>{completedCount}</span>
                        <span className={styles.statLabel}>Completed</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statValue}>{inProgressCount}</span>
                        <span className={styles.statLabel}>In Progress</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statValue}>{lessons.length}</span>
                        <span className={styles.statLabel}>Total Lessons</span>
                    </div>
                </div>
            </div>

            {/* Featured Lesson */}
            <div className={styles.featuredSection}>
                <div className={styles.featuredCard}>
                    <div className={styles.featuredIcon}>{featuredLesson.icon}</div>
                    <div className={styles.featuredContent}>
                        <span className={styles.featuredLabel}>CONTINUE LEARNING</span>
                        <h2 className={styles.featuredTitle}>{featuredLesson.title}</h2>
                        <p className={styles.featuredDescription}>{featuredLesson.description}</p>
                        <div className={styles.featuredMeta}>
                            <span className={styles.duration}>⏱️ {featuredLesson.duration}</span>
                            <span className={`${styles.difficulty} ${getDifficultyColor(featuredLesson.difficulty)}`}>
                                {featuredLesson.difficulty}
                            </span>
                        </div>
                    </div>
                    <button className={styles.startButton}>
                        Start Learning →
                    </button>
                </div>
            </div>

            {/* Category Filters */}
            <div className={styles.categoryFilters}>
                {categories.map((category) => (
                    <button
                        key={category.id}
                        className={`${styles.categoryBtn} ${activeCategory === category.id ? styles.active : ''}`}
                        onClick={() => setActiveCategory(category.id)}
                    >
                        {category.label}
                    </button>
                ))}
            </div>

            {/* Lessons Grid */}
            <div className={styles.lessonsGrid}>
                {filteredLessons.map((lesson) => (
                    <div 
                        key={lesson.id} 
                        className={styles.lessonCard}
                        onClick={() => setExpandedLesson(expandedLesson === lesson.id ? null : lesson.id)}
                    >
                        <div className={styles.lessonHeader}>
                            <div className={styles.lessonIcon}>{lesson.icon}</div>
                            {lesson.progress === 100 && (
                                <span className={styles.completedBadge}>✓</span>
                            )}
                        </div>
                        <h3 className={styles.lessonTitle}>{lesson.title}</h3>
                        <p className={styles.lessonDescription}>{lesson.description}</p>
                        <div className={styles.lessonMeta}>
                            <span className={styles.duration}>⏱️ {lesson.duration}</span>
                            <span className={`${styles.difficulty} ${getDifficultyColor(lesson.difficulty)}`}>
                                {lesson.difficulty}
                            </span>
                        </div>
                        {lesson.progress > 0 && lesson.progress < 100 && (
                            <div className={styles.progressBar}>
                                <div 
                                    className={styles.progressFill} 
                                    style={{ width: `${lesson.progress}%` }}
                                ></div>
                            </div>
                        )}
                        <button className={styles.lessonButton}>
                            {lesson.progress === 100 ? 'Review' : lesson.progress > 0 ? 'Continue' : 'Start'}
                        </button>
                    </div>
                ))}
            </div>

            {/* AI Mentor Promo */}
            <div className={styles.mentorPromo}>
                <div className={styles.mentorIcon}>🤖</div>
                <div className={styles.mentorContent}>
                    <h3>Need Personalized Guidance?</h3>
                    <p>Our AI Advisor can explain concepts based on your portfolio and answer your specific questions.</p>
                </div>
                <button className={styles.mentorButton}>Talk to AI Advisor</button>
            </div>
        </div>
    );
};

export default LearnView;
