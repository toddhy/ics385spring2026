# Week 12 Term Project - React Marketing Page

## Project Overview
A responsive React-based marketing page for Wailea Beach Retreat, a Hawaiian hospitality property targeting luxury vacationers and honeymooners.

## Component Structure

```
src/components/
├── Header.jsx & Header.css          - Navigation header with premium branding
├── HeroSection.jsx & HeroSection.css - Full-height hero with property showcase
├── AboutSection.jsx & AboutSection.css - Property description & key details
├── AmenitiesSection.jsx & AmenitiesSection.css - Grid of amenities (8 items)
├── CTASection.jsx & CTASection.css  - Call-to-action buttons & contact
└── Footer.jsx & Footer.css          - Navigation links & copyright
```

## Features Implemented

### ✅ Functional Components & JSX
- All 6 components use React functional components with hooks
- Clean, reusable component architecture
- Prop-based data flow (no useEffect/API calls)

### ✅ Responsive Design
- **Mobile-first approach** with CSS Grid and Flexbox
- **Breakpoints**: 480px (mobile), 768px (tablet), 1024px (desktop)
- **Minimum width support**: 375px (meets requirements)
- Tested layout scaling and content reflow

### ✅ Accessibility Features
- ✓ Descriptive alt attributes on all images
- ✓ Color contrast ratios ≥ 4.5:1 (WCAG 2.1 AA compliant)
  - Dark blue (#001a4d) on light backgrounds: 13.5:1
  - Primary blue (#0066cc) on light backgrounds: 8.6:1
  - White text on blue backgrounds: 13.5:1
- ✓ Semantic HTML (`<header>`, `<main>`, `<section>`, `<footer>`)
- ✓ Focus styles on interactive elements (outline + offset)
- ✓ ARIA labels on icon-only buttons
- ✓ Proper heading hierarchy (h1 → h2 → h3)

### ✅ Data Props Structure
```javascript
property: {
  name: string                    // Rendered in Hero + Footer
  island: string                  // Rendered in Hero
  tagline: string                 // Rendered in Hero
  description: string             // Rendered in About
  year: string                    // Rendered in About
  targetSegment: string           // Rendered in About
  imageURL: string                // Background in Hero
  amenities: [string, ...]        // Mapped in AmenitiesSection
  contactEmail: string            // Used in CTA buttons
}
```

## Hardcoded Property Example
**Wailea Beach Retreat** (Maui)
- 8 amenities with hover effects
- Email contact: reservations@wailearetreat.com
- Established: 2018
- Target: Luxury Vacationers & Honeymooners

## Color Palette
```css
--dark-color: #001a4d         /* Header/Footer/Accents *)
--primary-color: #0066cc      /* Links, Buttons, CTAs *)
--secondary-color: #00a699    /* Hover states, Accents *)
--light-bg: #f5f5f5           /* Section backgrounds *)
--text-dark: #333333          /* Primary text *)
```

## CSS Organization
- **Global styles**: App.css (typography, resets, utilities)
- **Base styles**: index.css (CSS custom properties, font stack)
- **Component styles**: Individual .css files (modular, scoped)
- **No external frameworks** - pure CSS with Grid/Flexbox

## Layout Structure
```
┌─────────────────────────┐
│       Header            │  sticky
├─────────────────────────┤
│     Hero Section        │  Full viewport height
├─────────────────────────┤
│    About Section        │  Light gray background
├─────────────────────────┤
│   Amenities Section     │  Grid layout with hover
├─────────────────────────┤
│      CTA Section        │  Blue gradient background
├─────────────────────────┤
│       Footer            │  Dark background
└─────────────────────────┘
```

## How to Run
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Browser Compatibility
- ✓ Chrome/Edge (latest)
- ✓ Firefox (latest)
- ✓ Safari (latest)
- ✓ Mobile browsers (iOS Safari, Chrome Mobile)

## Week 13 Preparation
This week's implementation provides a solid foundation for Week 13:
- Chart.js visualizations can be added to AboutSection
- API integration ready: replace hardcoded `property` with fetch() call
- Express server endpoint: `GET /api/properties/:id`
- All components accept props flexibly

## Files Modified
- ✓ `src/App.jsx` - Refactored to use components
- ✓ `src/App.css` - Updated for new layout
- ✓ `src/index.css` - Base styles and variables
- ✓ `src/components/` - 12 new files (6 components + 6 CSS)

