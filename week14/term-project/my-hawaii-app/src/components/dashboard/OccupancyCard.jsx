export default function OccupancyCard({ occupancy }) {
  return (
    <div className="stat-card">
      <div className="stat-label">Average Occupancy</div>
      <div className="stat-value">{occupancy}%</div>
    </div>
  );
}
