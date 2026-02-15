import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/**
 * Komponen untuk menampilkan bar chart analisis distractor
 * @param {Object} props - Component props
 * @param {Array} props.distractorData - Data dari result.distractors
 */
const DistractorChart = ({ distractorData }) => {
  if (!distractorData || distractorData.length === 0) {
    return null;
  }

  // Sort data by option name (A, B, C, D)
  const sortedData = [...distractorData].sort((a, b) => a.option.localeCompare(b.option));

  const data = {
    labels: sortedData.map(d => d.option),
    datasets: [
      {
        label: 'Jumlah Pemilih',
        data: sortedData.map(d => d.count),
        backgroundColor: sortedData.map(d => d.isCorrect ? 'rgba(22, 163, 74, 0.6)' : 'rgba(203, 213, 225, 0.6)'),
        borderColor: sortedData.map(d => d.isCorrect ? 'rgba(22, 163, 74, 1)' : 'rgba(203, 213, 225, 1)'),
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Distribusi Jawaban Siswa',
        font: {
          size: 12,
          weight: 'bold',
        },
        color: '#475569',
        padding: {
          bottom: 10,
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            label += context.parsed.y;
            const item = sortedData[context.dataIndex];
            label += ` (${item.percentage})`;
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1, // Only show whole numbers
        }
      },
    },
  };

  return (
    <div className="mt-4 h-48 bg-white p-2 rounded-lg border border-slate-200">
      <Bar options={options} data={data} />
    </div>
  );
};

export default DistractorChart;
