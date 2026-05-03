import { useState, useEffect } from 'react';
import ArrivalsByMonth from './ArrivalsByMonth';
import PlaceOfOrigin from './PlaceOfOrigin';
import USRegionsChart from './USRegionsChart';
import SpendingCard from './SpendingCard';
import './Dashboard.css';

export default function VisitorStatsDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [tourismResponse, usRegionsResponse, marketShareResponse] = await Promise.all([
          fetch('/api/tourism'),
          fetch('/api/us-regions'),
          fetch('/api/tourism/market-share')
        ]);

        if (!tourismResponse.ok) {
          throw new Error('Failed to fetch tourism data');
        }

        if (!usRegionsResponse.ok) {
          throw new Error('Failed to fetch US regions data');
        }

        if (!marketShareResponse.ok) {
          throw new Error('Failed to fetch market share data');
        }

        const tourismData = await tourismResponse.json();
        const usRegionsData = await usRegionsResponse.json();
        const marketShareData = await marketShareResponse.json();

        const months = tourismData.map((entry) => entry.month);
        const arrivals = tourismData.map((entry) => entry.arrivals);
        const expenditures = tourismData.map((entry) => entry.expenditure);

        const avgSpending = Math.round(
          (expenditures.reduce((total, value) => total + value, 0) / expenditures.length) * 100
        ) / 100;

        const usRegionTotals = usRegionsData.reduce(
          (totals, entry) => {
            totals['Pacific Region'] += entry.pacificRegion;
            totals['Mountain Region'] += entry.mountainRegion;
            totals['W.N. Central Region'] += entry.wnCentralRegion;
            totals['W.S. Central Region'] += entry.wsCentralRegion;
            totals['E.N. Central Region'] += entry.enCentralRegion;
            totals['E.S. Central Region'] += entry.esCentralRegion;
            totals['New England Region'] += entry.newEnglandRegion;
            totals['Mid Atlantic Region'] += entry.midAtlanticRegion;
            totals['S. Atlantic Region'] += entry.sAtlanticRegion;
            return totals;
          },
          {
            'Pacific Region': 0,
            'Mountain Region': 0,
            'W.N. Central Region': 0,
            'W.S. Central Region': 0,
            'E.N. Central Region': 0,
            'E.S. Central Region': 0,
            'New England Region': 0,
            'Mid Atlantic Region': 0,
            'S. Atlantic Region': 0
          }
        );

        setData({
          months,
          arrivals,
          placeOfOrigin: marketShareData,
          usRegions: usRegionTotals,
          avgSpending
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="loading">Error: {error}</div>;
  if (!data) return <div className="loading">No data available</div>;

  return (
    <div className="dashboard">
      <h1>Visitor Statistics Dashboard</h1>
      <div className="dashboard-grid">
        <div className="chart-box">
          <ArrivalsByMonth months={data.months} arrivals={data.arrivals} />
        </div>
        <div className="chart-box">
          <PlaceOfOrigin placeData={data.placeOfOrigin} />
        </div>
        <div className="chart-box">
          <USRegionsChart regionsData={data.usRegions} />
        </div>
        <div className="chart-box">
          <SpendingCard spending={data.avgSpending} />
        </div>
      </div>
    </div>
  );
}
