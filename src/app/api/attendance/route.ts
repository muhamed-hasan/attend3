import { NextResponse, NextRequest } from 'next/server';
import { query } from '@/lib/pg-db';
import { getDateRange } from '@/lib/dateRange';

// Define TypeScript interfaces for our data
interface AttendanceRecord {
  id: string;
  time: string;
  first_name: string;
  last_name: string;
  department: string;
  shift: string | null;
  rname: string | null;
  group: string | null;
  card_number: string | null;
  pic: string | null;
  dev: string | null;
}

interface EmployeeStats {
  id: string;
  first_name: string;
  last_name: string;
  department: string;
  shift: string | null;
  attendance_count: number;
}

type Period = 'day' | 'week' | 'month' | 'year' | 'custom';

// Helper function to format date for display
const formatDate = (date: Date): string => {
  return new Date(date).toISOString().split('T')[0];
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = (searchParams.get('period') ?? 'day') as Period;
    const startIso = searchParams.get('start') ?? undefined;
    const endIso = searchParams.get('end') ?? undefined;

    // Get date range based on period
    const { startDate, endDate } = getDateRange(period, startIso, endIso);
    
    // Log the query parameters for debugging
    console.log('Fetching attendance data for period:', {
      period,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      startIso,
      endIso
    });

    // Query to get attendance records with employee details
    const result = await query<AttendanceRecord>(
      `SELECT 
        a.id, 
        a.time, 
        e.first_name, 
        e.last_name, 
        e.department, 
        e.shift,
        a.rname,
        a.group,
        a.card_number,
        a.pic,
        a.dev
      FROM table3 a
      JOIN details e ON a.id = e.id::varchar
      WHERE a.time BETWEEN $1 AND $2
      ORDER BY a.time DESC`,
      [startDate, endDate]
    );

    // Transform the data
    const attendanceData = result.rows;

    // Calculate statistics
    const employees = new Map<string, EmployeeStats>();
    const departments = new Set<string>();
    const presentEmployeeIds = new Set<string>();
    
    attendanceData.forEach(record => {
      // Track departments
      departments.add(record.department);
      
      // Track employee attendance
      if (!employees.has(record.id)) {
        employees.set(record.id, {
          id: record.id,
          first_name: record.first_name,
          last_name: record.last_name,
          department: record.department,
          shift: record.shift,
          attendance_count: 0
        });
      }
      const employee = employees.get(record.id);
      if (employee) {
        employee.attendance_count++;
      }
      // Track present employees (unique)
      if (record.rname !== null) {
        presentEmployeeIds.add(record.id);
      }
    });

    const uniqueEmployees = Array.from(employees.values());
    const presentCount = presentEmployeeIds.size;
    
    // Prepare response
    const response = {
      data: attendanceData,
      stats: {
        totalEmployees: uniqueEmployees.length,
        totalCheckIns: attendanceData.length,
        totalDepartments: departments.size,
        presentCount,
      },
      period: {
        start: formatDate(startDate),
        end: formatDate(endDate),
        type: period
      },
      meta: {
        generatedAt: new Date().toISOString()
      }
    };

    console.log(`Fetched ${attendanceData.length} attendance records for ${uniqueEmployees.length} employees`);
    
    return NextResponse.json(response);
    
  } catch (error: any) {
    console.error('Error in attendance API:', error);
    
    // Return appropriate error response
    if (error.message?.includes('date/time field value out of range')) {
      return NextResponse.json(
        { 
          error: 'Invalid date range',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch attendance data',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
