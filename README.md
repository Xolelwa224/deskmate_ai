# Xolelwa BuildConsult

**Plan Better. Build Smarter. Deliver With Confidence.**

A professional construction consulting and project management web application for Xolelwa BuildConsult — a modern construction consulting company that helps clients plan, manage and monitor construction projects.

[![Built with React](https://img.shields.io/badge/Built_with-React_18-61dafb?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-5.4-646cff?logo=vite&logoColor=white)](https://vitejs.dev)

---

## Overview

Xolelwa BuildConsult is a full-featured construction consulting platform that combines a **public-facing business website** with an **internal project management dashboard**. It is designed to feel like software a real construction consultancy would use day-to-day — covering project tracking, budget management, site inspections, quotations, risk management, safety monitoring and client communication.

> **Note:** This is a demonstration / portfolio application. All project data is sample data for illustrative purposes. It is not affiliated with any real company.

---

## Features

### Public Website

- **Landing page** with hero section, construction photography, and call-to-action
- **Services section** — six construction consulting service cards
- **Project portfolio** — filterable project showcase with images, budgets and progress
- **About section** with founder profile (Xolelwa Lubisi)
- **Client enquiry form** — "Start Your Project" lead capture form
- **Footer** with company info and social links

### Project Management Dashboard

| Module | Description |
|---|---|
| **Dashboard** | Greeting, KPI stats, quick actions, project overview, charts, upcoming tasks, notifications |
| **Projects** | Filterable project list with cards, detailed project view with timeline, health indicators, budget summary |
| **Clients** | Client management with add/edit/view, search and status filters |
| **Quotations** | Create quotations with auto-calculated VAT and totals, status tracking, printable view |
| **Site Inspections** | Create detailed inspection reports with weather, conditions, safety observations and recommendations |
| **Materials** | Construction materials inventory with stock status, reorder levels and ordering |
| **Budget & Costs** | Budget vs actual tracking, expense logging by category, budget alerts |
| **Tasks** | Task management with priorities, due dates, status workflow and completion |
| **Calendar** | Monthly calendar with colour-coded event categories (inspections, meetings, deliveries, deadlines) |
| **Project Reports** | Weekly report generation with progress charts, budget status, issues, risks and upcoming activities |
| **Risk Register** | Construction risk management with probability/impact scoring, mitigation plans and status tracking |
| **Safety & Quality** | Safety observations, incident reports, quality checks and outstanding defects |
| **Resources** | Document library with project plans, quotations, contracts, inspection reports and photos |
| **Calculators** | Budget calculator, area calculator and material cost calculator |
| **Client Enquiries** | View and manage enquiries submitted from the public website |
| **BuildAssist (AI)** | Context-aware AI assistant for project summaries, risk analysis, progress reports and construction terminology |
| **Settings** | Account info, data overview and reset functionality |

---

## Technology Stack

| Category | Technology |
|---|---|
| **Framework** | React 18 with TypeScript |
| **Build Tool** | Vite 5 |
| **Styling** | Tailwind CSS 3 with custom design system |
| **Icons** | Lucide React |
| **State Management** | React Context API with localStorage persistence |
| **Charts** | Custom SVG-based charts (no external chart library) |
| **Fonts** | Inter (body) + Plus Jakarta Sans (display) |
| **Backend** | Supabase (configured, ready for data persistence) |

---

## Design System

The application uses a custom architectural colour palette built into the Tailwind configuration:

| Colour | Usage |
|---|---|
| **Charcoal** (near-black) | Primary background, surfaces, text |
| **Sand** (warm beige) | Secondary surfaces, neutral accents |
| **Terracotta** (burnt orange) | Primary accent — buttons, highlights, active states |
| **Olive** (construction green) | Secondary accent — success states, positive indicators |
| **Cream** | Readable text on dark surfaces |

Additional design details:
- 8px spacing system
- Custom shadow system (soft, card, elevated)
- Subtle animations (fade-in, slide-up, slide-down, scale-in, progress)
- Responsive breakpoints: 390px (mobile), 768px (tablet), 1024px (laptop), 1440px (desktop)
- Mobile bottom navigation bar with slide-out sidebar drawer

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd xolelwa-buildconsult

# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview

# Run type checking
npm run typecheck
```

The application will be available at `http://localhost:5173`.

---

## Project Structure

```
src/
├── App.tsx                     # Root component — landing page / dashboard routing
├── main.tsx                    # Application entry point
├── index.css                   # Global styles, Tailwind directives, custom utilities
├── types.ts                    # TypeScript interfaces for all entities
│
├── components/
│   ├── LandingPage.tsx         # Public-facing homepage
│   ├── Layout.tsx              # Sidebar, TopBar, MobileNav
│   └── ui/
│       ├── Badge.tsx           # Status badges with variant mapping
│       ├── Button.tsx          # Button component (primary, secondary, ghost, danger, outline)
│       ├── Card.tsx            # Card + StatCard components
│       ├── Charts.tsx          # DonutChart, BarChart, GroupedBarChart, LineChart (SVG)
│       ├── Form.tsx            # Input, Textarea, Select, FieldRow
│       ├── Logo.tsx            # Brand logo
│       ├── Modal.tsx           # Modal dialog
│       ├── PageHeader.tsx      # Page title + actions header
│       ├── ProgressBar.tsx     # Animated progress bar
│       └── SearchBar.tsx       # SearchBar, FilterTabs, EmptyState
│
├── config/
│   └── nav.ts                  # Navigation items configuration
│
├── data/
│   └── seed.ts                 # Realistic sample construction data
│
├── pages/
│   ├── Dashboard.tsx           # Main dashboard with stats and quick actions
│   ├── Projects.tsx            # Project list + project detail view
│   ├── Clients.tsx             # Client management
│   ├── Quotations.tsx          # Quotation system with calculations
│   ├── Budget.tsx              # Budget & cost tracking
│   ├── Materials.tsx           # Materials inventory
│   ├── Inspections.tsx         # Site inspection reports
│   ├── Tasks.tsx               # Task management
│   ├── Calendar.tsx            # Project calendar
│   ├── Reports.tsx             # Report generation
│   ├── RiskRegister.tsx        # Risk management
│   ├── SafetyQuality.tsx       # Safety & quality tracking
│   ├── Resources.tsx           # Document library
│   ├── Calculators.tsx         # Construction calculators
│   ├── Enquiries.tsx           # Client enquiry management
│   ├── AIAssistant.tsx         # BuildAssist AI helper
│   └── Settings.tsx            # App settings
│
├── store/
│   └── StoreContext.tsx        # Global state with localStorage persistence
│
└── utils/
    └── format.ts               # Currency, date and time formatting helpers
```

---

## Data Persistence

The application uses React Context with localStorage for client-side data persistence. All data — projects, clients, quotations, expenses, materials, inspections, tasks, events, risks, safety items, documents, notifications and enquiries — is saved to the browser's localStorage and persists across page reloads.

The data can be reset to the original sample data from the Settings page.

Supabase is configured and available as the backend for future server-side data persistence.

---

## Sample Data

The application comes pre-loaded with realistic South African construction project data:

- **8 projects** across residential, commercial, renovation, infrastructure and interior types
- **10 clients** with companies, contact details and project associations
- **4 quotations** in various statuses (draft, sent, under review, accepted)
- **10 expenses** across cost categories (concrete, steel, bricks, labour, etc.)
- **12 materials** with stock levels and reorder thresholds
- **3 site inspections** with full report details
- **10 tasks** with priorities, assignees and due dates
- **10 calendar events** across multiple categories
- **6 risks** with mitigation strategies
- **8 safety & quality items** (observations, incidents, quality checks, defects)
- **12 documents** (plans, contracts, reports, invoices, photos)
- **7 notifications** of various types

All monetary values are in South African Rand (ZAR).

---

## Responsive Design

The application is fully responsive and tested at:

| Breakpoint | Width | Layout |
|---|---|---|
| Mobile | 390px | Bottom nav bar, slide-out drawer, stacked cards |
| Tablet | 768px | Sidebar visible, 2-column grids |
| Laptop | 1024px | Full sidebar, multi-column layouts |
| Desktop | 1440px | Full layout with maximum content width |

---

## Key Functionality

- Create, edit and view **projects** with phased timelines
- Create and manage **clients** with full contact details
- Generate **quotations** with automatic VAT calculation
- Track **expenses** against project budgets with visual alerts
- Manage **materials** inventory with stock status indicators
- Create detailed **site inspection** reports
- Create, assign and complete **tasks** with priority levels
- View **calendar** events with category-based colour coding
- Generate weekly **project reports** with charts
- Track and mitigate **risks** with probability/impact scoring
- Record **safety observations** and quality checks
- Browse and manage **documents** by type and project
- Use **calculators** for budget, area and material cost estimation
- Receive and manage **client enquiries** from the public website
- Get AI-assisted summaries and analysis from **BuildAssist**
- Mark **notifications** as read with a notification centre

---

## Responsible AI Note

BuildAssist provides AI-generated suggestions for productivity purposes. These suggestions should be reviewed by a qualified professional before being used for construction, financial, safety or contractual decisions.

---

## License

This is a portfolio/demonstration project. © 2026 Xolelwa BuildConsult. All rights reserved.

---

**Plan Better. Build Smarter. Deliver With Confidence.**
