import styles from './Profile.module.css';
import React, { useState } from 'react';
import { Shield, Scale, Rocket, ChevronRight, User, Lock, Bell, LogOut, Check } from 'lucide-react';
import ThemeToggle from '../../components/ThemeToggle';

function Profile() {
  const [riskProfile, setRiskProfile] = useState('moderate');
  
  const userData = {
    name: 'Jordan Mitchell',
    email: 'jordan.mitchell@email.com',
    initials: 'JM',
    memberSince: 'January 2025',
    portfolioValue: '$50,243.89',
    cashAvailable: '$5,000.00',
    totalGain: '+$4,123.45',
    totalGainPercent: '+8.92%',
    isPositive: true
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
              <span className={styles.statValue}>{userData.portfolioValue}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Cash Available</span>
              <span className={styles.statValue}>{userData.cashAvailable}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Total Gain/Loss</span>
              <div className={styles.gainLoss}>
                <span className={`${styles.statValue} ${userData.isPositive ? styles.positive : styles.negative}`}>
                  {userData.totalGain}
                </span>
                <span className={`${styles.percentage} ${userData.isPositive ? styles.positive : styles.negative}`}>
                  {userData.totalGainPercent}
                </span>
              </div>
            </div>
          </div>
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
                  className={`${styles.riskOption} ${riskProfile === profile.id ? styles.selected : ''}`}
                  onClick={() => setRiskProfile(profile.id)}
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
