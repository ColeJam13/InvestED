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

    const featuredLesson = lessons.find(l => !l.completed) || lessons[0];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Learn</h1>
                <p className={styles.subtitle}>Master investing with bite-sized lessons</p>
            </div>

            {/* Progress Card */}
            <div className={styles.progressCard}>
                <div className={styles.progressInfo}>
                    <h3>Your Progress</h3>
                    <p>{completedCount} of {lessons.length} lessons completed</p>
                </div>
                <div className={styles.progressBarContainer}>
                    <div className={styles.progressBar}>
                        <div 
                            className={styles.progressFill} 
                            style={{ width: `${progressPercent}%` }}
                        ></div>
                    </div>
                    <span className={styles.progressPercent}>{progressPercent}%</span>
                </div>
            </div>

            {/* Featured Lesson */}
            <div className={styles.featuredSection}>
                <h2 className={styles.sectionTitle}>Continue Learning</h2>
                <div className={styles.featuredCard}>
                    <div className={styles.featuredIcon}>
                        <featuredLesson.icon size={32} />
                    </div>
                    <div className={styles.featuredContent}>
                        <span className={styles.featuredBadge}>{featuredLesson.difficulty}</span>
                        <h3>{featuredLesson.title}</h3>
                        <p>{featuredLesson.description}</p>
                        <div className={styles.featuredMeta}>
                            <span className={styles.duration}><Clock size={14} /> {featuredLesson.duration}</span>
                            <button className={styles.startBtn}>
                                Start Lesson <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div className={styles.categories}>
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

            {/* Search */}
            <div className={styles.searchBox}>
                <Search size={18} className={styles.searchIcon} />
                <input
                    type="text"
                    placeholder="Search lessons..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />
            </div>

            {/* Lessons Grid */}
            <div className={styles.lessonsGrid}>
                {filteredLessons.map(lesson => {
                    const IconComponent = lesson.icon;
                    return (
                        <div key={lesson.id} className={`${styles.lessonCard} ${lesson.completed ? styles.completed : ''}`}>
                            <div className={styles.lessonHeader}>
                                <div className={styles.lessonIcon}>
                                    <IconComponent size={24} />
                                </div>
                                {lesson.completed && (
                                    <CheckCircle size={20} className={styles.completedIcon} />
                                )}
                            </div>
                            <h3 className={styles.lessonTitle}>{lesson.title}</h3>
                            <p className={styles.lessonDescription}>{lesson.description}</p>
                            <div className={styles.lessonMeta}>
                                <span className={styles.duration}><Clock size={14} /> {lesson.duration}</span>
                                <span className={styles.difficulty}>{lesson.difficulty}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* AI Mentor Card */}
            <div className={styles.mentorCard}>
                <div className={styles.mentorIcon}><Bot size={32} /></div>
                <div className={styles.mentorContent}>
                    <h3>Need Help?</h3>
                    <p>Ask our AI advisor any investing questions</p>
                </div>
                <button className={styles.askBtn}>Ask Now</button>
            </div>
        </div>
    );
};

export default LearnView;
