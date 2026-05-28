import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Register required chart elements
ChartJS.register(ArcElement, Tooltip, Legend);

const TokenUsage = ({ planDetails }) => {
  const data = {
    labels: ['Tokens Used', 'Tokens Remaining'],
    datasets: [
      {
        data: [planDetails.tokenUsed, planDetails.tokensLeft],
        backgroundColor: [
          'rgba(255, 125, 20, 1)',  // #FF7D14 (orange for tokens used)
          'rgba(224, 224, 224, 1)'  // #E0E0E0 (gray for tokens remaining)
        ],
        hoverBackgroundColor: [
          'rgba(255, 125, 20, 0.8)',  // Lighter orange for hover effect
          'rgba(192, 192, 192, 1)'    // Darker gray for hover effect
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: '70%',  // Creates a ring effect
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <div className="card mt-3">
      <div className="card-header fw-semibold bg-gray">
        <i className="fa fa-layers-counter"></i> Token Usage
      </div>
      <div className="card-body">
        <div className="fs-12">
          <span className="fw-semibold">Total Token Allocated:</span> {planDetails.tokensTotal}
        </div>
        <div className="fs-12">
             <span className="fw-semibold">Token Used: </span> {planDetails.tokenUsed}
         </div>
        <div className="d-flex justify-content-center mt-3">
          <div style={{ width: '250px', height: '250px' }}>
            <Doughnut data={data} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenUsage;
