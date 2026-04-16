export default function SpendingCard({ spending }) {
  return (
    <div className="stat-card">
      <div className="stat-label">Average Visitor Spending</div>
      <div className="stat-value">${spending.toLocaleString()}</div>
    </div>
  );
}
