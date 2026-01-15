import { useState, useEffect } from 'react';
import { BookOpen, TrendingUp, Search, DollarSign, Coins, BarChart3, AlertTriangle, Target, Calendar, Scale, Clock, Bot, ChevronRight, CheckCircle } from 'lucide-react';
import styles from './LearnView.module.css';
import LessonDetailView from '../LessonDetailView/LessonDetailView';
import ChatWidget from '../../components/ChatWidget/ChatWidget';

const LearnView = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLessonId, setSelectedLessonId] = useState(null);
    
    const [lessonProgress, setLessonProgress] = useState(() => {
        const saved = localStorage.getItem('lessonProgress');
        return saved ? JSON.parse(saved) : {};
    });

    useEffect(() => {
        localStorage.setItem('lessonProgress', JSON.stringify(lessonProgress));
    }, [lessonProgress]);

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
            hasContent: true,
            totalSections: 5,
            totalQuizQuestions: 5,
        },
        {
            id: 2,
            title: 'Understanding Stock Markets',
            description: 'Discover how stock markets work and how to read market indicators.',
            category: 'stocks',
            duration: '15 min',
            difficulty: 'Beginner',
            icon: TrendingUp,
            hasContent: true,
            totalSections: 6,
            totalQuizQuestions: 6,
        },
        {
            id: 3,
            title: 'Technical Analysis Basics',
            description: 'Learn to read charts and identify patterns in stock movements.',
            category: 'stocks',
            duration: '20 min',
            difficulty: 'Intermediate',
            icon: Search,
            hasContent: false,
            totalSections: 0,
            totalQuizQuestions: 0,
        },
        {
            id: 4,
            title: 'Dividend Investing',
            description: 'Build passive income through dividend-paying stocks.',
            category: 'strategy',
            duration: '12 min',
            difficulty: 'Intermediate',
            icon: DollarSign,
            hasContent: false,
            totalSections: 0,
            totalQuizQuestions: 0,
        },
        {
            id: 5,
            title: 'Cryptocurrency Fundamentals',
            description: 'Understand blockchain technology and major cryptocurrencies.',
            category: 'crypto',
            duration: '18 min',
            difficulty: 'Beginner',
            icon: Coins,
            hasContent: true,
            totalSections: 6,
            totalQuizQuestions: 6,
        },
        {
            id: 6,
            title: 'Portfolio Diversification',
            description: 'Learn how to spread risk across different asset classes.',
            category: 'strategy',
            duration: '14 min',
            difficulty: 'Intermediate',
            icon: BarChart3,
            hasContent: false,
            totalSections: 0,
            totalQuizQuestions: 0,
        },
        {
            id: 7,
            title: 'Risk Management',
            description: 'Protect your investments with proper risk management strategies.',
            category: 'strategy',
            duration: '16 min',
            difficulty: 'Advanced',
            icon: AlertTriangle,
            hasContent: false,
            totalSections: 0,
            totalQuizQuestions: 0,
        },
        {
            id: 8,
            title: 'Setting Investment Goals',
            description: 'Create clear financial goals and a roadmap to achieve them.',
            category: 'basics',
            duration: '8 min',
            difficulty: 'Beginner',
            icon: Target,
            hasContent: false,
            totalSections: 0,
            totalQuizQuestions: 0,
        },
        {
            id: 9,
            title: 'Retirement Planning',
            description: 'Plan for your future with smart retirement investment strategies.',
            category: 'strategy',
            duration: '20 min',
            difficulty: 'Intermediate',
            icon: Calendar,
            hasContent: false,
            totalSections: 0,
            totalQuizQuestions: 0,
        },
        {
            id: 10,
            title: 'Tax-Efficient Investing',
            description: 'Minimize taxes and maximize returns with smart strategies.',
            category: 'strategy',
            duration: '15 min',
            difficulty: 'Advanced',
            icon: Scale,
            hasContent: false,
            totalSections: 0,
            totalQuizQuestions: 0,
        },
    ];

    const getLessonProgress = (lessonId) => {
        const progress = lessonProgress[lessonId];
        if (!progress) return 0;
        if (progress.completed) return 100;
        
        const lesson = lessons.find(l => l.id === lessonId);
        if (!lesson || !lesson.hasContent) return 0;
        
        const totalSteps = lesson.totalSections + lesson.totalQuizQuestions;
        const completedSteps = progress.currentSection + (progress.quizAnswered || 0);
        
        return Math.round((completedSteps / totalSteps) * 100);
    };

    const difficultyOrder = { "Beginner": 1, "Intermediate": 2, "Advanced": 3 };

    const filteredLessons = lessons
        .filter(lesson => {
            const matchesCategory = selectedCategory === 'all' || lesson.category === selectedCategory;
            const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 lesson.description.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        })
        .sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);

    const completedCount = lessons.filter(l => lessonProgress[l.id]?.completed).length;
    const progressPercent = Math.round((completedCount / lessons.filter(l => l.hasContent).length) * 100) || 0;

    const featuredLesson = lessons.find(l => l.hasContent && !lessonProgress[l.id]?.completed && getLessonProgress(l.id) > 0) 
        || lessons.find(l => l.hasContent && !lessonProgress[l.id]?.completed) 
        || lessons[0];

    const getDifficultyClass = (difficulty) => {
        switch (difficulty.toLowerCase()) {
            case 'beginner': return styles.beginner;
            case 'intermediate': return styles.intermediate;
            case 'advanced': return styles.advanced;
            default: return styles.beginner;
        }
    };

    const handleLessonClick = (lesson) => {
        if (lesson.hasContent) {
            setSelectedLessonId(lesson.id);
        }
    };

    const handleBackToLessons = (lessonId, progressData) => {
        if (progressData) {
            setLessonProgress(prev => ({
                ...prev,
                [lessonId]: progressData
            }));
        }
        setSelectedLessonId(null);
    };

    // Get current lesson title for chat context
    const getCurrentLessonTitle = () => {
        if (selectedLessonId) {
            const lesson = lessons.find(l => l.id === selectedLessonId);
            return lesson?.title || null;
        }
        return null;
    };

    if (selectedLessonId) {
        const savedProgress = lessonProgress[selectedLessonId];
        return (
            <>
                <LessonDetailView 
                    lessonId={selectedLessonId} 
                    onBack={handleBackToLessons}
                    initialProgress={savedProgress}
                />
                <ChatWidget currentLesson={getCurrentLessonTitle()} />
            </>
        );
    }

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
                <div 
                    className={`${styles.featuredCard} ${featuredLesson.hasContent ? styles.clickable : ''}`}
                    onClick={() => handleLessonClick(featuredLesson)}
                >
                    <div className={styles.featuredIcon}>
                        <featuredLesson.icon size={48} />
                    </div>
                    <div className={styles.featuredContent}>
                        <span className={styles.featuredLabel}>
                            {getLessonProgress(featuredLesson.id) > 0 ? 'CONTINUE LEARNING' : 'START LEARNING'}
                        </span>
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
                            {getLessonProgress(featuredLesson.id) > 0 && (
                                <span className={styles.progressBadge}>
                                    {getLessonProgress(featuredLesson.id)}% complete
                                </span>
                            )}
                        </div>
                    </div>
                    <button className={styles.startButton}>
                        {getLessonProgress(featuredLesson.id) > 0 ? 'Continue' : 'Start'} Lesson
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
                    const progress = getLessonProgress(lesson.id);
                    const isCompleted = lessonProgress[lesson.id]?.completed;
                    
                    return (
                        <div 
                            key={lesson.id} 
                            className={`${styles.lessonCard} ${lesson.hasContent ? styles.clickable : styles.comingSoon}`}
                            onClick={() => handleLessonClick(lesson)}
                        >
                            <div className={styles.lessonHeader}>
                                <div className={styles.lessonIcon}>
                                    <IconComponent size={32} />
                                </div>
                                {isCompleted && (
                                    <div className={styles.completedBadge}>
                                        <CheckCircle size={16} />
                                    </div>
                                )}
                                {!lesson.hasContent && !isCompleted && (
                                    <div className={styles.comingSoonBadge}>Coming Soon</div>
                                )}
                                {progress > 0 && progress < 100 && (
                                    <div className={styles.progressBadgeCorner}>{progress}%</div>
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
                            {progress > 0 && progress < 100 && (
                                <div className={styles.progressBar}>
                                    <div
                                        className={styles.progressFill}
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            )}
                            <button 
                                className={styles.lessonButton}
                                disabled={!lesson.hasContent}
                            >
                                {isCompleted ? 'Review' : progress > 0 ? 'Continue' : lesson.hasContent ? 'Start' : 'Coming Soon'}
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Chat Widget */}
            <ChatWidget currentLesson={null} />
        </div>
    );
};

export default LearnView;
