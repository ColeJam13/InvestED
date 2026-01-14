import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import MarketsView from './views/MarketsView';
import LearnView from './views/LearnView';
import Profile from './views/Profile';
import AIAdvisorView from './views/AIAdvisorView';
import BottomNav from './components/BottomNav';
import './styles/global.css';

function App() {
    const [activeView, setActiveView] = useState('home');

    const renderView = () => {
        switch (activeView) {
            case 'home':
                return <Dashboard />;
            case 'markets':
                return <MarketsView />;
            case 'learn':
                return <LearnView />;
            case 'advisor':
                return <AIAdvisorView />;
            case 'profile':
                return <Profile />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <ThemeProvider>
            <div className="app-container">
                <Header />
                {renderView()}
                <BottomNav activeView={activeView} onNavigate={setActiveView} />
            </div>
        </ThemeProvider>
    );
}

// Placeholder for views not yet built
const ComingSoon = ({ title, icon }) => (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'calc(100vh - 180px)',
        color: 'var(--text-muted)',
        textAlign: 'center',
        padding: '2rem'
    }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{icon}</div>
        <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{title}</h2>
        <p>Coming soon...</p>
    </div>
);

export default App;
