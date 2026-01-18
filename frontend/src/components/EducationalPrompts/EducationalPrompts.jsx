import { useState, useEffect } from 'react';
import { Lightbulb, X, ChevronRight, AlertTriangle, TrendingUp, PieChart, BookOpen } from 'lucide-react';
import styles from './EducationalPrompts.module.css';

const EducationalPrompts = ({ positions, portfolioTotals, cashBalance }) => {
    const [dismissedPrompts, setDismissedPrompts] = useState(() => {
        const saved = localStorage.getItem('dismissedEducationalPrompts');
        return saved ? JSON.parse(saved) : [];
    });
    const [expandedPrompt, setExpandedPrompt] = useState(null);

    useEffect(() => {
        localStorage.setItem('dismissedEducationalPrompts', JSON.stringify(dismissedPrompts));
    }, [dismissedPrompts]);

    // Analyze portfolio and generate relevant prompts
    const generatePrompts = () => {
        const prompts = [];

        if (!positions || positions.length === 0) {
            prompts.push({
                id: 'no-holdings',
                type: 'info',
                icon: BookOpen,
                title: 'Ready to Start Investing?',
                shortText: 'Your portfolio is empty. Learn the basics before making your first investment.',
                fullText: `Starting your investment journey can feel overwhelming, but it doesn't have to be. Here are some tips:

- Start small - You don't need a lot of money to begin investing.
- Diversify - Don't put all your eggs in one basket.
- Think long-term - The stock market can be volatile in the short term.
- Keep learning - Visit our Learn section to understand different investment types.

Remember: This is a simulated portfolio for educational purposes. Practice here before investing real money!`,
                learnMoreLink: '/learn'
            });
            return prompts;
        }

        // Check for concentration risk (one asset > 50% of portfolio)
        const totalValue = portfolioTotals?.totalValue || 0;
        if (totalValue > 0) {
            positions.forEach(pos => {
                const positionValue = pos.currentPrice * pos.quantity;
                const percentage = (positionValue / totalValue) * 100;
                if (percentage > 50) {
                    prompts.push({
                        id: `concentration-${pos.symbol}`,
                        type: 'warning',
                        icon: AlertTriangle,
                        title: 'Concentration Risk Detected',
                        shortText: `${pos.symbol} makes up ${percentage.toFixed(0)}% of your portfolio.`,
                        fullText: `Having more than 50% of your portfolio in a single asset (${pos.symbol}) increases your risk. This is called concentration risk.

What is concentration risk?
When one investment dominates your portfolio, your overall returns become heavily dependent on that single asset's performance. If it drops significantly, your entire portfolio suffers.

What can you do?
- Consider diversifying into other assets or sectors
- Look at index funds or ETFs for instant diversification
- Rebalance periodically to maintain target allocations

Note: This is educational information, not financial advice. Your ideal allocation depends on your personal situation and goals.`,
                        learnMoreLink: '/learn'
                    });
                }
            });
        }

        // Check for lack of diversification (only 1 asset type)
        const assetTypes = [...new Set(positions.map(p => p.assetType))];
        if (assetTypes.length === 1 && positions.length >= 2) {
            prompts.push({
                id: 'single-asset-type',
                type: 'info',
                icon: PieChart,
                title: 'Consider Asset Diversification',
                shortText: `All your holdings are ${assetTypes[0]}s. Mixing asset types can reduce risk.`,
                fullText: `Your portfolio currently contains only ${assetTypes[0].toLowerCase()}s. While there's nothing wrong with this, diversifying across different asset types can help manage risk.

Why diversify across asset types?
Different asset classes (stocks, bonds, crypto, etc.) often react differently to market conditions. When one goes down, another might go up or stay stable.

Asset types to consider:
- Stocks - Ownership in companies, higher growth potential
- Bonds - Loans to governments/companies, more stable income
- Crypto - Digital currencies, high risk/high reward
- ETFs - Baskets of assets for instant diversification

Remember: Diversification doesn't guarantee profits or protect against losses, but it can help smooth out volatility over time.`,
                learnMoreLink: '/learn'
            });
        }

        // Check for significant losses
        const totalGainLoss = portfolioTotals?.totalGainLoss || 0;
        const totalCost = portfolioTotals?.totalCost || 0;
        if (totalCost > 0) {
            const percentChange = (totalGainLoss / totalCost) * 100;
            if (percentChange < -10) {
                prompts.push({
                    id: 'significant-loss',
                    type: 'info',
                    icon: TrendingUp,
                    title: 'Understanding Market Volatility',
                    shortText: `Your portfolio is down ${Math.abs(percentChange).toFixed(1)}%. This is normal market behavior.`,
                    fullText: `Seeing your portfolio value decrease can be stressful, but it's a normal part of investing. Here's what to keep in mind:

Market volatility is normal
- Stock markets have always had ups and downs
- Historically, markets have recovered from every downturn
- Short-term losses don't become real losses unless you sell

What NOT to do:
- Don't panic sell - this locks in your losses
- Don't check your portfolio obsessively
- Don't make emotional decisions

What TO do:
- Stick to your long-term plan
- Consider if this is a buying opportunity (if you have cash)
- Review your risk tolerance - are you comfortable with this volatility?

Remember: Time in the market beats timing the market. This is educational information for a simulated portfolio.`,
                    learnMoreLink: '/learn'
                });
            }
        }

        // Check for significant gains
        if (totalCost > 0) {
            const percentChange = (totalGainLoss / totalCost) * 100;
            if (percentChange > 20) {
                prompts.push({
                    id: 'significant-gain',
                    type: 'success',
                    icon: TrendingUp,
                    title: 'Portfolio Performing Well',
                    shortText: `Your portfolio is up ${percentChange.toFixed(1)}%! Consider your rebalancing strategy.`,
                    fullText: `Congratulations on your portfolio growth! Here are some things to consider:

When your portfolio grows significantly:
- Your asset allocation may have shifted from your target
- Some positions may now be a larger percentage than intended
- This could mean more risk than you originally planned

What is rebalancing?
Rebalancing means adjusting your portfolio back to your target allocation. For example, if stocks grew from 60% to 75% of your portfolio, you might sell some stocks and buy bonds to get back to 60%.

Things to consider:
- Do you have a target asset allocation?
- Has your risk tolerance or timeline changed?
- Are you still diversified appropriately?

Note: Past performance doesn't guarantee future results. This is educational information, not a recommendation to buy or sell.`,
                    learnMoreLink: '/learn'
                });
            }
        }

        // Check for high cash balance relative to portfolio
        if (cashBalance && totalValue > 0) {
            const cashPercentage = (cashBalance / (totalValue + cashBalance)) * 100;
            if (cashPercentage > 50) {
                prompts.push({
                    id: 'high-cash',
                    type: 'info',
                    icon: Lightbulb,
                    title: 'Cash Sitting on the Sidelines',
                    shortText: `${cashPercentage.toFixed(0)}% of your account is in cash. Consider your investment goals.`,
                    fullText: `A significant portion of your account (${cashPercentage.toFixed(0)}%) is held in cash. While having some cash is important, too much can mean missed opportunities.

Why cash might be appropriate:
- You need liquidity for upcoming expenses
- You're waiting for investment opportunities
- You want to reduce risk in uncertain times

Why too much cash can be a problem:
- Cash loses purchasing power to inflation over time
- You miss out on potential market gains
- Long-term, invested money typically outperforms cash

Things to consider:
- Do you have a plan for this cash?
- What's your investment timeline?
- Could dollar-cost averaging help you invest gradually?

Remember: There's no "right" amount of cash - it depends on your personal situation and goals.`,
                    learnMoreLink: '/learn'
                });
            }
        }

        // Check for crypto holdings (high volatility warning)
        const cryptoHoldings = positions.filter(p => p.assetType === 'CRYPTO');
        if (cryptoHoldings.length > 0) {
            const cryptoValue = cryptoHoldings.reduce((sum, p) => sum + (p.currentPrice * p.quantity), 0);
            const cryptoPercentage = (cryptoValue / totalValue) * 100;
            if (cryptoPercentage > 25) {
                prompts.push({
                    id: 'high-crypto',
                    type: 'warning',
                    icon: AlertTriangle,
                    title: 'High Cryptocurrency Exposure',
                    shortText: `${cryptoPercentage.toFixed(0)}% of your portfolio is in crypto. Understand the risks.`,
                    fullText: `Cryptocurrency makes up ${cryptoPercentage.toFixed(0)}% of your portfolio. While crypto can offer high returns, it comes with significant risks:

Cryptocurrency risks:
- Extreme volatility - 50%+ swings are not uncommon
- Regulatory uncertainty - rules are still evolving
- No underlying assets or earnings like stocks
- Security risks (hacks, lost keys, exchange failures)

Things to consider:
- Only invest what you can afford to lose completely
- Understand that crypto is speculative
- Consider if this allocation matches your risk tolerance
- Diversification applies to crypto too - don't put everything in one coin

Many financial experts suggest limiting crypto to 5-10% of a portfolio, but this depends on your personal situation and risk tolerance.

This is educational information about crypto risks, not advice to buy or sell.`,
                    learnMoreLink: '/learn'
                });
            }
        }

        return prompts;
    };

    const prompts = generatePrompts().filter(p => !dismissedPrompts.includes(p.id));

    const handleDismiss = (promptId) => {
        setDismissedPrompts([...dismissedPrompts, promptId]);
        if (expandedPrompt === promptId) {
            setExpandedPrompt(null);
        }
    };

    const handleExpand = (promptId) => {
        setExpandedPrompt(expandedPrompt === promptId ? null : promptId);
    };

    const resetDismissed = () => {
        setDismissedPrompts([]);
        localStorage.removeItem('dismissedEducationalPrompts');
    };

    if (prompts.length === 0) {
        return null;
    }

    return (
        <div className={styles.promptsContainer}>
            <div className={styles.promptsHeader}>
                <Lightbulb size={18} />
                <span>Educational Insights</span>
            </div>
            <div className={styles.promptsList}>
                {prompts.slice(0, 2).map(prompt => (
                    <div 
                        key={prompt.id} 
                        className={`${styles.prompt} ${styles[prompt.type]} ${expandedPrompt === prompt.id ? styles.expanded : ''}`}
                    >
                        <div className={styles.promptHeader} onClick={() => handleExpand(prompt.id)}>
                            <div className={styles.promptIcon}>
                                <prompt.icon size={18} />
                            </div>
                            <div className={styles.promptContent}>
                                <h4 className={styles.promptTitle}>{prompt.title}</h4>
                                <p className={styles.promptShort}>{prompt.shortText}</p>
                            </div>
                            <button 
                                className={styles.dismissBtn}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDismiss(prompt.id);
                                }}
                                aria-label="Dismiss"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        {expandedPrompt === prompt.id && (
                            <div className={styles.promptExpanded}>
                                <div className={styles.promptFullText}>
                                    {prompt.fullText.split('\n').map((line, i) => (
                                        <p key={i}>{line}</p>
                                    ))}
                                </div>
                                <a href={prompt.learnMoreLink} className={styles.learnMoreBtn}>
                                    Learn More <ChevronRight size={16} />
                                </a>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EducationalPrompts;
