import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { getDateRange } from '@/lib/dateRange'
import { 
  EmployeeWithAttendances, 
  AttendanceWithEmployee,
  Attendance
} from '@/types/database'

type Period = 'day' | 'week' | 'month' | 'year' | 'custom'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const period = (searchParams.get('period') ?? 'day') as Period
  const startIso = searchParams.get('start') ?? undefined
  const endIso = searchParams.get('end') ?? undefined

  try {
    const { startDate, endDate } = getDateRange(period, startIso, endIso)

    try {
      // First get all employees with their attendances for the selected period
      const employees = await prisma.employee.findMany({
        include: {
          attendances: {
            where: {
              time: {
                gte: startDate,
                lte: endDate,
              },
            },
            orderBy: {
              time: 'desc',
            },
          },
        },
      }) as unknown as EmployeeWithAttendances[]

      // Transform the data to match the expected format
      const attendanceData: AttendanceWithEmployee[] = employees.flatMap(employee => 
        employee.attendances.map(attendance => {
          // Ensure we're not including the employee_id in the final output
          // as it's replaced by the employee object
          const { employee_id, ...attendanceWithoutEmployeeId } = attendance as unknown as Attendance & { employee_id: number }
          
          return {
            ...attendanceWithoutEmployeeId,
            employee: {
              id: employee.id,
              first_name: employee.first_name,
              last_name: employee.last_name,
              department: employee.department,
              shift: employee.shift,
            }
          }
        })
      )

      return NextResponse.json(attendanceData)
    } catch (error) {
      console.error('Error in attendance API:', error)
      return NextResponse.json(
        { error: 'Failed to fetch attendance data' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error fetching attendance records:', error)
    return NextResponse.json(
      { error: 'Failed to fetch attendance records', details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
