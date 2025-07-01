"use client";
interface StatCardProps {
  title: string;
  value: number;
  percentage?: number;
  color?: string; // hex color
}

export default function StatCard({ title, value, percentage, color = "#65b12a" }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 w-full">
      <h4 className="text-sm text-gray-500 mb-2">{title}</h4>
      <div className="text-3xl font-semibold mb-2">{value}</div>
      {percentage !== undefined && (
        <div className="w-full bg-gray-100 h-2 rounded">
          <div
            className="h-2 rounded"
            style={{ width: `${percentage}%`, backgroundColor: color }}
          />
        </div>
      )}
    </div>
  );
}
