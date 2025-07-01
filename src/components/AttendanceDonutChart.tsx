"use client";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useMemo } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  present: number;
  absent: number;
}

export default function AttendanceDonutChart({ present, absent }: Props) {
  const data = useMemo(() => {
    return {
      labels: ["Present", "Absent"],
      datasets: [
        {
          data: [present, absent],
          backgroundColor: ["#65b12a", "#e63946"],
          hoverOffset: 4,
        },
      ],
    };
  }, [present, absent]);

  const options = useMemo(() => ({
    cutout: "70%",
    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },
  }), []);

  return <Doughnut data={data} options={options} />;
}
