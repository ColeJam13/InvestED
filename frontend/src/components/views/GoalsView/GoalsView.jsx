import { useState } from 'react';
import styles from './GoalsView.module.css';

const GoalsView = () => {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [filter, setFilter] = useState('all');

    // Mock goals data (would come from API)
    const [goals, setGoals] = useState([
        {
            id: 1,
            title: 'House Down Payment',
            description: 'Save for a down payment on our first home',
            targetAmount: 20000,
            currentAmount: 18234,
            deadline: '2026-12-31',
            category: 'savings',
            icon: '🏠',
            color: '#7C3AED',
            monthlyContribution: 500,
            createdAt: '2024-01-15',
        },
        {
            id: 2,
            title: 'Emergency Fund',
            description: '6 months of living expenses for financial security',
            targetAmount: 15000,
            currentAmount: 12500,
            deadline: '2025-06-30',
            category: 'emergency',
            icon: '🛡️',
            color: '#059669',
            monthlyContribution: 400,
            createdAt: '2024-02-01',
        },
        {
            id: 3,
            title: 'Vacation to Japan',
            description: 'Dream trip to Tokyo and Kyoto',
            targetAmount: 5000,
            currentAmount: 1250,
            deadline: '2025-09-15',
            category: 'travel',
            icon: '✈️',
            color: '#EA580C',
            monthlyContribution: 200,
            createdAt: '2024-06-01',
        },
        {
            id: 4,
            title: 'New Car Fund',
            description: 'Reliable vehicle for commuting',
            targetAmount: 25000,
            currentAmount: 8500,
            deadline: '2027-03-01',
            category: 'purchase',
            icon: '🚗',
            color: '#2563EB',
            monthlyContribution: 350,
            createdAt: '2024-03-15',
        },
        {
            id: 5,
            title: 'Investment Portfolio',
            description: 'Build long-term wealth through diversified investments',
            targetAmount: 50000,
            currentAmount: 22000,
            deadline: '2028-12-31',
            category: 'investment',
            icon: '📈',
            color: '#DC2626',
            monthlyContribution: 600,
            createdAt: '2023-06-01',
        },
    ]);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        targetAmount: '',
        currentAmount: '',
        deadline: '',
        category: 'savings',
        monthlyContribution: '',
    });

    const categories = [
        { id: 'all', label: 'All Goals', icon: '📋' },
        { id: 'savings', label: 'Savings', icon: '💰' },
        { id: 'emergency', label: 'Emergency', icon: '🛡️' },
        { id: 'investment', label: 'Investment', icon: '📈' },
        { id: 'travel', label: 'Travel', icon: '✈️' },
        { id: 'purchase', label: 'Purchase', icon: '🛒' },
    ];

    const categoryIcons = {
        savings: '💰',
        emergency: '🛡️',
        investment: '📈',
        travel: '✈️',
        purchase: '🛒',
    };

    const categoryColors = {
        savings: '#7C3AED',
        emergency: '#059669',
        investment: '#DC2626',
        travel: '#EA580C',
        purchase: '#2563EB',
    };

    const filteredGoals = filter === 'all' 
        ? goals 
        : goals.filter(g => g.category === filter);

    const calculateProgress = (current, target) => {
        return Math.min(Math.round((current / target) * 100), 100);
    };

    const calculateTimeRemaining = (deadline) => {
        const now = new Date();
        const end = new Date(deadline);
        const diff = end - now;
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        
        if (days < 0) return 'Overdue';
        if (days === 0) return 'Due today';
        if (days === 1) return '1 day left';
        if (days < 30) return `${days} days left`;
        if (days < 365) return `${Math.floor(days / 30)} months left`;
        return `${Math.floor(days / 365)} years left`;
    };

    const calculateProjectedCompletion = (goal) => {
        const remaining = goal.targetAmount - goal.currentAmount;
        if (remaining <= 0) return 'Completed!';
        if (goal.monthlyContribution <= 0) return 'No contributions set';
        const monthsNeeded = Math.ceil(remaining / goal.monthlyContribution);
        const completionDate = new Date();
        completionDate.setMonth(completionDate.getMonth() + monthsNeeded);
        return completionDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    const getProgressStatus = (progress, deadline) => {
        const timeRemaining = calculateTimeRemaining(deadline);
        if (progress >= 100) return { status: 'completed', label: 'Completed', color: '#059669' };
        if (timeRemaining === 'Overdue') return { status: 'overdue', label: 'Overdue', color: '#DC2626' };
        if (progress >= 75) return { status: 'on-track', label: 'On Track', color: '#059669' };
        if (progress >= 50) return { status: 'progressing', label: 'Progressing', color: '#F59E0B' };
        return { status: 'starting', label: 'Just Started', color: '#6B7280' };
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCreateGoal = (e) => {
        e.preventDefault();
        
        const newGoal = {
            id: Date.now(),
            title: formData.title,
            description: formData.description,
            targetAmount: parseFloat(formData.targetAmount),
            currentAmount: parseFloat(formData.currentAmount) || 0,
            deadline: formData.deadline,
            category: formData.category,
            icon: categoryIcons[formData.category],
            color: categoryColors[formData.category],
            monthlyContribution: parseFloat(formData.monthlyContribution) || 0,
            createdAt: new Date().toISOString().split('T')[0],
        };

        setGoals(prev => [newGoal, ...prev]);
        setFormData({
            title: '',
            description: '',
            targetAmount: '',
            currentAmount: '',
            deadline: '',
            category: 'savings',
            monthlyContribution: '',
        });
        setShowCreateForm(false);
    };

    const handleDeleteGoal = (goalId) => {
        setGoals(prev => prev.filter(g => g.id !== goalId));
        setSelectedGoal(null);
    };

    // Calculate totals
    const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
    const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
    const overallProgress = calculateProgress(totalSaved, totalTarget);

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>Financial Goals</h1>
                    <p className={styles.subtitle}>Track your progress towards financial freedom</p>
                </div>
                <button 
                    className={styles.createButton}
                    onClick={() => setShowCreateForm(true)}
                >
                    + New Goal
                </button>
            </div>

            {/* Summary Cards */}
            <div className={styles.summaryCards}>
                <div className={styles.summaryCard}>
                    <div className={styles.summaryIcon}>🎯</div>
                    <div className={styles.summaryInfo}>
                        <span className={styles.summaryLabel}>Total Goals</span>
                        <span className={styles.summaryValue}>{goals.length}</span>
                    </div>
                </div>
                <div className={styles.summaryCard}>
                    <div className={styles.summaryIcon}>💰</div>
                    <div className={styles.summaryInfo}>
                        <span className={styles.summaryLabel}>Total Saved</span>
                        <span className={styles.summaryValue}>{formatCurrency(totalSaved)}</span>
                    </div>
                </div>
                <div className={styles.summaryCard}>
                    <div className={styles.summaryIcon}>📊</div>
                    <div className={styles.summaryInfo}>
                        <span className={styles.summaryLabel}>Overall Progress</span>
                        <span className={styles.summaryValue}>{overallProgress}%</span>
                    </div>
                </div>
                <div className={styles.summaryCard}>
                    <div className={styles.summaryIcon}>🏁</div>
                    <div className={styles.summaryInfo}>
                        <span className={styles.summaryLabel}>Target Total</span>
                        <span className={styles.summaryValue}>{formatCurrency(totalTarget)}</span>
                    </div>
                </div>
            </div>

            {/* Category Filters */}
            <div className={styles.filters}>
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        className={`${styles.filterBtn} ${filter === cat.id ? styles.active : ''}`}
                        onClick={() => setFilter(cat.id)}
                    >
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                    </button>
                ))}
            </div>

            {/* Goals List */}
            <div className={styles.goalsGrid}>
                {filteredGoals.map((goal) => {
                    const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
                    const status = getProgressStatus(progress, goal.deadline);
                    
                    return (
                        <div 
                            key={goal.id} 
                            className={styles.goalCard}
                            onClick={() => setSelectedGoal(goal)}
                            style={{ '--goal-color': goal.color }}
                        >
                            <div className={styles.goalHeader}>
                                <div className={styles.goalIcon}>{goal.icon}</div>
                                <div 
                                    className={styles.goalStatus}
                                    style={{ backgroundColor: `${status.color}20`, color: status.color }}
                                >
                                    {status.label}
                                </div>
                            </div>
                            
                            <h3 className={styles.goalTitle}>{goal.title}</h3>
                            <p className={styles.goalDescription}>{goal.description}</p>
                            
                            <div className={styles.goalProgress}>
                                <div className={styles.progressHeader}>
                                    <span className={styles.progressAmount}>
                                        {formatCurrency(goal.currentAmount)}
                                    </span>
                                    <span className={styles.progressTarget}>
                                        of {formatCurrency(goal.targetAmount)}
                                    </span>
                                </div>
                                <div className={styles.progressBar}>
                                    <div 
                                        className={styles.progressFill}
                                        style={{ 
                                            width: `${progress}%`,
                                            backgroundColor: goal.color 
                                        }}
                                    ></div>
                                </div>
                                <div className={styles.progressFooter}>
                                    <span>{progress}% complete</span>
                                    <span>{calculateTimeRemaining(goal.deadline)}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredGoals.length === 0 && (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>🎯</div>
                    <h3>No goals found</h3>
                    <p>Create your first goal to start tracking your progress</p>
                    <button 
                        className={styles.createButton}
                        onClick={() => setShowCreateForm(true)}
                    >
                        + Create Goal
                    </button>
                </div>
            )}

            {/* Goal Creation Modal */}
            {showCreateForm && (
                <div className={styles.modalOverlay} onClick={() => setShowCreateForm(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Create New Goal</h2>
                            <button 
                                className={styles.closeBtn}
                                onClick={() => setShowCreateForm(false)}
                            >
                                ×
                            </button>
                        </div>
                        
                        <form onSubmit={handleCreateGoal} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label>Goal Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Emergency Fund"
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="What is this goal for?"
                                    rows={3}
                                />
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Target Amount *</label>
                                    <input
                                        type="number"
                                        name="targetAmount"
                                        value={formData.targetAmount}
                                        onChange={handleInputChange}
                                        placeholder="$10,000"
                                        min="1"
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Current Amount</label>
                                    <input
                                        type="number"
                                        name="currentAmount"
                                        value={formData.currentAmount}
                                        onChange={handleInputChange}
                                        placeholder="$0"
                                        min="0"
                                    />
                                </div>
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Target Date *</label>
                                    <input
                                        type="date"
                                        name="deadline"
                                        value={formData.deadline}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Monthly Contribution</label>
                                    <input
                                        type="number"
                                        name="monthlyContribution"
                                        value={formData.monthlyContribution}
                                        onChange={handleInputChange}
                                        placeholder="$500"
                                        min="0"
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Category *</label>
                                <div className={styles.categorySelect}>
                                    {Object.entries(categoryIcons).map(([key, icon]) => (
                                        <button
                                            key={key}
                                            type="button"
                                            className={`${styles.categoryOption} ${formData.category === key ? styles.selected : ''}`}
                                            onClick={() => setFormData(prev => ({ ...prev, category: key }))}
                                            style={{ '--cat-color': categoryColors[key] }}
                                        >
                                            <span>{icon}</span>
                                            <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.formActions}>
                                <button 
                                    type="button" 
                                    className={styles.cancelBtn}
                                    onClick={() => setShowCreateForm(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className={styles.submitBtn}>
                                    Create Goal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Goal Details Modal */}
            {selectedGoal && (
                <div className={styles.modalOverlay} onClick={() => setSelectedGoal(null)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div 
                            className={styles.detailsHeader}
                            style={{ background: `linear-gradient(135deg, ${selectedGoal.color}20, ${selectedGoal.color}10)` }}
                        >
                            <div className={styles.detailsIcon}>{selectedGoal.icon}</div>
                            <div className={styles.detailsTitle}>
                                <h2>{selectedGoal.title}</h2>
                                <p>{selectedGoal.description}</p>
                            </div>
                            <button 
                                className={styles.closeBtn}
                                onClick={() => setSelectedGoal(null)}
                            >
                                ×
                            </button>
                        </div>

                        <div className={styles.detailsContent}>
                            {/* Large Progress Circle */}
                            <div className={styles.progressCircleContainer}>
                                <div className={styles.progressCircle}>
                                    <svg viewBox="0 0 100 100">
                                        <circle
                                            className={styles.progressBg}
                                            cx="50"
                                            cy="50"
                                            r="45"
                                        />
                                        <circle
                                            className={styles.progressValue}
                                            cx="50"
                                            cy="50"
                                            r="45"
                                            style={{
                                                strokeDasharray: `${calculateProgress(selectedGoal.currentAmount, selectedGoal.targetAmount) * 2.83} 283`,
                                                stroke: selectedGoal.color
                                            }}
                                        />
                                    </svg>
                                    <div className={styles.progressText}>
                                        <span className={styles.progressPercent}>
                                            {calculateProgress(selectedGoal.currentAmount, selectedGoal.targetAmount)}%
                                        </span>
                                        <span className={styles.progressLabel}>Complete</span>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className={styles.statsGrid}>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>Current</span>
                                    <span className={styles.statValue} style={{ color: selectedGoal.color }}>
                                        {formatCurrency(selectedGoal.currentAmount)}
                                    </span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>Target</span>
                                    <span className={styles.statValue}>
                                        {formatCurrency(selectedGoal.targetAmount)}
                                    </span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>Remaining</span>
                                    <span className={styles.statValue}>
                                        {formatCurrency(selectedGoal.targetAmount - selectedGoal.currentAmount)}
                                    </span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>Monthly</span>
                                    <span className={styles.statValue}>
                                        {formatCurrency(selectedGoal.monthlyContribution)}
                                    </span>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className={styles.timeline}>
                                <div className={styles.timelineItem}>
                                    <span className={styles.timelineIcon}>📅</span>
                                    <div className={styles.timelineInfo}>
                                        <span className={styles.timelineLabel}>Target Date</span>
                                        <span className={styles.timelineValue}>{formatDate(selectedGoal.deadline)}</span>
                                    </div>
                                </div>
                                <div className={styles.timelineItem}>
                                    <span className={styles.timelineIcon}>⏱️</span>
                                    <div className={styles.timelineInfo}>
                                        <span className={styles.timelineLabel}>Time Remaining</span>
                                        <span className={styles.timelineValue}>{calculateTimeRemaining(selectedGoal.deadline)}</span>
                                    </div>
                                </div>
                                <div className={styles.timelineItem}>
                                    <span className={styles.timelineIcon}>🎯</span>
                                    <div className={styles.timelineInfo}>
                                        <span className={styles.timelineLabel}>Projected Completion</span>
                                        <span className={styles.timelineValue}>{calculateProjectedCompletion(selectedGoal)}</span>
                                    </div>
                                </div>
                                <div className={styles.timelineItem}>
                                    <span className={styles.timelineIcon}>🗓️</span>
                                    <div className={styles.timelineInfo}>
                                        <span className={styles.timelineLabel}>Created</span>
                                        <span className={styles.timelineValue}>{formatDate(selectedGoal.createdAt)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className={styles.detailsActions}>
                                <button className={styles.editBtn}>
                                    ✏️ Edit Goal
                                </button>
                                <button className={styles.contributeBtn} style={{ backgroundColor: selectedGoal.color }}>
                                    💰 Add Contribution
                                </button>
                                <button 
                                    className={styles.deleteBtn}
                                    onClick={() => handleDeleteGoal(selectedGoal.id)}
                                >
                                    🗑️ Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GoalsView;
