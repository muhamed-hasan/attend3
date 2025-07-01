import dayjs from 'dayjs'

interface AttendanceRecord {
  id: string
  time: string
  employee_id: string
  first_name: string
  last_name: string
  department: string
  shift: string | null
  rname: string | null
  dev?: string
}

interface Props {
  records: AttendanceRecord[]
}

export function AttendanceTable({ records }: Props) {
  if (!records.length) {
    return <div className="p-4 text-gray-500">No records to display</div>
  }

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
          {records.map((record, i) => (
            <tr 
              key={i}
              className="hover:bg-gray-50"
            >
              <td className="py-2 px-3 border">{record.id}</td>
              <td className="py-2 px-3 border">{`${record.first_name} ${record.last_name}`}</td>
              <td className="py-2 px-3 border">{record.department}</td>
              <td className="py-2 px-3 border">{record.shift || '-'}</td>
              <td className="py-2 px-3 border">{record.rname || record.dev || '-'}</td>
              <td className="py-2 px-3 border">
                {dayjs(record.time).format('YYYY-MM-DD HH:mm:ss')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
