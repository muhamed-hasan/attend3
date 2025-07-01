'use client';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler } from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        boxWidth: 12,
        padding: 10,
        usePointStyle: true,
      }
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        display: false
      },
      ticks: {
        stepSize: 1
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  }
};

export function AttendanceTrendChart() {
  // Sample data - replace with your actual data
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [
      {
        label: 'Present',
        data: [12, 15, 3, 5, 2, 3],
        backgroundColor: '#65b12a',
        borderColor: '#65b12a',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#65b12a',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Absent',
        data: [2, 3, 6, 8, 1, 9],
        backgroundColor: '#f87171',
        borderColor: '#f87171',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#f87171',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ],
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 h-80">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Attendance Trend</h3>
      <Line data={data} options={{
        ...options,
        plugins: {
          ...options.plugins,
          legend: {
            ...options.plugins.legend,
            position: 'bottom',
          },
        },
      }} />
    </div>
  );
}

export function DepartmentAttendanceChart() {
  // Sample data - replace with your actual data
  const data = {
    labels: ['HR', 'Engineering', 'Marketing', 'Sales', 'Support'],
    datasets: [
      {
        label: 'Present',
        data: [12, 19, 3, 5, 2],
        backgroundColor: '#65b12a',
        borderRadius: 4,
      },
      {
        label: 'Absent',
        data: [2, 3, 6, 8, 1],
        backgroundColor: '#f87171',
        borderRadius: 4,
      }
    ],
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 h-80">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Department-wise Attendance</h3>
      <Bar data={data} options={{
        ...options,
        plugins: {
          ...options.plugins,
          legend: {
            ...options.plugins.legend,
            position: 'bottom',
          },
        },
      }} />
    </div>
  );
}

export function ShiftWiseAttendance() {
  // Sample data - replace with your actual data
  const data = {
    labels: ['Morning', 'Afternoon', 'Night'],
    datasets: [
      {
        label: 'Present',
        data: [65, 59, 80],
        backgroundColor: '#65b12a',
        borderRadius: 4,
      },
      {
        label: 'Absent',
        data: [12, 15, 8],
        backgroundColor: '#f87171',
        borderRadius: 4,
      }
    ],
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 h-80">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Shift-wise Attendance</h3>
      <Bar data={data} options={{
        ...options,
        plugins: {
          ...options.plugins,
          legend: {
            ...options.plugins.legend,
            position: 'bottom',
          },
        },
      }} />
    </div>
  );
}

export function TimeInOutChart() {
  // Sample data - replace with your actual data
  const data = {
    labels: ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'],
    datasets: [
      {
        label: 'Time In',
        data: [12, 19, 3, 5, 2, 3, 7],
        borderColor: '#65b12a',
        backgroundColor: 'rgba(101, 177, 42, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Time Out',
        data: [2, 3, 6, 8, 1, 9, 4],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      }
    ],
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 h-80">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Time In/Out Analysis</h3>
      <Line data={data} options={{
        ...options,
        plugins: {
          ...options.plugins,
          legend: {
            ...options.plugins.legend,
            position: 'bottom',
          },
        },
      }} />
    </div>
  );
}

export function DepartmentDonutChart({ present, absent, department }: { present: number, absent: number, department: string }) {
  const data = {
    labels: ['Present', 'Absent'],
    datasets: [
      {
        data: [present, absent],
        backgroundColor: ['#65b12a', '#f87171'],
        borderWidth: 2,
      },
    ],
  };
  const options = {
    cutout: '70%',
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          boxWidth: 12,
          padding: 10,
          usePointStyle: true,
        },
      },
      tooltip: {
        enabled: true,
      },
    },
  };
  return (
    <div className="flex flex-col items-center justify-center">
      <Doughnut data={data} options={options} style={{ maxWidth: 180, maxHeight: 180 }} />
      <div className="flex gap-2 mt-2 text-xs">
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full bg-[#65b12a]"></span>Present</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full bg-[#f87171]"></span>Absent</span>
      </div>
    </div>
  );
}
