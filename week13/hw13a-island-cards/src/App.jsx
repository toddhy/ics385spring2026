import './App.css'
import IslandList from './IslandList'

const islands = [
  { id: 1, name: "Maui", nickname: "Valley Isle", segment: "Honeymoon", avgStay: 6.2, img: "https://picsum.photos/300/200?random=1" },
  { id: 2, name: "O'ahu", nickname: "Gathering Place", segment: "First-time", avgStay: 4.8, img: "https://picsum.photos/300/200?random=2" },
  { id: 3, name: "Kaua'i", nickname: "Garden Isle", segment: "Eco-tourist", avgStay: 7.1, img: "https://picsum.photos/300/200?random=3" },
  { id: 4, name: "Hawai'i", nickname: "Big Island", segment: "Adventure", avgStay: 8.3, img: "https://picsum.photos/300/200?random=4" },
  { id: 5, name: "Molokai", nickname: "Friendly Island", segment: "Adventure", avgStay: 9.3, img: "https://picsum.photos/300/200?random=5" },
]

function App() {
  return (
    <div className="App">
      <IslandList islands={islands} />
    </div>
  )
}

export default App
