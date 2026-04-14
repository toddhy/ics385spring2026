export default function IslandCard({ name, nickname, segment, avgStay, img }) {
  return (
    <div className="island-card">
      <img src={img} alt={`${name} — ${nickname} island photo`} />
      <div className="card-content">
        <h2 className="island-name">{name}</h2>
        <p className="island-nickname">{nickname}</p>
        <span className="segment-badge">{segment}</span>
        <p className="avg-stay">Average Stay: {avgStay} days</p>
      </div>
    </div>
  );
}
