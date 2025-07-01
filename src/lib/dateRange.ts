import dayjs from 'dayjs'

export type Period = 'day' | 'week' | 'month' | 'year' | 'custom'

/**
 * Returns start & end Date objects for a given period.
 * If `custom` is chosen you must provide `startIso` and `endIso` ISO strings.
 */
export function getDateRange(period: Period, startIso?: string, endIso?: string) {
  const now = dayjs()

  switch (period) {
    case 'day':
      return {
        startDate: now.startOf('day').toDate(),
        endDate: now.endOf('day').toDate(),
      }
    case 'week':
      return {
        startDate: now.startOf('week').toDate(),
        endDate: now.endOf('week').toDate(),
      }
    case 'month':
      return {
        startDate: now.startOf('month').toDate(),
        endDate: now.endOf('month').toDate(),
      }
    case 'year':
      return {
        startDate: now.startOf('year').toDate(),
        endDate: now.endOf('year').toDate(),
      }
    case 'custom': {
      if (!startIso || !endIso) {
        throw new Error('Custom period requires start and end ISO date strings')
      }
      return {
        startDate: dayjs(startIso).startOf('day').toDate(),
        endDate: dayjs(endIso).endOf('day').toDate(),
      }
    }
    default:
      throw new Error('Unsupported period')
  }
}
