# Hawaii Island Cards

## Project Overview
A beginner-friendly React application that displays Hawaiian islands with information cards. This project demonstrates key React concepts: **functional components**, **props**, **JSX**, **ES6 modules**, and **array rendering with `.map()`**.

---

## What This App Does
The app renders a header and three island cards. Each card displays:
- Island name
- One-sentence description
- A visitor tip

The cards are styled with CSS and arranged in a responsive grid.

---

## File Structure & Purpose

### Core Files
- **`App.jsx`** — Main component
  - Holds the island data in an array
  - Imports and renders the `Header` and `IslandCard` components
  - Uses `.map()` to loop through islands and create a card for each one

- **`IslandCard.jsx`** — Reusable card component
  - Receives three **props**: `name`, `description`, `tip`
  - Displays island information in a styled box
  - Props allow the same component to display different data

- **`Header.jsx`** — Header component
  - Displays the app title and subtitle
  - Simple example of a functional component with no props

### Configuration Files
- **`main.jsx`** — Entry point
  - Mounts the React app into the HTML DOM
  - Loads the `App` component

- **`index.html`** — HTML shell
  - Contains `<div id="root">` where React renders
  - Links to `main.jsx` to start the app

- **`vite.config.js`** — Build tool configuration
  - Tells Vite how to build and run the React app

- **`package.json`** — Project metadata and dependencies
  - Lists required packages (React, Vite)
  - Defines npm scripts (`npm run dev`, `npm run build`)

---

## How It Works: Component Flow

```
main.jsx
  ↓
App.jsx (renders Header + [3 IslandCards])
  ├─→ Header.jsx (title display)
  ├─→ IslandCard.jsx (Maui card)
  ├─→ IslandCard.jsx (Oahu card)
  └─→ IslandCard.jsx (Kauai card)
```

### Key Concept: Props
**Props** are like function parameters for React components. In `App.jsx`:
```javascript
<IslandCard key={island.id} {...island} />
```
The `{...island}` syntax **spreads** the island object properties as props:
- `name`
- `description`
- `tip`

Then `IslandCard.jsx` **receives** these props:
```javascript
function IslandCard({ name, description, tip }) {
  // Use name, description, tip here
}
```

### Key Concept: .map() for Lists
Instead of writing three separate `<IslandCard>` tags, we loop through an array:
```javascript
islands.map(island => (
  <IslandCard key={island.id} {...island} />
))
```
This creates one card for each island in the array. The `key` prop helps React keep track of which components changed.

---

## Setup & Running

1. **Install dependencies:**
   ```
   npm install
   ```
   Downloads React, ReactDOM, Vite, and other packages.

2. **Start the dev server:**
   ```
   npm run dev
   ```
   Opens the app in your browser (usually `http://localhost:5173`).

3. **Build for production:**
   ```
   npm run build
   ```
   Creates an optimized version in the `dist/` folder.

---

## Styling Approach
This app uses **inline styles** via the `style` prop:
```javascript
<div style={{ color: 'blue', padding: '20px' }}>Content</div>
```
This is fine for small apps. For larger projects, use a CSS file or CSS-in-JS libraries.

---

## What You're Learning
✓ Functional components (no class components)  
✓ JSX syntax (HTML-like code in JavaScript)  
✓ Props (passing data between components)  
✓ ES6 modules (import/export)  
✓ Array `.map()` (rendering lists)  
✓ Basic component composition  

---

## Next Steps to Extend This
- Add more islands to the `islands` array
- Replace inline styles with a `styles.css` file
- Add state with `useState` hook to make cards interactive
- Add a form to filter islands by name
- Fetch island data from an API instead of hard-coding it

---

## Tips for Writing Your Own README
1. **Start with a 1-liner:** What does this project do?
2. **Show the structure:** List files and explain what each does
3. **Explain the flow:** How do components talk to each other?
4. **Include setup steps:** How would someone else run this?
5. **Highlight key concepts:** What React ideas does this teach?
6. **Add next steps:** How could someone extend it?
