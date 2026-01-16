import { Target } from 'lucide-react';
import styles from './GoalCard.module.css';

const GoalCard = ({ onNavigate }) => {
    const goal = {
        title: 'House Down Payment',
        target: '$20,000',
        deadline: 'December 2026',
        saved: '$18,234',
        percentage: 91,
    };

    const handleViewAll = (e) => {
        e.preventDefault();
        if (onNavigate) {
            onNavigate('goals');
        }
    };

    return (
        <div className={styles.section}>
            <div className={styles.sectionHeader}>
                <div className={styles.sectionTitle}>
                    <Target size={20} className={styles.icon} />
                    Featured Goal
                </div>
                <a href="#" className={styles.viewAll} onClick={handleViewAll}>View All →</a>
            </div>
            
            <div className={styles.goalCard}>
                <div className={styles.goalTitle}>{goal.title}</div>
                <div className={styles.goalTarget}>
                    Target: {goal.target} by {goal.deadline}
                </div>
                
                <div className={styles.progressBar}>
                    <div 
                        className={styles.progressFill} 
                        style={{ width: `${goal.percentage}%` }}
                    ></div>
                </div>
                
                <div className={styles.goalStatus}>
                    <span>{goal.saved} saved • {goal.percentage}% on track</span>
                    <span className={styles.checkIcon}>✓</span>
                </div>
            </div>
        </div>
    );
};

export default GoalCard;
