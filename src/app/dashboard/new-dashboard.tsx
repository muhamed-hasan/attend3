'use client'

import { useState, useEffect } from 'react'
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval } from 'date-fns'

interface AttendanceRecord {
  id: string
  time: string
  employee: {
    id: number
    first_name: string
    last_name: string
    department: string
    shift: string | null
  }
  rname: string | null
}

type Period = 'day' | 'week' | 'month' | 'year' | 'custom'

export default function NewDashboard() {
  const [period, setPeriod] = useState<Period>('day')
  const [date, setDate] = useState<Date>(new Date())
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [customRange, setCustomRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })

  // Fetch attendance data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        let url = '/api/attendance?period=' + period
        
        if (period === 'custom' && customRange.from && customRange.to) {
          url += `&start=${customRange.from.toISOString()}&end=${customRange.to.toISOString()}`
        }
        
        const response = await fetch(url)
        
        if (!response.ok) {
          throw new Error('Failed to fetch attendance data')
        }
        
        const data = await response.json()
        setAttendance(data)
      } catch (err) {
        console.error('Error fetching attendance:', err)
        setError('Failed to load attendance data. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [period, date, customRange])

  // Get date range for the selected period
  const getDateRange = () => {
    const today = new Date()
    
    switch (period) {
      case 'day':
        return {
          from: date,
          to: date,
          label: format(date, 'MMMM d, yyyy')
        }
      case 'week':
        return {
          from: startOfWeek(date),
          to: endOfWeek(date),
          label: `${format(startOfWeek(date), 'MMM d')} - ${format(endOfWeek(date), 'MMM d, yyyy')}`
        }
      case 'month':
        return {
          from: startOfMonth(date),
          to: endOfMonth(date),
          label: format(date, 'MMMM yyyy')
        }
      case 'year':
        return {
          from: startOfYear(date),
          to: endOfYear(date),
          label: format(date, 'yyyy')
        }
      case 'custom':
        return {
          from: customRange.from,
          to: customRange.to,
          label: customRange.from && customRange.to 
            ? `${format(customRange.from, 'MMM d, yyyy')} - ${format(customRange.to, 'MMM d, yyyy')}`
            : 'Select date range'
        }
      default:
        return {
          from: today,
          to: today,
          label: format(today, 'MMMM d, yyyy')
        }
    }
  }

  const { from, to, label } = getDateRange()

  // Navigation functions
  const goToPrevious = () => {
    if (period === 'day') {
      setDate(prev => subDays(prev, 1))
    } else if (period === 'week') {
      setDate(prev => subDays(prev, 7))
    } else if (period === 'month') {
      const newDate = new Date(date)
      newDate.setMonth(newDate.getMonth() - 1)
      setDate(newDate)
    } else if (period === 'year') {
      const newDate = new Date(date)
      newDate.setFullYear(newDate.getFullYear() - 1)
      setDate(newDate)
    }
  }

  const goToNext = () => {
    if (period === 'day') {
      setDate(prev => {
        const next = new Date(prev)
        next.setDate(next.getDate() + 1)
        return next
      })
    } else if (period === 'week') {
      setDate(prev => {
        const next = new Date(prev)
        next.setDate(next.getDate() + 7)
        return next
      })
    } else if (period === 'month') {
      const newDate = new Date(date)
      newDate.setMonth(newDate.getMonth() + 1)
      setDate(newDate)
    } else if (period === 'year') {
      const newDate = new Date(date)
      newDate.setFullYear(newDate.getFullYear() + 1)
      setDate(newDate)
    }
  }

  // Filter attendance for the current period
  const filteredAttendance = attendance.filter(record => {
    if (!from || !to) return false
    const recordDate = new Date(record.time)
    return isWithinInterval(recordDate, { start: from, end: to })
  })

  // Group attendance by employee
  const attendanceByEmployee = filteredAttendance.reduce<Record<number, AttendanceRecord[]>>((acc, record) => {
    if (!acc[record.employee.id]) {
      acc[record.employee.id] = []
    }
    acc[record.employee.id].push(record)
    return acc
  }, {})

  // Get unique employees
  const uniqueEmployees = Object.values(attendanceByEmployee).map(records => records[0].employee)

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Attendance Dashboard</h1>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh Data
        </button>
      </div>

      {/* Period Selector */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-md">
            {(['day', 'week', 'month', 'year', 'custom'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  period === p ? 'bg-white shadow' : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={goToPrevious}
              disabled={isLoading}
              className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
            >
              &larr;
            </button>
            
            <div className="px-4 py-2 text-center font-medium">
              {label}
            </div>
            
            <button 
              onClick={goToNext}
              disabled={isLoading}
              className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
            >
              &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Total Employees</h3>
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-semibold">{uniqueEmployees.length}</p>
            <p className="text-xs text-gray-500">
              {period === 'day' ? 'Present today' : `Present in ${period}`}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Total Check-ins</h3>
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-semibold">{filteredAttendance.length}</p>
            <p className="text-xs text-gray-500">Across all employees</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Departments</h3>
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-semibold">
              {new Set(uniqueEmployees.map(e => e.department)).size}
            </p>
            <p className="text-xs text-gray-500">Unique departments</p>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Attendance Records</h2>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : filteredAttendance.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No attendance records found for the selected period.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shift</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAttendance.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {record.employee.first_name} {record.employee.last_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {record.employee.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{record.employee.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {record.employee.shift || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(record.time), 'PPpp')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.rname || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
