import { useState, useEffect } from 'react';
import ArrivalsByMonth from './ArrivalsByMonth';
import PlaceOfOrigin from './PlaceOfOrigin';
import OccupancyCard from './OccupancyCard';
import SpendingCard from './SpendingCard';
import './Dashboard.css';

export default function VisitorStatsDashboard() {
  const [tourismData, setTourismData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTourismData = async () => {
      try {
        const response = await fetch('/api/tourism');
        
        if (!response.ok) {
          throw new Error('Failed to fetch tourism data');
        }
        
        const data = await response.json();
        
        // Transform API data into chart format
        const months = data.map(d => d.month);
        const arrivals = data.map(d => d.arrivals);
        const expenditures = data.map(d => d.expenditure);
        const lengthOfStays = data.map(d => d.lengthOfStay);
        
        // Calculate averages
        const avgArrivals = Math.round(arrivals.reduce((a, b) => a + b, 0) / arrivals.length);
        const avgExpenditure = Math.round(expenditures.reduce((a, b) => a + b, 0) / expenditures.length);
        const avgLengthOfStay = (lengthOfStays.reduce((a, b) => a + b, 0) / lengthOfStays.length).toFixed(2);
        
        setTourismData({
          months,
          arrivals,
          marketShare: {
            'US Total': 162625000,
            'Japan': 1520,
            'Canada': 21633,
            'Europe': 2359,
            'China': 1003
          },
          avgOccupancy: 82,
          avgSpending: avgExpenditure,
          stats: {
            avgArrivals,
            avgExpenditure,
            avgLengthOfStay
          }
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tourism data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTourismData();
  }, []);

  if (loading) return <div className="dashboard-loading">Loading tourism dashboard...</div>;
  if (error) return <div className="dashboard-error">Error: {error}</div>;
  if (!tourismData) return null;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Tourism Statistics Dashboard</h1>
        <p>Maui Island Visitor Data</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Monthly Arrivals</h3>
          <ArrivalsByMonth months={tourismData.months} arrivals={tourismData.arrivals} />
        </div>

        <div className="dashboard-card">
          <h3>Visitor Origin</h3>
          <PlaceOfOrigin data={tourismData.marketShare} />
        </div>

        <OccupancyCard occupancy={tourismData.avgOccupancy} />
        <SpendingCard spending={tourismData.avgSpending} />
      </div>

      <div className="dashboard-stats">
        <div className="stat-item">
          <span className="stat-label">Avg Monthly Arrivals:</span>
          <span className="stat-value">{tourismData.stats.avgArrivals.toLocaleString()}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Avg Expenditure ($ millions):</span>
          <span className="stat-value">${tourismData.stats.avgExpenditure.toFixed(2)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Avg Length of Stay (days):</span>
          <span className="stat-value">{tourismData.stats.avgLengthOfStay}</span>
        </div>
      </div>
    </div>
  );
}
