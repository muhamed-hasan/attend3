// Define types based on our Prisma schema

export interface Employee {
  id: number
  first_name: string
  last_name: string
  department: string
  shift: string | null
}

export interface Attendance {
  id: string
  time: Date
  date: Date
  time2: Date
  fname: string | null
  lname: string | null
  name: string | null
  rname: string | null
  group: string | null
  card_number: string | null
  pic: string | null
  dev: string | null
  employee_id: number
}

export interface EmployeeWithAttendances extends Employee {
  attendances: Attendance[]
}

export interface AttendanceWithEmployee extends Omit<Attendance, 'employee_id'> {
  employee: {
    id: number
    first_name: string
    last_name: string
    department: string
    shift: string | null
  }
}
