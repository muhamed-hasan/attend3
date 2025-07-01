import dayjs from 'dayjs'

interface AttendanceRecord {
  id: string
  time: string

  first_name: string
  last_name: string
  department: string
  shift: string | null
  rname: string | null

}

interface Props {
  records: AttendanceRecord[]
}

export function AttendanceTable({ records }: Props) {
  if (!records.length) {
    return <div className="p-4 text-gray-500">No records to display</div>
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shift</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {records.map((record, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-900">{record.id}</td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-medium mr-3">
                      {`${record.first_name[0]}${record.last_name[0]}`.toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{`${record.first_name} ${record.last_name}`}</div>
                      <div className="text-xs text-gray-500">ID: {record.id}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{record.department}</div>
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    {record.shift || 'N/A'}
                  </span>
                </td>
                <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">
                  {dayjs(record.time).format('MMM D, YYYY')}<br />
                  <span className="text-xs text-gray-400">{dayjs(record.time).format('h:mm A')}</span>
                </td>
                <td className="py-4 px-4 whitespace-nowrap text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Present
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
