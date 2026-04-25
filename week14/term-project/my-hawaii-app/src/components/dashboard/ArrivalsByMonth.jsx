import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ArrivalsByMonth({ months, arrivals }) {
  return (
    <Bar
      data={{
        labels: months,
        datasets: [{
          label: 'Monthly Arrivals',
          data: arrivals,
          backgroundColor: '#0EA5E9',
        }],
      }}
      options={{ responsive: true, plugins: { title: { display: true, text: 'Visitor Arrivals by Month' } } }}
    />
  );
}
