import React from 'react';
import { Bar } from 'react-chartjs-2';

const ScoreHistogram = () => {
  const data = {
    labels: ['0-50', '51-70', '71-85', '86-100'],
    datasets: [
      {
        label: 'Trainees',
        data: [2, 5, 8, 3],
        backgroundColor: '#2196f3',
      },
    ],
  };

  return (
    <div className="histogram-box">
      <h2>📉 Score Distribution</h2>
      <Bar data={data} />
    </div>
  );
};

export default ScoreHistogram;