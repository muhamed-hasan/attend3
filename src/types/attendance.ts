export interface Employee {
  id: number
  first_name: string
  last_name: string
  department: string
  shift?: string | null
}

export interface Attendance {
  id: string
  time: string // ISO string from API
  date: string
  time2: string
  fname: string
  lname: string
  name: string
  rname: string
  group: string
  card_number: string
  pic?: string | null
  dev: string
}
