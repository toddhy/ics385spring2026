import { useState, useEffect } from 'react';
import ArrivalsByMonth from './ArrivalsByMonth';
import PlaceOfOrigin from './PlaceOfOrigin';
import OccupancyCard from './OccupancyCard';
import SpendingCard from './SpendingCard';
import tourismData from '../../data/tourism-data.json';
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
