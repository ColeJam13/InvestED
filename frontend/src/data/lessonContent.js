// Educational content sourced from SEC (investor.gov) and FINRA
// This is for educational purposes only - not financial advice

export const lessonContent = {
    1: {
        id: 1,
        title: 'Introduction to Investing',
        sections: [
            {
                title: 'What is Investing?',
                content: `Investing is putting your money to work for you. When you invest, you purchase something with the expectation that it will generate income or grow in value over time. Unlike keeping money in a savings account, investing involves taking on some level of risk in exchange for the potential of higher returns.

The core idea is simple: instead of just saving money, you use it to buy assets that have the potential to increase in value or generate income. This could include stocks, bonds, mutual funds, real estate, or other investment vehicles.`
            },
            {
                title: 'Why Do People Invest?',
                content: `People invest for many reasons:

- Build wealth over time - Historically, investments have outpaced inflation, helping your money maintain and grow its purchasing power.

- Reach financial goals - Whether it's buying a home, funding education, or retiring comfortably, investing can help you reach major milestones.

- Generate passive income - Some investments, like dividend-paying stocks or bonds, provide regular income payments.

- Beat inflation - Money sitting in a regular savings account may lose purchasing power over time due to inflation. Investing helps combat this.`
            },
            {
                title: 'Saving vs. Investing',
                content: `Saving and investing are both important, but they serve different purposes:

SAVING is setting aside money for short-term goals or emergencies. Savings accounts are safe and liquid (easily accessible), but typically offer low returns.

INVESTING is for longer-term goals where you can afford to take on some risk. While investments can lose value in the short term, they historically provide better returns over long periods.

A good financial plan includes both: an emergency fund in savings, and investments for long-term growth.`
            },
            {
                title: 'The Power of Compound Interest',
                content: `Compound interest is often called the "eighth wonder of the world." It's the concept of earning returns not just on your original investment, but also on the returns you've already earned.

For example, if you invest $1,000 and earn 7% annually:
- Year 1: $1,000 becomes $1,070
- Year 2: $1,070 becomes $1,145 (you earned interest on $1,070, not just $1,000)
- Year 10: Your investment grows to about $1,967
- Year 30: Your investment grows to about $7,612

The earlier you start investing, the more time compound interest has to work in your favor.`
            },
            {
                title: 'Key Takeaways',
                content: `• Investing means putting your money to work to potentially grow over time.

- All investments carry some risk - there's no guarantee you'll make money.

- Starting early gives you the advantage of compound interest.

- Diversification (spreading investments across different assets) can help manage risk.

- Before investing, understand your goals, time horizon, and risk tolerance.

- Never invest money you can't afford to lose or may need in the short term.`
            }
        ],
        quiz: [
            {
                question: 'What is the main difference between saving and investing?',
                options: [
                    'There is no difference',
                    'Saving is for short-term goals with low risk; investing is for long-term goals with higher risk and potential returns',
                    'Investing is always safer than saving',
                    'Saving always provides higher returns'
                ],
                correctAnswer: 1,
                explanation: 'Saving is typically for short-term goals and emergencies, offering safety and easy access but lower returns. Investing involves more risk but has historically provided better long-term returns.'
            },
            {
                question: 'What is compound interest?',
                options: [
                    'Interest charged on loans',
                    'A type of bank fee',
                    'Earning returns on both your original investment and your accumulated returns',
                    'A government tax on investments'
                ],
                correctAnswer: 2,
                explanation: 'Compound interest means you earn returns not just on your initial investment, but also on the returns you have already earned. This creates a snowball effect over time.'
            },
            {
                question: 'Why do people invest their money?',
                options: [
                    'Only to get rich quickly',
                    'To build wealth, reach financial goals, generate income, and beat inflation',
                    'Because saving accounts are illegal',
                    'Investing is required by law'
                ],
                correctAnswer: 1,
                explanation: 'People invest for various reasons including building long-term wealth, achieving financial goals like retirement or education, generating passive income, and protecting against inflation.'
            },
            {
                question: 'Which statement about investment risk is TRUE?',
                options: [
                    'All investments are guaranteed to make money',
                    'Higher potential returns usually come with higher risk',
                    'There is no risk in investing',
                    'Only stocks have risk'
                ],
                correctAnswer: 1,
                explanation: 'Generally, investments with higher potential returns carry higher risk. This risk-return tradeoff is a fundamental concept in investing. No investment is completely risk-free.'
            },
            {
                question: 'What is diversification?',
                options: [
                    'Putting all your money in one stock',
                    'Only investing in savings accounts',
                    'Spreading investments across different assets to manage risk',
                    'Avoiding all investments'
                ],
                correctAnswer: 2,
                explanation: 'Diversification means spreading your investments across different types of assets (stocks, bonds, etc.) and sectors. This helps reduce risk because if one investment performs poorly, others may perform well.'
            }
        ]
    },
    2: {
        id: 2,
        title: 'Understanding Stock Markets',
        sections: [
            {
                title: 'What is a Stock?',
                content: `A stock represents ownership in a company. When you buy a stock, you're purchasing a small piece of that company, making you a "shareholder."

Companies sell stocks to raise money for operations, expansion, or other business activities. In return, shareholders may benefit from:

- Capital appreciation - If the company does well, the stock price may increase
- Dividends - Some companies share profits with shareholders through regular payments
- Voting rights - Common stockholders can vote on certain company decisions`
            },
            {
                title: 'How Stock Markets Work',
                content: `Stock markets are places where buyers and sellers come together to trade stocks. The two major U.S. stock exchanges are:

- NYSE (New York Stock Exchange) - The largest stock exchange in the world by market capitalization
- NASDAQ - Known for technology companies, operates electronically

When you want to buy a stock, you place an order through a broker. The broker finds a seller willing to sell at your price, and the trade is executed. Stock prices change constantly based on supply and demand - if more people want to buy a stock than sell it, the price goes up, and vice versa.`
            },
            {
                title: 'Types of Stocks',
                content: `There are several ways to categorize stocks:

BY OWNERSHIP TYPE:
- Common stock - Standard ownership with voting rights and potential dividends
- Preferred stock - Priority for dividends but usually no voting rights

BY COMPANY SIZE (Market Capitalization):
- Large-cap - Big, established companies (over $10 billion)
- Mid-cap - Medium-sized companies ($2-10 billion)
- Small-cap - Smaller companies (under $2 billion)

BY INVESTMENT STYLE:
- Growth stocks - Companies expected to grow faster than average
- Value stocks - Companies believed to be undervalued by the market
- Income stocks - Companies that pay regular dividends`
            },
            {
                title: 'Reading Stock Information',
                content: `When researching stocks, you'll encounter common terms:

- Stock Symbol (Ticker) - A short abbreviation for the company (e.g., AAPL for Apple)
- Share Price - The current cost of one share
- Market Cap - Total value of all shares (price x number of shares)
- P/E Ratio - Price-to-earnings ratio; compares stock price to company earnings
- Dividend Yield - Annual dividend payment as a percentage of stock price
- Volume - Number of shares traded in a day
- 52-Week High/Low - Highest and lowest prices in the past year`
            },
            {
                title: 'Risks of Stock Investing',
                content: `Stock investing carries several risks:

- Market Risk - The overall market can decline, affecting most stocks
- Company Risk - Individual companies can perform poorly or go bankrupt
- Volatility - Stock prices can swing dramatically in short periods
- No Guarantees - Unlike bank deposits, stocks are not FDIC insured

Important to remember:
- Past performance doesn't guarantee future results
- You can lose some or all of your investment
- Stocks are generally better suited for long-term goals
- Diversification can help manage (but not eliminate) risk`
            },
            {
                title: 'Key Takeaways',
                content: `• Stocks represent ownership in companies

- Stock prices are determined by supply and demand

- There are different types of stocks suited for different investment goals

- Understanding basic stock metrics helps you make informed decisions

- All stock investments carry risk - never invest money you can't afford to lose

- Consider your time horizon and risk tolerance before investing in stocks`
            }
        ],
        quiz: [
            {
                question: 'What does owning a stock represent?',
                options: [
                    'A loan to a company',
                    'Ownership of a small piece of a company',
                    'A promise from the government',
                    'A type of savings account'
                ],
                correctAnswer: 1,
                explanation: 'When you buy a stock, you become a partial owner (shareholder) of that company. This is different from bonds, which are loans to companies or governments.'
            },
            {
                question: 'What determines stock prices?',
                options: [
                    'The government sets all stock prices',
                    'Stock prices never change',
                    'Supply and demand - how many people want to buy vs. sell',
                    'Only the company decides its stock price'
                ],
                correctAnswer: 2,
                explanation: 'Stock prices are determined by supply and demand in the market. When more people want to buy a stock than sell it, the price rises. When more want to sell than buy, the price falls.'
            },
            {
                question: 'What is a dividend?',
                options: [
                    'A fee you pay to buy stocks',
                    'A share of company profits paid to shareholders',
                    'The price of a stock',
                    'A type of stock exchange'
                ],
                correctAnswer: 1,
                explanation: 'Dividends are payments that some companies make to shareholders, distributing a portion of their profits. Not all stocks pay dividends - it depends on the company policy.'
            },
            {
                question: 'What does "market capitalization" mean?',
                options: [
                    'The maximum price a stock can reach',
                    'The total value of all a company shares (price x shares outstanding)',
                    'The amount of money in your brokerage account',
                    'Government regulations on markets'
                ],
                correctAnswer: 1,
                explanation: 'Market capitalization (market cap) is calculated by multiplying the stock price by the total number of shares. It represents the total market value of a company equity.'
            },
            {
                question: 'Which statement about stock risk is correct?',
                options: [
                    'Stocks are guaranteed to make money over time',
                    'You can lose money investing in stocks, and past performance does not guarantee future results',
                    'Stock investments are insured by the FDIC',
                    'Large company stocks never lose value'
                ],
                correctAnswer: 1,
                explanation: 'Stock investments carry risk - you can lose some or all of your investment. Unlike bank deposits, stocks are not FDIC insured, and even large companies stocks can decline in value.'
            },
            {
                question: 'What is the P/E (Price-to-Earnings) ratio?',
                options: [
                    'The profit a company makes each year',
                    'A comparison of stock price to company earnings, used to evaluate valuation',
                    'The percentage of stock you own',
                    'The fee for buying stocks'
                ],
                correctAnswer: 1,
                explanation: 'The P/E ratio compares a stock price to the company earnings per share. It is commonly used to evaluate whether a stock might be overvalued or undervalued relative to its earnings.'
            }
        ]
    },
    5: {
        id: 5,
        title: 'Cryptocurrency Fundamentals',
        sections: [
            {
                title: 'What is Cryptocurrency?',
                content: `Cryptocurrency is a digital or virtual form of currency that uses cryptography for security. Unlike traditional currencies issued by governments (like the US dollar), cryptocurrencies operate on decentralized networks.

Key characteristics of cryptocurrency:

- Digital - Exists only electronically, no physical coins or bills
- Decentralized - Not controlled by any single government or institution
- Secure - Uses advanced cryptography to secure transactions
- Transparent - All transactions are recorded on a public ledger

The first and most well-known cryptocurrency is Bitcoin, created in 2009 by an anonymous person or group using the name Satoshi Nakamoto.`
            },
            {
                title: 'How Blockchain Works',
                content: `Blockchain is the underlying technology that powers most cryptocurrencies. Think of it as a digital ledger that records all transactions.

How it works:

- Transactions are grouped into "blocks"
- Each block is linked to the previous one, forming a "chain"
- The blockchain is distributed across thousands of computers (nodes)
- Once recorded, transactions cannot be altered or deleted

This design makes blockchain:
- Transparent - Anyone can view the transaction history
- Secure - Extremely difficult to hack or manipulate
- Decentralized - No single point of failure

Beyond cryptocurrency, blockchain technology is being explored for supply chain tracking, voting systems, and digital identity verification.`
            },
            {
                title: 'Major Cryptocurrencies',
                content: `While there are thousands of cryptocurrencies, here are some of the most significant:

BITCOIN (BTC)
- The first and largest cryptocurrency by market cap
- Often called "digital gold" - used as a store of value
- Limited supply of 21 million coins

ETHEREUM (ETH)
- Second-largest cryptocurrency
- Supports "smart contracts" - self-executing agreements
- Powers many decentralized applications (dApps)

Other notable cryptocurrencies:
- Stablecoins (USDC, USDT) - Pegged to traditional currencies like the US dollar
- Altcoins - Any cryptocurrency other than Bitcoin

Each cryptocurrency has different purposes, technologies, and risk profiles.`
            },
            {
                title: 'How to Buy and Store Crypto',
                content: `To invest in cryptocurrency, you need:

1. A CRYPTOCURRENCY EXCHANGE
- Platforms like Coinbase, Kraken, or Gemini
- Allow you to buy, sell, and trade cryptocurrencies
- Require identity verification (KYC - Know Your Customer)

2. A WALLET
- Software or hardware that stores your crypto
- "Hot wallets" - Connected to internet, convenient but less secure
- "Cold wallets" - Offline storage, more secure for large amounts

Important concepts:
- Private keys - Secret codes that prove ownership (never share these!)
- Public address - Like an account number, safe to share for receiving crypto
- Seed phrase - Backup words to recover your wallet (store securely offline)

Remember: "Not your keys, not your crypto" - if you leave crypto on an exchange, you don't fully control it.`
            },
            {
                title: 'Risks of Cryptocurrency',
                content: `Cryptocurrency investments carry significant risks:

VOLATILITY
- Prices can swing 10-20% or more in a single day
- Much more volatile than traditional investments

REGULATORY UNCERTAINTY
- Laws and regulations are still evolving
- Government actions can significantly impact prices

SECURITY RISKS
- Exchanges can be hacked
- Lost private keys mean lost funds - no recovery possible
- Scams and fraud are common in the crypto space

NO INVESTOR PROTECTIONS
- Not FDIC insured like bank deposits
- Not regulated like traditional securities
- Limited recourse if something goes wrong

IMPORTANT: Only invest what you can afford to lose entirely. Cryptocurrency should be a small portion of a diversified portfolio, if included at all.`
            },
            {
                title: 'Key Takeaways',
                content: `• Cryptocurrency is digital money that operates on decentralized networks

- Blockchain technology provides security and transparency

- Bitcoin and Ethereum are the two largest cryptocurrencies

- You need an exchange to buy and a wallet to store crypto securely

- Cryptocurrency is highly volatile and risky - prices can change dramatically

- Regulatory environment is still developing and uncertain

- Never invest more than you can afford to lose completely

- Be extremely cautious of scams - they are prevalent in the crypto space

- Consider crypto as only a small part of a diversified investment strategy, if at all`
            }
        ],
        quiz: [
            {
                question: 'What is cryptocurrency?',
                options: [
                    'Physical coins made of precious metals',
                    'Digital currency that uses cryptography and operates on decentralized networks',
                    'A type of government-issued currency',
                    'A traditional bank account'
                ],
                correctAnswer: 1,
                explanation: 'Cryptocurrency is a digital or virtual form of currency that uses cryptography for security and operates on decentralized networks, meaning no single government or institution controls it.'
            },
            {
                question: 'What is blockchain?',
                options: [
                    'A type of cryptocurrency',
                    'A physical chain used in mining',
                    'A distributed digital ledger that records all transactions',
                    'A government database'
                ],
                correctAnswer: 2,
                explanation: 'Blockchain is the underlying technology for most cryptocurrencies. It is a distributed digital ledger where transactions are grouped into blocks that are linked together in a chain.'
            },
            {
                question: 'What makes Bitcoin unique among cryptocurrencies?',
                options: [
                    'It is backed by gold',
                    'It was the first cryptocurrency and has a limited supply of 21 million coins',
                    'It is controlled by a central bank',
                    'It cannot be bought or sold'
                ],
                correctAnswer: 1,
                explanation: 'Bitcoin was the first cryptocurrency, created in 2009. It has a fixed maximum supply of 21 million coins, which contributes to its "digital gold" narrative as a store of value.'
            },
            {
                question: 'What is a cryptocurrency wallet?',
                options: [
                    'A physical wallet for storing cash',
                    'Software or hardware that stores your cryptocurrency and private keys',
                    'A bank account for crypto',
                    'A government ID for trading'
                ],
                correctAnswer: 1,
                explanation: 'A cryptocurrency wallet is software or hardware that stores your private keys, which prove ownership of your crypto. Hot wallets are connected to the internet, while cold wallets are offline for better security.'
            },
            {
                question: 'Which statement about cryptocurrency risk is TRUE?',
                options: [
                    'Cryptocurrency is FDIC insured like bank deposits',
                    'Cryptocurrency prices are very stable',
                    'Cryptocurrency is highly volatile and you can lose your entire investment',
                    'There are no scams in the cryptocurrency space'
                ],
                correctAnswer: 2,
                explanation: 'Cryptocurrency is highly volatile - prices can swing dramatically in short periods. It is not FDIC insured, has limited regulatory protections, and scams are unfortunately common in the space.'
            },
            {
                question: 'What does "Not your keys, not your crypto" mean?',
                options: [
                    'You need a physical key to access cryptocurrency',
                    'If you do not control your private keys (like when crypto is on an exchange), you do not fully control your cryptocurrency',
                    'Cryptocurrency requires a car key to purchase',
                    'Keys are used to mine cryptocurrency'
                ],
                correctAnswer: 1,
                explanation: 'This phrase means that if you leave your cryptocurrency on an exchange rather than in your own wallet, you do not have full control over it. The exchange holds the private keys, which poses risks if the exchange is hacked or goes bankrupt.'
            }
        ]
    }
};

export default lessonContent;
