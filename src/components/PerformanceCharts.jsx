import React from 'react';
import { Line } from 'react-chartjs-2';

const PerformanceChart = () => {
  const data = {
    labels: ['Module 1', 'Module 2', 'Module 3'],
    datasets: [
      {
        label: 'Average Score (%)',
        data: [75, 82, 68],
        borderColor: '#4caf50',
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="chart-box">
      <h2>📈 Performance Trends</h2>
      <Line data={data} />
    </div>
  );
};

export default PerformanceChart;