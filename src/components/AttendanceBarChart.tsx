"use client";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useMemo } from "react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface Props {
  labels: string[]; // e.g., departments or dates
  data: number[]; // attendance counts
}

export default function AttendanceBarChart({ labels, data }: Props) {
  const chartData = useMemo(() => {
    return {
      labels,
      datasets: [
        {
          label: "Attendance",
          data,
          backgroundColor: "#65b12a",
        },
      ],
    };
  }, [labels, data]);

  const options = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  }), []);

  return <Bar data={chartData} options={options} />;
}
