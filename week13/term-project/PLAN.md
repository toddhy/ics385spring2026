# Week 13c - Admin Dashboard (3-Day Sprint)

**Goal:** Build VisitorStatsDashboard with 4 charts using DBEDT tourism data. All JSX, no EJS.

---

## ⚡ Prerequisites Check (30 min)

- [ ] Week 11 backend running: `npm start` → connects to MongoDB
- [ ] Test: `http://localhost:3000/api/properties` returns JSON
- [ ] Test: `http://localhost:3000/properties/[id]/reviews` returns array
- [ ] Week 12 React app: `npm run dev` → shows Hero, About, Amenities, CTA
- [ ] OpenWeatherMap API key ready (from openweathermap.org)
- [ ] DBEDT CSV downloaded (3-5 years post-COVID from dbedt.hawaii.gov)

**All pass? → Go to Day 1**

---

## 📋 Dashboard Requirements (from PRD)

**4 Components to Build:**
1. **ArrivalsByMonth** (Bar Chart) - Monthly visitor arrivals
2. **PlaceOfOrigin** (Pie Chart) - Where visitors come from (CA, NY, TX, Other)
3. **Occupancy** (Stat) - Average occupancy percentage
4. **Spending** (Stat) - Average visitor spending in dollars

**Layout:** Grid with 2x2 chart arrangement, responsive mobile

---

## 🚀 Day 1: Setup (2 hours)

### 1. Install packages
```bash
cd c:\ics385spring2026\week12\term-project\my-hawaii-app
npm install chart.js react-chartjs-2
```

### 2. Create folder structure
```bash
mkdir -p src/components/dashboard src/data
```

### 3. Add .env (if missing)
```
VITE_API_BASE_URL=http://localhost:3000
VITE_WEATHER_KEY=your_key
```

### 4. Create tourism-data.json
```
src/data/tourism-data.json
```

**Required format:**
```json
{
  "months": ["Jan 2021", "Feb 2021", "Mar 2021"],
  "arrivals": [123456, 134567, 145678],
  "placeOfOrigin": {
    "California": 45000,
    "New York": 32000,
    "Texas": 28000,
    "Other": 15000
  },
  "avgOccupancy": 82,
  "avgSpending": 1250
}
```

**How to get the data:**
- Go to dbedt.hawaii.gov, download CSV
- Convert to JSON using https://convertcsv.com/csv-to-json.htm
- Format as above, save in src/data/

### ✅ **Test:** Both servers running, no errors

---

## 📊 Day 2: Build Components (4-5 hours)

**Create 5 files:**

### 1. ArrivalsByMonth.jsx
{% raw %}
```javascript
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ArrivalsByMonth({ months, arrivals }) {
  return (
    <Bar
      data={{
        labels: months,
        datasets: [{
          label: 'Monthly Arrivals',
          data: arrivals,
          backgroundColor: '#0EA5E9',
        }],
      }}
      options={{ responsive: true, plugins: { title: { display: true, text: 'Visitor Arrivals by Month' } } }}
    />
  );
}
```
{% endraw %}

### 2. PlaceOfOrigin.jsx
{% raw %}
```javascript
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PlaceOfOrigin({ placeData }) {
  const labels = Object.keys(placeData);
  const data = Object.values(placeData);
  
  return (
    <Pie
      data={{
        labels,
        datasets: [{
          data,
          backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'],
        }],
      }}
      options={{ responsive: true, plugins: { title: { display: true, text: 'Visitors by Place of Origin' } } }}
    />
  );
}
```
{% endraw %}

### 3. OccupancyCard.jsx
```javascript
export default function OccupancyCard({ occupancy }) {
  return (
    <div className="stat-card">
      <div className="stat-label">Average Occupancy</div>
      <div className="stat-value">{occupancy}%</div>
    </div>
  );
}
```

### 4. SpendingCard.jsx
```javascript
export default function SpendingCard({ spending }) {
  return (
    <div className="stat-card">
      <div className="stat-label">Average Visitor Spending</div>
      <div className="stat-value">${spending.toLocaleString()}</div>
    </div>
  );
}
```

### 5. VisitorStatsDashboard.jsx (Main)
```javascript
import { useState, useEffect } from 'react';
import ArrivalsByMonth from './ArrivalsByMonth';
import PlaceOfOrigin from './PlaceOfOrigin';
import OccupancyCard from './OccupancyCard';
import SpendingCard from './SpendingCard';
import tourismData from '../data/tourism-data.json';
import './Dashboard.css';

export default function VisitorStatsDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <h1>Visitor Statistics Dashboard</h1>
      <div className="dashboard-grid">
        <div className="chart-box">
          <ArrivalsByMonth months={tourismData.months} arrivals={tourismData.arrivals} />
        </div>
        <div className="chart-box">
          <PlaceOfOrigin placeData={tourismData.placeOfOrigin} />
        </div>
        <OccupancyCard occupancy={tourismData.avgOccupancy} />
        <SpendingCard spending={tourismData.avgSpending} />
      </div>
    </div>
  );
}
```

### 6. Dashboard.css
```css
.dashboard {
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.dashboard h1 {
  color: white;
  text-align: center;
  margin-bottom: 3rem;
  font-size: 2.5rem;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.chart-box {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.stat-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  text-align: center;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
  text-transform: uppercase;
  margin-bottom: 1rem;
  letter-spacing: 0.05em;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: bold;
  color: #0EA5E9;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: white;
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .dashboard h1 {
    font-size: 1.8rem;
  }
}
```

### ✅ **Test After Each Component:**
- [ ] ArrivalsByMonth renders bar chart
- [ ] PlaceOfOrigin renders pie chart
- [ ] OccupancyCard shows occupancy %
- [ ] SpendingCard shows spending $
- [ ] Dashboard grid layout works
- [ ] Mobile responsive (DevTools)
- [ ] No console errors

---

## ✅ Day 3: Integration & Submit (2-3 hours)

### 1. Add to App.jsx
```javascript
import { useState } from 'react';
import VisitorStatsDashboard from './components/dashboard/VisitorStatsDashboard';

export default function App() {
  const [showDashboard, setShowDashboard] = useState(false);

  if (showDashboard) {
    return (
      <>
        <button onClick={() => setShowDashboard(false)}>← Back to Marketing</button>
        <VisitorStatsDashboard />
      </>
    );
  }

  return (
    // existing marketing page JSX
    <>
      <Header />
      <HeroSection />
      <AboutSection />
      <AmenitiesSection />
      <CTASection />
      <Footer />
      <button onClick={() => setShowDashboard(true)}>View Dashboard</button>
    </>
  );
}
```

### 2. Full Testing Checklist
- [ ] Backend running on localhost:3000
- [ ] React running on localhost:5173
- [ ] All 4 dashboard components render correctly
- [ ] Charts show data from tourism-data.json
- [ ] Responsive on mobile (DevTools)
- [ ] Loads in under 3 seconds
- [ ] No console errors
- [ ] Navigation between marketing/dashboard works

### 3. Verify Against PRD
- [ ] ✅ Bar chart (ArrivalsByMonth)
- [ ] ✅ Pie chart (PlaceOfOrigin)
- [ ] ✅ Occupancy displayed
- [ ] ✅ Spending displayed
- [ ] ✅ Mobile responsive
- [ ] ✅ Fast load time
- [ ] ✅ All JSX (no EJS)

### 4. Create README.md
```markdown
# Week 13c - Visitor Statistics Dashboard

## Setup
1. npm install
2. Add .env with VITE_API_BASE_URL and VITE_WEATHER_KEY
3. Add src/data/tourism-data.json (download from dbedt.hawaii.gov)
4. npm run dev

## Components
- ArrivalsByMonth (Bar chart)
- PlaceOfOrigin (Pie chart)
- OccupancyCard (Stat)
- SpendingCard (Stat)
- VisitorStatsDashboard (Main container)

## Data
Tourism data from DBEDT Hawaii (3-5 years post-COVID)
```

### 5. Push to GitHub
```bash
git add .
git commit -m "Week 13c: Visitor Statistics Dashboard with Chart.js"
git push
```

---

## 🐛 Troubleshooting

| Issue | Fix |
|-------|-----|
| Chart not rendering | Check ChartJS components registered |
| tourism-data.json error | Verify JSON is valid: https://jsonlint.com/ |
| Chart.js not found | `npm install chart.js react-chartjs-2` |
| Styling broken | Clear browser cache (Ctrl+Shift+Delete) |
| Cannot find module | Make sure file paths match exactly |

---

## ✔️ Final Checklist
- [ ] All 4 components working
- [ ] tourism-data.json exists and valid
- [ ] No console errors
- [ ] Mobile responsive
- [ ] README written
- [ ] GitHub pushed
- [ ] Submitted by April 19, 2026
