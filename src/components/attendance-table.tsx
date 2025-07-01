import dayjs from 'dayjs'
import { Attendance, Employee } from '@/types/attendance'

interface Props {
  records: (Attendance & { employee: Employee })[]
}

export function AttendanceTable({ records }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="py-2 px-3 border">ID</th>
            <th className="py-2 px-3 border">Name</th>
            <th className="py-2 px-3 border">Department</th>
            <th className="py-2 px-3 border">Shift</th>
            <th className="py-2 px-3 border">Device</th>
            <th className="py-2 px-3 border">Time</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={`${r.id}-${r.time.toString()}`} className="hover:bg-gray-50">
              <td className="py-2 px-3 border">{r.employee.id}</td>
              <td className="py-2 px-3 border">{`${r.employee.first_name} ${r.employee.last_name}`}</td>
              <td className="py-2 px-3 border">{r.employee.department}</td>
              <td className="py-2 px-3 border">{r.employee.shift ?? '-'}</td>
              <td className="py-2 px-3 border">{r.dev}</td>
              <td className="py-2 px-3 border">{dayjs(r.time).format('YYYY-MM-DD HH:mm:ss')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
