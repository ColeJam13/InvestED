import { useState } from 'react';
import { BookOpen, TrendingUp, Search, DollarSign, Coins, BarChart3, AlertTriangle, Target, Calendar, Scale, Clock, Bot, ChevronRight, CheckCircle } from 'lucide-react';
import styles from './LearnView.module.css';

const LearnView = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const categories = [
        { id: 'all', name: 'All Lessons' },
        { id: 'basics', name: 'Basics' },
        { id: 'stocks', name: 'Stocks' },
        { id: 'crypto', name: 'Crypto' },
        { id: 'strategy', name: 'Strategy' },
    ];

    const lessons = [
        {
            id: 1,
            title: 'Introduction to Investing',
            description: 'Learn the fundamentals of investing and why it matters for your financial future.',
            category: 'basics',
            duration: '10 min',
            difficulty: 'Beginner',
            icon: BookOpen,
            completed: true,
            progress: 100,
        },
        {
            id: 2,
            title: 'Understanding Stock Markets',
            description: 'Discover how stock markets work and how to read market indicators.',
            category: 'stocks',
            duration: '15 min',
            difficulty: 'Beginner',
            icon: TrendingUp,
            completed: true,
            progress: 100,
        },
        {
            id: 3,
            title: 'Technical Analysis Basics',
            description: 'Learn to read charts and identify patterns in stock movements.',
            category: 'stocks',
            duration: '20 min',
            difficulty: 'Intermediate',
            icon: Search,
            completed: false,
            progress: 45,
        },
        {
            id: 4,
            title: 'Dividend Investing',
            description: 'Build passive income through dividend-paying stocks.',
            category: 'strategy',
            duration: '12 min',
            difficulty: 'Intermediate',
            icon: DollarSign,
            completed: false,
            progress: 0,
        },
        {
            id: 5,
            title: 'Cryptocurrency Fundamentals',
            description: 'Understand blockchain technology and major cryptocurrencies.',
            category: 'crypto',
            duration: '18 min',
            difficulty: 'Beginner',
            icon: Coins,
            completed: false,
            progress: 0,
        },
        {
            id: 6,
            title: 'Portfolio Diversification',
            description: 'Learn how to spread risk across different asset classes.',
            category: 'strategy',
            duration: '14 min',
            difficulty: 'Intermediate',
            icon: BarChart3,
            completed: false,
            progress: 0,
        },
        {
            id: 7,
            title: 'Risk Management',
            description: 'Protect your investments with proper risk management strategies.',
            category: 'strategy',
            duration: '16 min',
            difficulty: 'Advanced',
            icon: AlertTriangle,
            completed: false,
            progress: 0,
        },
        {
            id: 8,
            title: 'Setting Investment Goals',
            description: 'Create clear financial goals and a roadmap to achieve them.',
            category: 'basics',
            duration: '8 min',
            difficulty: 'Beginner',
            icon: Target,
            completed: true,
            progress: 100,
        },
        {
            id: 9,
            title: 'Retirement Planning',
            description: 'Plan for your future with smart retirement investment strategies.',
            category: 'strategy',
            duration: '20 min',
            difficulty: 'Intermediate',
            icon: Calendar,
            completed: false,
            progress: 0,
        },
        {
            id: 10,
            title: 'Tax-Efficient Investing',
            description: 'Minimize taxes and maximize returns with smart strategies.',
            category: 'strategy',
            duration: '15 min',
            difficulty: 'Advanced',
            icon: Scale,
            completed: false,
            progress: 0,
        },
    ];

    const filteredLessons = lessons.filter(lesson => {
        const matchesCategory = selectedCategory === 'all' || lesson.category === selectedCategory;
        const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             lesson.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const completedCount = lessons.filter(l => l.completed).length;
    const progressPercent = Math.round((completedCount / lessons.length) * 100);

    const featuredLesson = lessons.find(l => !l.completed && l.progress > 0) || lessons.find(l => !l.completed) || lessons[0];

    const getDifficultyClass = (difficulty) => {
        switch (difficulty.toLowerCase()) {
            case 'beginner': return styles.beginner;
            case 'intermediate': return styles.intermediate;
            case 'advanced': return styles.advanced;
            default: return styles.beginner;
        }
    };

    return (
        <div className={styles.learnContainer}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>Learn</h1>
                    <p className={styles.subtitle}>Master investing with bite-sized lessons</p>
                </div>
                <div className={styles.stats}>
                    <div className={styles.statItem}>
                        <span className={styles.statValue}>{completedCount}</span>
                        <span className={styles.statLabel}>Completed</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statValue}>{progressPercent}%</span>
                        <span className={styles.statLabel}>Progress</span>
                    </div>
                </div>
            </div>

            {/* Featured Lesson */}
            <div className={styles.featuredSection}>
                <div className={styles.featuredCard}>
                    <div className={styles.featuredIcon}>
                        <featuredLesson.icon size={48} />
                    </div>
                    <div className={styles.featuredContent}>
                        <span className={styles.featuredLabel}>CONTINUE LEARNING</span>
                        <h2 className={styles.featuredTitle}>{featuredLesson.title}</h2>
                        <p className={styles.featuredDescription}>{featuredLesson.description}</p>
                        <div className={styles.featuredMeta}>
                            <span className={styles.duration}>
                                <Clock size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                                {featuredLesson.duration}
                            </span>
                            <span className={`${styles.difficulty} ${getDifficultyClass(featuredLesson.difficulty)}`}>
                                {featuredLesson.difficulty}
                            </span>
                        </div>
                    </div>
                    <button className={styles.startButton}>
                        {featuredLesson.progress > 0 ? 'Continue' : 'Start'} Lesson
                        <ChevronRight size={18} style={{ marginLeft: '4px', verticalAlign: 'middle' }} />
                    </button>
                </div>
            </div>

            {/* Category Filters */}
            <div className={styles.categoryFilters}>
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        className={`${styles.categoryBtn} ${selectedCategory === cat.id ? styles.active : ''}`}
                        onClick={() => setSelectedCategory(cat.id)}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Lessons Grid */}
            <div className={styles.lessonsGrid}>
                {filteredLessons.map(lesson => {
                    const IconComponent = lesson.icon;
                    return (
                        <div key={lesson.id} className={styles.lessonCard}>
                            <div className={styles.lessonHeader}>
                                <div className={styles.lessonIcon}>
                                    <IconComponent size={32} />
                                </div>
                                {lesson.completed && (
                                    <div className={styles.completedBadge}>
                                        <CheckCircle size={16} />
                                    </div>
                                )}
                            </div>
                            <h3 className={styles.lessonTitle}>{lesson.title}</h3>
                            <p className={styles.lessonDescription}>{lesson.description}</p>
                            <div className={styles.lessonMeta}>
                                <span className={styles.duration}>
                                    <Clock size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                                    {lesson.duration}
                                </span>
                                <span className={`${styles.difficulty} ${getDifficultyClass(lesson.difficulty)}`}>
                                    {lesson.difficulty}
                                </span>
                            </div>
                            {lesson.progress > 0 && lesson.progress < 100 && (
                                <div className={styles.progressBar}>
                                    <div 
                                        className={styles.progressFill} 
                                        style={{ width: `${lesson.progress}%` }}
                                    />
                                </div>
                            )}
                            <button className={styles.lessonButton}>
                                {lesson.completed ? 'Review' : lesson.progress > 0 ? 'Continue' : 'Start'}
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* AI Mentor Promo */}
            <div className={styles.mentorPromo}>
                <div className={styles.mentorIcon}>
                    <Bot size={40} />
                </div>
                <div className={styles.mentorContent}>
                    <h3>Need Help?</h3>
                    <p>Ask our AI advisor any investing questions you have while learning.</p>
                </div>
                <button className={styles.mentorButton}>Ask AI Advisor</button>
            </div>
        </div>
    );
};

export default LearnView;
