function IslandCard({ name, description, tip }) {
  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '20px',
      backgroundColor: '#f9f9f9',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ color: '#0066cc', marginTop: 0 }}>{name}</h2>
      <p style={{ fontSize: '14px', color: '#555' }}>{description}</p>
      <div style={{ backgroundColor: '#fff3cd', padding: '10px', borderLeft: '4px solid #ffc107', marginTop: '10px' }}>
        <strong>💡 Tip:</strong> {tip}
      </div>
    </div>
  );
}

export default IslandCard;
