# VisPrint Site Architecture

This document outlines the architectural decisions and structure of the VisPrint mock site.

## Overview
The VisPrint mock site is a single-page application (SPA) built with React, Vite, and TailwindCSS. It serves as a visual prototype for an outsourced promotional printing service, demonstrating key functionalities like product catalog, quote builder, and various informational pages. The site is designed to be purely frontend, with all data mocked client-side, and is optimized for easy deployment to Vercel.

## Core Technologies
- **React**: A JavaScript library for building user interfaces.
- **Vite**: A fast build tool that provides a lightning-fast development experience for modern web projects.
- **TailwindCSS**: A utility-first CSS framework for rapidly building custom designs.

## File Structure
The project adheres to a modular file structure, separating concerns into logical directories:

```
visprint-mock-site/
├─ vercel.json
├─ package.json
├─ .gitignore
├─ .env.example
├─ README.md
├─ ARCHITECTURE.md
├─ index.html
├─ postcss.config.js
├─ tailwind.config.js
├─ public/
│  ├─ logo.svg
│  ├─ og-cover.jpg
│  └─ images/
│     ├─ categories/   (Category image placeholders)
│     └─ products/     (Product image placeholders)
└─ src/
   ├─ main.jsx
   ├─ index.css
   ├─ App.jsx
   ├─ styles/
   │  └─ tailwind.css
   ├─ lib/
   │  ├─ productData.js
   │  ├─ analytics.js
   │  ├─ currency.js
   │  └─ validators.js
   ├─ hooks/
   │  ├─ useLocalStorage.js
   │  └─ useScrollLock.js
   ├─ components/
   │  ├─ Navbar.jsx
   │  ├─ Footer.jsx
   │  ├─ Hero.jsx
   │  ├─ USPStrip.jsx
   │  ├─ PromoStrip.jsx
   │  ├─ CategoryCard.jsx
   │  ├─ ProductCard.jsx
   │  ├─ Testimonial.jsx
   │  ├─ FAQ.jsx
   │  └─ QuoteSteps/
   │     ├─ StepProducts.jsx
   │     ├─ StepAssets.jsx
   │     └─ StepDetails.jsx
   └─ pages/
      ├─ Home.jsx
      ├─ Catalog.jsx
      ├─ Product.jsx
      ├─ Quote.jsx
      ├─ Pricing.jsx
      ├─ About.jsx
      ├─ Contact.jsx
      └─ Dashboard.jsx
```

## Component-Based Development
The application is built using a component-based architecture, where each UI element is encapsulated within its own React component. This promotes reusability, maintainability, and a clear separation of concerns.

## Client-Side Routing
The site utilizes client-side routing to provide a seamless single-page application experience. Navigation between different sections of the site is handled without full page reloads, improving performance and user experience.

## State Management
React's built-in `useState` and `useContext` (or similar if needed for global state) hooks are used for managing component-level and application-wide state. This keeps the state management simple and aligned with React's functional paradigm.

## Styling with TailwindCSS
TailwindCSS is used for all styling, providing a highly customizable and efficient way to build designs directly in the JSX. This utility-first approach minimizes CSS bloat and speeds up development.

## Data Mocking
All product and application data is mocked client-side using JavaScript objects and arrays. This allows for full frontend development and testing without the need for a backend API, while also providing a clear path for future integration with real data sources (e.g., SAGE/ASI feeds).

## Deployment
The project is configured for easy deployment to Vercel, leveraging Vite's optimized build process for static site generation. The `vercel.json` file ensures proper routing and fallback for SPA behavior.

## Future Enhancements
- Integration with real product data feeds (SAGE/ASI).
- Backend integration for quote submission and order management.
- Advanced state management solutions for larger applications.
- Comprehensive unit and integration testing.


