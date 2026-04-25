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
