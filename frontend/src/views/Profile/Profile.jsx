import styles from './Profile.module.css';
import React, { useState, useEffect } from 'react';
import { Shield, Scale, Rocket, ChevronRight, User, Lock, Bell, LogOut, Check } from 'lucide-react';
import ThemeToggle from '../../components/ThemeToggle';
import { portfolioService } from '../../services/portfolioService';

function Profile() {
  const userId = 1; // Hardcoded for demo
  
  const [riskProfile, setRiskProfile] = useState('moderate');
  const [userData, setUserData] = useState(null);
  const [portfolioSummary, setPortfolioSummary] = useState(null);
  const [topHoldings, setTopHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savingRisk, setSavingRisk] = useState(false);

  // Fetch all data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch user, summary, and positions (required)
        const [user, summary, positions] = await Promise.all([
          portfolioService.getUser(userId),
          portfolioService.getPortfolioSummary(userId),
          portfolioService.getAllPositions(userId)
        ]);

        setUserData({
          name: user.displayName,
          email: user.email,
          initials: user.displayName.split(' ').map(n => n[0]).join('').toUpperCase(),
          memberSince: new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        });

        setPortfolioSummary({
          totalValue: summary.totalValue,
          cashAvailable: summary.totalCash,
          totalGain: summary.totalGainLoss,
          totalGainPercent: summary.totalGainLossPercent,
          isPositive: summary.totalGainLoss >= 0
        });

        // Get top 3 holdings by value
        const sorted = [...positions]
          .sort((a, b) => (b.quantity * b.currentPrice) - (a.quantity * a.currentPrice))
          .slice(0, 3);
        setTopHoldings(sorted);

        // Try to fetch risk profile (optional)
        try {
          const risk = await portfolioService.getRiskProfile(userId);
          if (risk) {
            setRiskProfile(risk.riskLevel.toLowerCase());
          }
        } catch (riskError) {
          console.log('Risk profile not available, using default');
        }

      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // Handler to save risk profile
  const handleRiskChange = async (newRisk) => {
    setSavingRisk(true);
    try {
      await portfolioService.updateRiskProfile(userId, {
        riskLevel: newRisk.toUpperCase(),
        riskScore: newRisk === 'conservative' ? 3 : newRisk === 'moderate' ? 5 : 7
      });
      setRiskProfile(newRisk);
    } catch (err) {
      console.error('Error saving risk profile:', err);
      alert('Failed to save risk profile');
    } finally {
      setSavingRisk(false);
    }
  };

  const goals = [
    { title: 'House Down Payment', progress: 91, target: '$20,000', saved: '$18,234' },
    { title: 'Emergency Fund', progress: 65, target: '$10,000', saved: '$6,500' },
    { title: 'Retirement Savings', progress: 23, target: '$100,000', saved: '$23,000' }
  ];

  const riskProfiles = [
    {
      id: 'conservative',
      label: 'Conservative',
      icon: Shield,
      description: 'Lower risk, steady growth. Focus on bonds and stable stocks.',
      allocation: '70% Bonds, 30% Stocks'
    },
    {
      id: 'moderate',
      label: 'Moderate',
      icon: Scale,
      description: 'Balanced risk and reward. Diversified portfolio.',
      allocation: '50% Stocks, 40% Bonds, 10% Crypto'
    },
    {
      id: 'aggressive',
      label: 'Aggressive',
      icon: Rocket,
      description: 'Higher risk, higher potential returns. Growth-focused.',
      allocation: '80% Stocks, 15% Crypto, 5% Bonds'
    }
  ];

  if (loading) {
    return (
      <div className={styles.profileView}>
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.profileView}>
        <div className={styles.errorState}>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  if (!userData || !portfolioSummary) return null;

  return (
    <div className={styles.profileView}>
      {/* Left Column */}
      <div className={styles.leftColumn}>
        {/* User Info Card */}
        <div className={styles.card}>
          <div className={styles.userInfo}>
            <div className={styles.avatarLarge}>{userData.initials}</div>
            <h2>{userData.name}</h2>
            <p className={styles.email}>{userData.email}</p>
            <p className={styles.memberSince}>Member since {userData.memberSince}</p>
          </div>
        </div>

        {/* Portfolio Summary Card */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Portfolio Summary</h3>
          <div className={styles.portfolioStats}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Total Value</span>
              <span className={styles.statValue}>{portfolioService.formatCurrency(portfolioSummary.totalValue)}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Cash Available</span>
              <span className={styles.statValue}>{portfolioService.formatCurrency(portfolioSummary.cashAvailable)}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Total Gain/Loss</span>
              <div className={styles.gainLoss}>
                <span className={`${styles.statValue} ${portfolioSummary.isPositive ? styles.positive : styles.negative}`}>
                  {portfolioService.formatCurrency(portfolioSummary.totalGain)}
                </span>
                <span className={`${styles.percentage} ${portfolioSummary.isPositive ? styles.positive : styles.negative}`}>
                  {portfolioService.formatPercent(portfolioSummary.totalGainPercent)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Holdings Card */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Top Holdings</h3>
          {topHoldings.length > 0 ? (
            <div className={styles.topHoldings}>
              {topHoldings.map((holding, index) => {
                const value = holding.quantity * holding.currentPrice;
                const gainLoss = value - (holding.quantity * holding.averageBuyPrice);
                const isPositive = gainLoss >= 0;
                
                return (
                  <div key={index} className={styles.holdingRow}>
                    <div className={styles.holdingInfo}>
                      <span className={styles.holdingSymbol}>{holding.symbol}</span>
                      <span className={styles.holdingName}>{holding.name}</span>
                    </div>
                    <div className={styles.holdingValue}>
                      <span className={styles.holdingAmount}>{portfolioService.formatCurrency(value)}</span>
                      <span className={`${styles.holdingGain} ${isPositive ? styles.positive : styles.negative}`}>
                        {portfolioService.formatCurrency(Math.abs(gainLoss))} ({portfolioService.formatPercent((gainLoss / (holding.quantity * holding.averageBuyPrice)) * 100)})
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className={styles.noHoldings}>No holdings yet. Start investing!</p>
          )}
        </div>

        {/* Goals Overview Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Your Goals</h3>
            <a href="#" className={styles.viewAll}>View All →</a>
          </div>
          <div className={styles.goalsList}>
            {goals.map((goal, index) => (
              <div key={index} className={styles.goalItem}>
                <div className={styles.goalHeader}>
                  <span className={styles.goalTitle}>{goal.title}</span>
                  <span className={styles.goalProgress}>{goal.progress}%</span>
                </div>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill} 
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
                <div className={styles.goalMeta}>
                  <span>{goal.saved} saved</span>
                  <span>Target: {goal.target}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className={styles.rightColumn}>
        {/* Risk Profile Card */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Risk Profile</h3>
          <p className={styles.cardDescription}>
            Choose your investment style based on your risk tolerance and goals.
          </p>
          
          <div className={styles.riskProfiles}>
            {riskProfiles.map((profile) => {
              const IconComponent = profile.icon;
              return (
                <div
                  key={profile.id}
                  className={`${styles.riskOption} ${riskProfile === profile.id ? styles.selected : ''} ${savingRisk ? styles.disabled : ''}`}
                  onClick={() => !savingRisk && handleRiskChange(profile.id)}
                >
                  <div className={styles.riskHeader}>
                    <IconComponent size={20} className={styles.riskIcon} />
                    <span className={styles.riskLabel}>{profile.label}</span>
                    {riskProfile === profile.id && (
                      <Check size={18} className={styles.checkmark} />
                    )}
                  </div>
                  <p className={styles.riskDescription}>{profile.description}</p>
                  <p className={styles.riskAllocation}>{profile.allocation}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Account Settings Card */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Account Settings</h3>
          <div className={styles.settingsList}>
            <button className={styles.settingButton}>
              <span className={styles.settingContent}>
                <User size={18} className={styles.settingIcon} />
                Edit Profile
              </span>
              <ChevronRight size={18} />
            </button>
            <button className={styles.settingButton}>
              <span className={styles.settingContent}>
                <Lock size={18} className={styles.settingIcon} />
                Change Password
              </span>
              <ChevronRight size={18} />
            </button>
            <button className={styles.settingButton}>
              <span className={styles.settingContent}>
                <Bell size={18} className={styles.settingIcon} />
                Notification Preferences
              </span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Preferences Card */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Preferences</h3>
          <div className={styles.preferenceItem}>
            <div className={styles.preferenceInfo}>
              <span className={styles.preferenceLabel}>Dark Mode</span>
              <span className={styles.preferenceDescription}>Toggle between light and dark themes</span>
            </div>
            <ThemeToggle />
          </div>
        </div>

        {/* Logout Button */}
        <button className={styles.logoutButton}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default Profile;