import PortfolioCard from '../PortfolioCard';
import GoalCard from '../GoalCard';
import HoldingsList from '../HoldingsList';
import styles from './Dashboard.module.css';

const Dashboard = ({ onNavigate }) => {
    return (
        <main className={styles.main}>
            <PortfolioCard />
            
            <div className={styles.bottomSection}>
                <GoalCard onNavigate={onNavigate} />
                <HoldingsList onNavigate={onNavigate} />
            </div>
        </main>
    );
};

export default Dashboard;
