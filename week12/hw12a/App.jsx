import IslandCard from './IslandCard';
import Header from './Header';

const islands = [
  {
    id: 1,
    name: "Maui",
    description: "Known as the Valley Isle, famous for Road to Hana and Haleakala.",
    tip: "Visit Haleakala crater at sunrise — arrive 30 min early.",
  },
  {
    id: 2,
    name: "Oahu",
    description: "Home to Honolulu, Waikiki Beach, and Pearl Harbor.",
    tip: "Take TheBus — it covers the entire island and is very affordable.",
  },
  {
    id: 3,
    name: "Kauai",
    description: "The Garden Isle, renowned for Na Pali Coast and Waimea Canyon.",
    tip: "Rent a kayak to reach Honopu Beach — no other access is permitted.",
  },
];

function App() {
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <Header />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {islands.map(island => (
          <IslandCard key={island.id} {...island} />
        ))}
      </div>
    </div>
  );
}

export default App;
