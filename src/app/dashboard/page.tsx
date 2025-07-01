'use client'

import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import dynamic from 'next/dynamic';
const AttendanceTable = dynamic(() => import('./AttendanceTableWithRecords').then(mod => mod.AttendanceTable), { ssr: false });
import Sidebar from '@/components/Sidebar'
import StatCard from '@/components/StatCard'
import { DepartmentDonutChart } from '@/components/AttendanceCharts'

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
    presentCount: number
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
  const [selectedDept, setSelectedDept] = useState<string>('All')
  const [selectedShift, setSelectedShift] = useState<string>('All')
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<{totalEmployees: number, totalCheckIns: number, totalDepartments: number, presentCount: number} | null>(null)

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

  // Compute department attendance counts for bar chart
  const departmentLabels = Array.from(
    records.reduce((set, r) => set.add(r.department), new Set<string>())
  );
  const departmentCounts = departmentLabels.map(
    (d) => records.filter((r) => r.department === d).length
  );

  // Options for filters
  const deptOptions = ['All', ...departmentLabels]
  const shiftOptions = ['All', ...Array.from(records.reduce((set, r) => set.add(r.shift || 'None'), new Set<string>()))]

  // Filtered records
  const displayedRecords = records.filter(r => (selectedDept === 'All' || r.department === selectedDept) && (selectedShift === 'All' || (r.shift || 'None') === selectedShift))

  // Use backend stats for present/absent/rate
  const totalEmployees = stats?.totalEmployees || 0;
  const presentCount = stats?.presentCount || 0;
  const absentCount = totalEmployees - presentCount;
  const attendanceRate = totalEmployees > 0 ? (presentCount / totalEmployees) * 100 : 0;

  // Department-wise stats (first two departments for demo)
  const departmentStats = departmentLabels.slice(0, 2).map(dept => {
    const deptRecords = records.filter(r => r.department === dept);
    const deptEmployeeIds = Array.from(new Set(deptRecords.map(r => r.employee_id)));
    const deptTotal = deptEmployeeIds.length;
    const deptPresentIds = Array.from(new Set(deptRecords.filter(r => r.rname !== null).map(r => r.employee_id)));
    const deptPresent = deptPresentIds.length;
    const deptAbsent = deptTotal - deptPresent;
    const deptRate = deptTotal > 0 ? (deptPresent / deptTotal) * 100 : 0;
    return {
      name: dept,
      total: deptTotal,
      present: deptPresent,
      absent: deptAbsent,
      rate: deptRate,
    };
  });

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-4 text-[#264847]">Attendance Dashboard</h1>
      {/* Top stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow flex flex-col items-center">
          <div className="text-gray-500 text-sm mb-1">Total Employees</div>
          <div className="text-2xl font-bold">{totalEmployees}</div>
        </div>
        <div className="bg-white p-4 rounded shadow flex flex-col items-center">
          <div className="text-green-600 text-sm mb-1">Present</div>
          <div className="text-2xl font-bold">{presentCount}</div>
        </div>
        <div className="bg-white p-4 rounded shadow flex flex-col items-center">
          <div className="text-red-600 text-sm mb-1">Absent</div>
          <div className="text-2xl font-bold">{absentCount}</div>
        </div>
        <div className="bg-white p-4 rounded shadow flex flex-col items-center">
          <div className="text-purple-600 text-sm mb-1">Attendance Rate</div>
          <div className="text-2xl font-bold">{attendanceRate.toFixed(1)}%</div>
        </div>
      </div>
      {/* Department donut cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {departmentStats.map((dept, idx) => (
          <div key={dept.name} className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <div className="flex items-center mb-2">
              <span className={`inline-block w-3 h-3 rounded-full mr-2 ${idx === 0 ? 'bg-blue-600' : 'bg-purple-600'}`}></span>
              <span className="font-semibold text-lg">{dept.name} Department</span>
            </div>
            <div className="flex gap-8 mb-2">
              <div className="flex flex-col items-center">
                <div className="text-gray-500 text-xs">Total</div>
                <div className="font-bold text-lg">{dept.total}</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-green-600 text-xs">Present</div>
                <div className="font-bold text-lg">{dept.present}</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-red-600 text-xs">Absent</div>
                <div className="font-bold text-lg">{dept.absent}</div>
              </div>
            </div>
            <div className="text-blue-700 text-sm mb-2">Attendance Rate <span className="font-bold">{dept.rate.toFixed(1)}%</span></div>
            <DepartmentDonutChart present={dept.present} absent={dept.absent} department={dept.name} />
          </div>
        ))}
      </div>
       <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
          <div className="flex flex-wrap items-center gap-4">
            {/* Period Select */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
              <div className="relative">
                <select
                  value={period}
                  onChange={(e)=>setPeriod(e.target.value as Period)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#65b12a] focus:border-[#65b12a] sm:text-sm rounded-lg border"
                >
                  {periods.map(p=> (
                    <option key={p} value={p} className="capitalize">{p}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Department Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <div className="relative">
                <select
                  value={selectedDept}
                  onChange={(e)=>setSelectedDept(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#65b12a] focus:border-[#65b12a] sm:text-sm rounded-lg border"
                >
                  {deptOptions.map(d=> (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Shift Filter */}
            <div className="flex-1 min-w-[180px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Shift</label>
              <div className="relative">
                <select
                  value={selectedShift}
                  onChange={(e)=>setSelectedShift(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#65b12a] focus:border-[#65b12a] sm:text-sm rounded-lg border"
                >
                  {shiftOptions.map(s=> (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Custom Date Range */}
            {period === 'custom' && (
              <div className="flex-1 min-w-[400px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    className="block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#65b12a] focus:border-[#65b12a] sm:text-sm rounded-lg border"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="date"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    className="block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#65b12a] focus:border-[#65b12a] sm:text-sm rounded-lg border"
                  />
                </div>
              </div>
            )}
          </div>
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
            <AttendanceTable records={displayedRecords} />
            {records.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No attendance records found for the selected period.
              </div>
            )}
          </div>
        </>
      )}
    </main>
    </div>
  )
}
