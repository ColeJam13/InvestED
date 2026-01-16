import { useState } from 'react';
import { Target, Shield, Plane, Car, TrendingUp, DollarSign, BarChart3, Flag, Calendar, Clock, CheckCircle, Edit3, Trash2, PlusCircle, Home, ShoppingCart, List, Lightbulb, Rocket, Building2, Landmark } from 'lucide-react';
import styles from './GoalsView.module.css';

const GoalsView = () => {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [editingGoal, setEditingGoal] = useState(null);
    const [showContributeModal, setShowContributeModal] = useState(false);
    const [contributionAmount, setContributionAmount] = useState('');
    const [filter, setFilter] = useState('all');

    const categoryConfig = {
        savings: { icon: DollarSign, color: '#7C3AED' },
        emergency: { icon: Shield, color: '#059669' },
        investment: { icon: TrendingUp, color: '#DC2626' },
        travel: { icon: Plane, color: '#EA580C' },
        purchase: { icon: ShoppingCart, color: '#2563EB' },
    };

    const [goals, setGoals] = useState([
        {
            id: 1,
            title: 'House Down Payment',
            description: 'Save for a down payment on our first home',
            targetAmount: 20000,
            currentAmount: 18234,
            deadline: '2026-12-31',
            category: 'savings',
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
            monthlyContribution: 600,
            createdAt: '2023-06-01',
        },
    ]);

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
        { id: 'all', label: 'All Goals', icon: List },
        { id: 'savings', label: 'Savings', icon: DollarSign },
        { id: 'emergency', label: 'Emergency', icon: Shield },
        { id: 'investment', label: 'Investment', icon: TrendingUp },
        { id: 'travel', label: 'Travel', icon: Plane },
        { id: 'purchase', label: 'Purchase', icon: ShoppingCart },
    ];

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

    const parseNumber = (value) => {
        if (!value) return 0;
        const cleaned = value.toString().replace(/[,\s$]/g, '');
        const num = parseFloat(cleaned);
        return isNaN(num) ? 0 : num;
    };

    const formatNumberInput = (value) => {
        if (!value) return '';
        const cleaned = value.replace(/[^0-9.]/g, '');
        const parts = cleaned.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return parts.join('.');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (['targetAmount', 'currentAmount', 'monthlyContribution'].includes(name)) {
            setFormData(prev => ({ ...prev, [name]: formatNumberInput(value) }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleCreateGoal = (e) => {
        e.preventDefault();
        const newGoal = {
            id: Date.now(),
            title: formData.title,
            description: formData.description,
            targetAmount: parseNumber(formData.targetAmount),
            currentAmount: parseNumber(formData.currentAmount),
            deadline: formData.deadline,
            category: formData.category,
            monthlyContribution: parseNumber(formData.monthlyContribution),
            createdAt: new Date().toISOString().split('T')[0],
        };
        setGoals(prev => [newGoal, ...prev]);
        resetForm();
        setShowCreateForm(false);
    };

    const handleEditGoal = (e) => {
        e.preventDefault();
        setGoals(prev => prev.map(g => {
            if (g.id === editingGoal.id) {
                return {
                    ...g,
                    title: formData.title,
                    description: formData.description,
                    targetAmount: parseNumber(formData.targetAmount),
                    currentAmount: parseNumber(formData.currentAmount),
                    deadline: formData.deadline,
                    category: formData.category,
                    monthlyContribution: parseNumber(formData.monthlyContribution),
                };
            }
            return g;
        }));
        if (selectedGoal && selectedGoal.id === editingGoal.id) {
            setSelectedGoal({
                ...selectedGoal,
                title: formData.title,
                description: formData.description,
                targetAmount: parseNumber(formData.targetAmount),
                currentAmount: parseNumber(formData.currentAmount),
                deadline: formData.deadline,
                category: formData.category,
                monthlyContribution: parseNumber(formData.monthlyContribution),
            });
        }
        resetForm();
        setEditingGoal(null);
    };

    const handleDeleteGoal = (goalId) => {
        setGoals(prev => prev.filter(g => g.id !== goalId));
        setSelectedGoal(null);
    };

    const handleAddContribution = (e) => {
        e.preventDefault();
        const amount = parseNumber(contributionAmount);
        if (amount > 0 && selectedGoal) {
            setGoals(prev => prev.map(g => {
                if (g.id === selectedGoal.id) {
                    return { ...g, currentAmount: g.currentAmount + amount };
                }
                return g;
            }));
            setSelectedGoal(prev => ({
                ...prev,
                currentAmount: prev.currentAmount + amount
            }));
            setContributionAmount('');
            setShowContributeModal(false);
        }
    };

    const openEditModal = (goal) => {
        setFormData({
            title: goal.title,
            description: goal.description,
            targetAmount: goal.targetAmount.toLocaleString(),
            currentAmount: goal.currentAmount.toLocaleString(),
            deadline: goal.deadline,
            category: goal.category,
            monthlyContribution: goal.monthlyContribution.toLocaleString(),
        });
        setEditingGoal(goal);
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            targetAmount: '',
            currentAmount: '',
            deadline: '',
            category: 'savings',
            monthlyContribution: '',
        });
    };

    const getAISuggestions = (goal) => {
        const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
        const remaining = goal.targetAmount - goal.currentAmount;
        const monthsLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24 * 30));
        const requiredMonthly = monthsLeft > 0 ? remaining / monthsLeft : remaining;
        
        const suggestions = [];
        
        if (progress < 25) {
            suggestions.push({
                icon: Rocket,
                title: 'Boost Your Start',
                description: `You're just getting started! Consider setting up automatic transfers of ${formatCurrency(Math.ceil(requiredMonthly / 4))} weekly to build momentum.`
            });
        }
        
        if (goal.monthlyContribution < requiredMonthly) {
            suggestions.push({
                icon: TrendingUp,
                title: 'Increase Contributions',
                description: `To meet your deadline, consider increasing monthly contributions from ${formatCurrency(goal.monthlyContribution)} to ${formatCurrency(Math.ceil(requiredMonthly))}.`
            });
        }
        
        if (goal.category === 'savings' || goal.category === 'emergency') {
            suggestions.push({
                icon: Landmark,
                title: 'High-Yield Savings',
                description: 'Move funds to a high-yield savings account (4-5% APY) to earn interest while saving toward your goal.'
            });
        }
        
        if (goal.category === 'investment') {
            suggestions.push({
                icon: BarChart3,
                title: 'Dollar-Cost Averaging',
                description: 'Invest a fixed amount regularly regardless of market conditions to reduce timing risk and build wealth steadily.'
            });
        }
        
        if (goal.category === 'travel') {
            suggestions.push({
                icon: Plane,
                title: 'Travel Rewards',
                description: 'Consider using a travel rewards credit card for everyday purchases to earn points toward your trip.'
            });
        }
        
        if (goal.category === 'purchase') {
            suggestions.push({
                icon: Target,
                title: 'Price Tracking',
                description: 'Set up price alerts for your target purchase. Prices often drop during sales events or off-seasons.'
            });
        }
        
        if (progress >= 75) {
            suggestions.push({
                icon: Flag,
                title: 'Almost There!',
                description: `You're ${progress}% to your goal! Stay focused - consider a small spending freeze to cross the finish line faster.`
            });
        }
        
        suggestions.push({
            icon: Lightbulb,
            title: 'Side Income Boost',
            description: 'Explore side income opportunities like freelancing or selling unused items to accelerate your progress.'
        });
        
        return suggestions.slice(0, 3);
    };

    const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
    const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
    const overallProgress = calculateProgress(totalSaved, totalTarget);

    const getCategoryIcon = (category) => {
        const config = categoryConfig[category];
        return config ? config.icon : Target;
    };

    const getCategoryColor = (category) => {
        const config = categoryConfig[category];
        return config ? config.color : '#7C3AED';
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>Financial Goals</h1>
                    <p className={styles.subtitle}>Track your progress towards financial freedom</p>
                </div>
                <button className={styles.createButton} onClick={() => setShowCreateForm(true)}>
                    <PlusCircle size={20} /> New Goal
                </button>
            </div>

            <div className={styles.summaryCards}>
                <div className={styles.summaryCard}>
                    <div className={styles.summaryIcon}><Target size={24} /></div>
                    <div className={styles.summaryInfo}>
                        <span className={styles.summaryLabel}>Total Goals</span>
                        <span className={styles.summaryValue}>{goals.length}</span>
                    </div>
                </div>
                <div className={styles.summaryCard}>
                    <div className={styles.summaryIcon}><DollarSign size={24} /></div>
                    <div className={styles.summaryInfo}>
                        <span className={styles.summaryLabel}>Total Saved</span>
                        <span className={styles.summaryValue}>{formatCurrency(totalSaved)}</span>
                    </div>
                </div>
                <div className={styles.summaryCard}>
                    <div className={styles.summaryIcon}><BarChart3 size={24} /></div>
                    <div className={styles.summaryInfo}>
                        <span className={styles.summaryLabel}>Overall Progress</span>
                        <span className={styles.summaryValue}>{overallProgress}%</span>
                    </div>
                </div>
                <div className={styles.summaryCard}>
                    <div className={styles.summaryIcon}><Flag size={24} /></div>
                    <div className={styles.summaryInfo}>
                        <span className={styles.summaryLabel}>Target Total</span>
                        <span className={styles.summaryValue}>{formatCurrency(totalTarget)}</span>
                    </div>
                </div>
            </div>

            <div className={styles.filters}>
                {categories.map((cat) => {
                    const IconComponent = cat.icon;
                    return (
                        <button
                            key={cat.id}
                            className={`${styles.filterBtn} ${filter === cat.id ? styles.active : ''}`}
                            onClick={() => setFilter(cat.id)}
                        >
                            <IconComponent size={16} />
                            <span>{cat.label}</span>
                        </button>
                    );
                })}
            </div>

            <div className={styles.goalsGrid}>
                {filteredGoals.map((goal) => {
                    const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
                    const status = getProgressStatus(progress, goal.deadline);
                    const IconComponent = getCategoryIcon(goal.category);
                    const color = getCategoryColor(goal.category);
                    
                    return (
                        <div 
                            key={goal.id} 
                            className={styles.goalCard}
                            onClick={() => setSelectedGoal(goal)}
                            style={{ '--goal-color': color }}
                        >
                            <div className={styles.goalHeader}>
                                <div className={styles.goalIcon}><IconComponent size={24} /></div>
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
                                    <span className={styles.progressAmount}>{formatCurrency(goal.currentAmount)}</span>
                                    <span className={styles.progressTarget}>of {formatCurrency(goal.targetAmount)}</span>
                                </div>
                                <div className={styles.progressBar}>
                                    <div 
                                        className={styles.progressFill}
                                        style={{ width: `${progress}%`, backgroundColor: color }}
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
                    <Target size={64} className={styles.emptyIcon} />
                    <h3>No goals found</h3>
                    <p>Create your first goal to start tracking your progress</p>
                    <button className={styles.createButton} onClick={() => setShowCreateForm(true)}>
                        <PlusCircle size={20} /> Create Goal
                    </button>
                </div>
            )}

            {/* Create Goal Modal */}
            {showCreateForm && (
                <div className={styles.modalOverlay} onClick={() => setShowCreateForm(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Create New Goal</h2>
                            <button className={styles.closeBtn} onClick={() => setShowCreateForm(false)}>×</button>
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
                                        type="text"
                                        name="targetAmount"
                                        value={formData.targetAmount}
                                        onChange={handleInputChange}
                                        placeholder="10,000"
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Current Amount</label>
                                    <input
                                        type="text"
                                        name="currentAmount"
                                        value={formData.currentAmount}
                                        onChange={handleInputChange}
                                        placeholder="0"
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
                                        type="text"
                                        name="monthlyContribution"
                                        value={formData.monthlyContribution}
                                        onChange={handleInputChange}
                                        placeholder="500"
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Category *</label>
                                <div className={styles.categorySelect}>
                                    {Object.entries(categoryConfig).map(([key, config]) => {
                                        const IconComponent = config.icon;
                                        return (
                                            <button
                                                key={key}
                                                type="button"
                                                className={`${styles.categoryOption} ${formData.category === key ? styles.selected : ''}`}
                                                onClick={() => setFormData(prev => ({ ...prev, category: key }))}
                                                style={{ '--cat-color': config.color }}
                                            >
                                                <IconComponent size={18} />
                                                <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className={styles.formActions}>
                                <button type="button" className={styles.cancelBtn} onClick={() => { setShowCreateForm(false); resetForm(); }}>
                                    Cancel
                                </button>
                                <button type="submit" className={styles.submitBtn}>Create Goal</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Goal Modal */}
            {editingGoal && (
                <div className={styles.modalOverlay} onClick={() => { setEditingGoal(null); resetForm(); }}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Edit Goal</h2>
                            <button className={styles.closeBtn} onClick={() => { setEditingGoal(null); resetForm(); }}>×</button>
                        </div>
                        
                        <form onSubmit={handleEditGoal} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label>Goal Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={3}
                                />
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Target Amount *</label>
                                    <input
                                        type="text"
                                        name="targetAmount"
                                        value={formData.targetAmount}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Current Amount</label>
                                    <input
                                        type="text"
                                        name="currentAmount"
                                        value={formData.currentAmount}
                                        onChange={handleInputChange}
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
                                        type="text"
                                        name="monthlyContribution"
                                        value={formData.monthlyContribution}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Category *</label>
                                <div className={styles.categorySelect}>
                                    {Object.entries(categoryConfig).map(([key, config]) => {
                                        const IconComponent = config.icon;
                                        return (
                                            <button
                                                key={key}
                                                type="button"
                                                className={`${styles.categoryOption} ${formData.category === key ? styles.selected : ''}`}
                                                onClick={() => setFormData(prev => ({ ...prev, category: key }))}
                                                style={{ '--cat-color': config.color }}
                                            >
                                                <IconComponent size={18} />
                                                <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className={styles.formActions}>
                                <button type="button" className={styles.cancelBtn} onClick={() => { setEditingGoal(null); resetForm(); }}>
                                    Cancel
                                </button>
                                <button type="submit" className={styles.submitBtn}>Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Contribution Modal */}
            {showContributeModal && selectedGoal && (
                <div className={styles.modalOverlay} onClick={() => setShowContributeModal(false)}>
                    <div className={styles.modalSmall} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Add Contribution</h2>
                            <button className={styles.closeBtn} onClick={() => setShowContributeModal(false)}>×</button>
                        </div>
                        
                        <form onSubmit={handleAddContribution} className={styles.form}>
                            <div className={styles.contributeInfo}>
                                <p>Adding funds to <strong>{selectedGoal.title}</strong></p>
                                <p className={styles.contributeProgress}>
                                    Current: {formatCurrency(selectedGoal.currentAmount)} / {formatCurrency(selectedGoal.targetAmount)}
                                </p>
                            </div>
                            
                            <div className={styles.formGroup}>
                                <label>Amount to Add *</label>
                                <input
                                    type="text"
                                    value={contributionAmount}
                                    onChange={(e) => setContributionAmount(formatNumberInput(e.target.value))}
                                    placeholder="500"
                                    required
                                    autoFocus
                                />
                            </div>

                            <div className={styles.formActions}>
                                <button type="button" className={styles.cancelBtn} onClick={() => setShowContributeModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className={styles.submitBtn} style={{ backgroundColor: getCategoryColor(selectedGoal.category) }}>
                                    Add Funds
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Goal Details Modal */}
            {selectedGoal && !editingGoal && !showContributeModal && (
                <div className={styles.modalOverlay} onClick={() => setSelectedGoal(null)}>
                    <div className={styles.modalLarge} onClick={(e) => e.stopPropagation()}>
                        <div 
                            className={styles.detailsHeader}
                            style={{ background: `linear-gradient(135deg, ${getCategoryColor(selectedGoal.category)}20, ${getCategoryColor(selectedGoal.category)}10)` }}
                        >
                            <div className={styles.detailsIcon}>
                                {(() => {
                                    const IconComponent = getCategoryIcon(selectedGoal.category);
                                    return <IconComponent size={32} />;
                                })()}
                            </div>
                            <div className={styles.detailsTitle}>
                                <h2>{selectedGoal.title}</h2>
                                <p>{selectedGoal.description}</p>
                            </div>
                            <button className={styles.closeBtn} onClick={() => setSelectedGoal(null)}>×</button>
                        </div>

                        <div className={styles.detailsContent}>
                            <div className={styles.progressCircleContainer}>
                                <div className={styles.progressCircle}>
                                    <svg viewBox="0 0 100 100">
                                        <circle className={styles.progressBg} cx="50" cy="50" r="45" />
                                        <circle
                                            className={styles.progressValue}
                                            cx="50"
                                            cy="50"
                                            r="45"
                                            style={{
                                                strokeDasharray: `${calculateProgress(selectedGoal.currentAmount, selectedGoal.targetAmount) * 2.83} 283`,
                                                stroke: getCategoryColor(selectedGoal.category)
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

                            <div className={styles.statsGrid}>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>Current</span>
                                    <span className={styles.statValue} style={{ color: getCategoryColor(selectedGoal.category) }}>
                                        {formatCurrency(selectedGoal.currentAmount)}
                                    </span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>Target</span>
                                    <span className={styles.statValue}>{formatCurrency(selectedGoal.targetAmount)}</span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>Remaining</span>
                                    <span className={styles.statValue}>{formatCurrency(selectedGoal.targetAmount - selectedGoal.currentAmount)}</span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>Monthly</span>
                                    <span className={styles.statValue}>{formatCurrency(selectedGoal.monthlyContribution)}</span>
                                </div>
                            </div>

                            <div className={styles.timeline}>
                                <div className={styles.timelineItem}>
                                    <Calendar size={20} className={styles.timelineIcon} />
                                    <div className={styles.timelineInfo}>
                                        <span className={styles.timelineLabel}>Target Date</span>
                                        <span className={styles.timelineValue}>{formatDate(selectedGoal.deadline)}</span>
                                    </div>
                                </div>
                                <div className={styles.timelineItem}>
                                    <Clock size={20} className={styles.timelineIcon} />
                                    <div className={styles.timelineInfo}>
                                        <span className={styles.timelineLabel}>Time Remaining</span>
                                        <span className={styles.timelineValue}>{calculateTimeRemaining(selectedGoal.deadline)}</span>
                                    </div>
                                </div>
                                <div className={styles.timelineItem}>
                                    <Target size={20} className={styles.timelineIcon} />
                                    <div className={styles.timelineInfo}>
                                        <span className={styles.timelineLabel}>Projected Completion</span>
                                        <span className={styles.timelineValue}>{calculateProjectedCompletion(selectedGoal)}</span>
                                    </div>
                                </div>
                                <div className={styles.timelineItem}>
                                    <CheckCircle size={20} className={styles.timelineIcon} />
                                    <div className={styles.timelineInfo}>
                                        <span className={styles.timelineLabel}>Created</span>
                                        <span className={styles.timelineValue}>{formatDate(selectedGoal.createdAt)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* AI Suggestions */}
                            <div className={styles.aiSuggestions}>
                                <div className={styles.aiHeader}>
                                    <Lightbulb size={20} />
                                    <h3>AI Suggestions</h3>
                                </div>
                                <div className={styles.suggestionsList}>
                                    {getAISuggestions(selectedGoal).map((suggestion, idx) => {
                                        const SuggestionIcon = suggestion.icon;
                                        return (
                                            <div key={idx} className={styles.suggestionItem}>
                                                <SuggestionIcon size={24} className={styles.suggestionIcon} />
                                                <div className={styles.suggestionContent}>
                                                    <h4>{suggestion.title}</h4>
                                                    <p>{suggestion.description}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className={styles.detailsActions}>
                                <button className={styles.editBtn} onClick={() => openEditModal(selectedGoal)}>
                                    <Edit3 size={18} /> Edit Goal
                                </button>
                                <button 
                                    className={styles.contributeBtn} 
                                    style={{ backgroundColor: getCategoryColor(selectedGoal.category) }}
                                    onClick={() => setShowContributeModal(true)}
                                >
                                    <DollarSign size={18} /> Add Contribution
                                </button>
                                <button className={styles.deleteBtn} onClick={() => handleDeleteGoal(selectedGoal.id)}>
                                    <Trash2 size={18} /> Delete
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
