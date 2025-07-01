'use client'

import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { Attendance, Employee } from '@/types/attendance'
import { AttendanceTable } from '@/components/attendance-table'

const periods = ['day', 'week', 'month', 'year', 'custom'] as const

type Period = typeof periods[number]

type AttendanceWithEmployee = Attendance & { employee: Employee }

export default function DashboardPage() {
  const [period, setPeriod] = useState<Period>('day')
  const [records, setRecords] = useState<AttendanceWithEmployee[]>([])
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')

  useEffect(() => {
    const fetchRecords = async () => {
      const params = new URLSearchParams({ period })
      if (period === 'custom') {
        if (!customStart || !customEnd) return
        params.set('start', customStart)
        params.set('end', customEnd)
      }
      const res = await fetch(`/api/attendance?${params.toString()}`)
      const json = (await res.json()) as AttendanceWithEmployee[]
      setRecords(json)
    }

    fetchRecords().catch(console.error)
  }, [period, customStart, customEnd])

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Attendance Dashboard</h1>
      <div className="flex flex-wrap gap-2 mb-6">
        {periods.map((p) => (
          <button
            key={p}
            className={`px-3 py-1 rounded border ${period === p ? 'bg-blue-600 text-white' : 'bg-white'}`}
            onClick={() => setPeriod(p)}
          >
            {p}
          </button>
        ))}
        {period === 'custom' && (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="border px-2 py-1"
            />
            <span>to</span>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="border px-2 py-1"
            />
          </div>
        )}
      </div>
      <AttendanceTable records={records} />
      {records.length === 0 && (
        <p className="mt-4 text-gray-500">No attendance records for the selected period.</p>
      )}
    </main>
  )
}
