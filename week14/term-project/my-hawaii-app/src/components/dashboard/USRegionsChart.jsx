import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function USRegionsChart({ regionsData }) {
  const labels = Object.keys(regionsData);
  const data = Object.values(regionsData);
  
  return (
    <Pie
      data={{
        labels,
        datasets: [{
          data,
          backgroundColor: [
            '#FF6B6B',
            '#4ECDC4',
            '#45B7D1',
            '#FFA07A',
            '#98D8C8',
            '#F7DC6F',
            '#BB8FCE',
            '#85C1E2',
            '#F8B88B'
          ],
        }],
      }}
      options={{ 
        responsive: true, 
        plugins: { 
          title: { 
            display: true, 
            text: 'Visitors by US Region' 
          },
          legend: {
            position: 'bottom'
          }
        } 
      }}
    />
  );
}
