import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import MarketsView from './views/MarketsView';
import LearnView from './views/LearnView';
import AIAdvisorView from './views/AIAdvisorView';
import GoalsView from './views/GoalsView';
import PortfolioView from './views/PortfolioView';
import Profile from './views/Profile';
import BottomNav from './components/BottomNav';
import './styles/global.css';

function App() {
    const [activeView, setActiveView] = useState('home');

    const renderView = () => {
        switch (activeView) {
            case 'home':
                return <Dashboard onNavigate={setActiveView} />;
            case 'markets':
                return <MarketsView />;
            case 'learn':
                return <LearnView />;
            case 'advisor':
                return <AIAdvisorView />;
            case 'goals':
                return <GoalsView />;
            case 'portfolio':
                return <PortfolioView />;
            case 'profile':
                return <Profile onNavigate={setActiveView} />;
            default:
                return <Dashboard onNavigate={setActiveView} />;
        }
    };

    return (
        <ThemeProvider>
            <div className="app-container">
                <Header onNavigate={setActiveView} />
                {renderView()}
                <BottomNav activeView={activeView} onNavigate={setActiveView} />
            </div>
        </ThemeProvider>
    );
}

export default App;
