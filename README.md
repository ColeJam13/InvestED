# InvestED

An **educational investment simulation platform** that helps new investors learn market fundamentals, risk management, and long-term strategy **without using real money**. The platform combines real-time market data with **AI-powered mentorship** in a strictly educational, non-advisory environment.

---

- [Project Overview](#project-overview)
- [Problem](#problem)
- [Solution](#solution)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Core Application Views](#core-application-views)
- [Disclaimer](#disclaimer)

---

## Project Overview

The Investment Learning Platform is a **paper-trading simulator** that allows users to invest virtual money into real stocks and cryptocurrencies using live market data. Users can track portfolios, set financial goals, compare assets, and chat with an AI mentor—all while remaining in a safe learning environment (no real-money trading). 

This project was built as a **group capstone project** with a full product lifecycle: scope alignment, data modeling, backend services, AI integration, frontend UX, testing, and demo preparation.

---

## Problem

Many first-time investors lose money early due to:
- Lack of foundational knowledge
- Emotional decision-making
- Platforms that encourage real-money investing too soon 

New investors need a **risk-free environment** to learn, build confidence, and practice decision-making without financial consequences. 

---

## Solution

A learning-first simulation platform that provides:
- Real-time market realism via live data
- Paper-money portfolio simulation (buy/sell)
- Goal-based tracking (timeline + risk tolerance)
- AI-powered mentorship with educational tone and strict safety rules

---

## Key Features

### Portfolio Simulation
- Create portfolios with a paper money balance
- Buy/sell assets with balance validation
- Track portfolio value, gains/losses, and transaction history 

### Market Data & Asset Discovery
- Stock + crypto market data service
- Asset search
- Asset detail / quote view
- Quote caching strategy for performance 

### Goal-Based Tracking
- Create savings/investing goals (e.g., “$20k for a house in 3 years”)
- Progress calculations and progress UI (bars/details) 

### Asset Comparison
- Side-by-side comparison UI
- Compare price and basic metrics (and risk-related indicators when available) 

### Education Hub
- Learning views for asset types
- Learning views for risk metrics
- Plain-language explanations triggered by portfolio conditions
- Beginner-friendly “common mistakes” content 

### AI Educational Mentor
- Chat interface + conversation history
- Portfolio/risk context injection for personalized educational guidance
- Safety validation to keep tone informational (not advisory) 

---

## Tech Stack

- **Frontend**: React
- **Backend**: Java, Spring Boot
- **Database**: PostgreSQL
- **Market Data**: TwelveData (stocks + crypto)
- **AI/LLM**: Llama 4 (educational mentor wrapper + system prompt) 

---

## Core Application Views

- Register User
- Onboarding (educational purpose + disclaimer acceptance)
- Dashboard (portfolio summary, value, cash, holdings, P/L)
- Market Search + Asset Detail (quote, metrics, buy flow)
- Portfolio Management (positions, sell flow, sorting/filtering)
- Asset Comparison (side-by-side)
- AI Mentor Chat
- Goal Tracking (create goal, list, progress display)
- Education Hub

---

## Disclaimer

This application is for **educational purposes only**. It does not provide financial advice or investment recommendations and does not support real-money trading. All investing activity shown is simulated with virtual funds. 
