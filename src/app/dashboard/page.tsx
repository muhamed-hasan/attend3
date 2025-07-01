'use client'

import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { AttendanceTable } from '@/components/attendance-table'

// Define the expected API response type
interface ApiResponse {
  data: Array<{
    id: string
    time: string
    employee_id: string
    first_name: string
    last_name: string
    department: string
    shift: string | null
    rname: string | null
  }>
  stats: {
    totalEmployees: number
    totalCheckIns: number
    totalDepartments: number
  }
  period: {
    start: string
    end: string
    type: string
  }
}

const periods = ['day', 'week', 'month', 'year', 'custom'] as const

type Period = typeof periods[number]

type AttendanceWithEmployee = {
  id: string
  time: string
  employee_id: string
  first_name: string
  last_name: string
  department: string
  shift: string | null
  rname: string | null
}

export default function DashboardPage() {
  const [period, setPeriod] = useState<Period>('day')
  const [records, setRecords] = useState<AttendanceWithEmployee[]>([])
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<{totalEmployees: number, totalCheckIns: number, totalDepartments: number} | null>(null)

  useEffect(() => {
    const fetchRecords = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams({ period })
        if (period === 'custom') {
          if (!customStart || !customEnd) return
          params.set('start', customStart)
          params.set('end', customEnd)
        }
        const res = await fetch(`/api/attendance?${params.toString()}`)
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.statusText}`)
        }
        const data: ApiResponse = await res.json()
        setRecords(data.data || [])
        setStats(data.stats)
      } catch (error) {
        console.error('Error fetching records:', error)
        setError(error instanceof Error ? error.message : 'Failed to fetch records')
        setRecords([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecords()
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
      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-700 rounded">
          Error: {error}
        </div>
      ) : (
        <>
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-sm font-medium text-gray-500">Total Employees</h3>
                <p className="text-2xl font-semibold">{stats.totalEmployees}</p>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-sm font-medium text-gray-500">Total Check-ins</h3>
                <p className="text-2xl font-semibold">{stats.totalCheckIns}</p>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-sm font-medium text-gray-500">Departments</h3>
                <p className="text-2xl font-semibold">{stats.totalDepartments}</p>
              </div>
            </div>
          )}
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <AttendanceTable records={records} />
            {records.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No attendance records found for the selected period.
              </div>
            )}
          </div>
        </>
      )}
    </main>
  )
}
