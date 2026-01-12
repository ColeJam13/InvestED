import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import BottomNav from './components/BottomNav';
import './styles/global.css';

function App() {
    return (
        <ThemeProvider>
            <div className="app-container">
                <Header />
                <Dashboard />
                <BottomNav />
            </div>
        </ThemeProvider>
    );
}

export default App;
