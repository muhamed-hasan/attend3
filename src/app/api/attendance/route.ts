import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { getDateRange, Period } from '@/lib/dateRange'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const period = (searchParams.get('period') ?? 'day') as Period
  const startIso = searchParams.get('start') ?? undefined
  const endIso = searchParams.get('end') ?? undefined

  try {
    const { startDate, endDate } = getDateRange(period, startIso, endIso)

    const attendances = await prisma.attendance.findMany({
      where: {
        time: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        employee: true,
      },
      orderBy: {
        time: 'desc',
      },
    })

    return NextResponse.json(attendances)
  } catch (error) {
    console.error('Error fetching attendance records:', error)
    return NextResponse.json(
      { error: 'Failed to fetch attendance records' },
      { status: 500 },
    )
  }
}
