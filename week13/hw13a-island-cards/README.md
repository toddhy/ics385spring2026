# Week 13a: Data-Driven Island Cards

## Assignment Overview

This assignment transforms static React components (from Week 12) into **data-driven** components using Props, ES6 functional methods, and React state management. You'll learn patterns that directly apply to the Term Project dashboard.

## Learning Goals Accomplished

✅ **Props-driven components** – `IslandCard` accepts destructured props instead of hard-coded values  
✅ **ES6 .map()** – Iterating over data arrays to render dynamic JSX  
✅ **ES6 .filter()** – Filtering islands by tourist segment  
✅ **ES6 .reduce()** – Calculating aggregate statistics (average stay)  
✅ **Reusable components** – Clean, single-responsibility `IslandCard` component  
✅ **Filtered grid with state** – Dynamic UI that responds to user selection  

## Implementation

### Components

**App.jsx**
- Hardcoded island data array with 5 Hawaiian islands
- Each island has: `id`, `name`, `nickname`, `segment`, `avgStay`, `img`
- Passes data to `IslandList` component

**IslandList.jsx**
- Manages filter state with `useState('All')`
- Renders segment dropdown (built dynamically with `.map()`)
- Filters islands based on selected segment (`.filter()`)
- Calculates average stay for displayed islands (`.reduce()`)
- Maps islands to individual `IslandCard` components

**IslandCard.jsx**
- Reusable card component that accepts props
- Displays island image, name, nickname, segment badge, and average stay
- Clean presentation layer with no business logic

## Key Techniques Demonstrated

```javascript
// .map() – Generate dropdown options
segments.map(s => <option key={s}>{s}</option>)

// .filter() – Narrow results by segment
islands.filter(i => i.segment === segment)

// .reduce() – Calculate average
displayed.reduce((sum, i) => sum + i.avgStay, 0) / displayed.length

// Spread operator for props
<IslandCard key={island.id} {...island} />
```

## Running the Project

```bash
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.
