import dayjs from 'dayjs'
import weekday from 'dayjs/plugin/weekday'

dayjs.extend(weekday)

export function timeFormat(time: number, now: number) {
  // 一分钟前
  if (now - time < 60 * 1000) {
    return '刚刚'
  }

  // 十分钟前
  if (now - time < 10 * 60 * 1000) {
    return `${((now - time) / 1000 / 60).toFixed(0)}分钟前`
  }

  // 十分钟后
  const timeDate = dayjs(time)
  const nowDate = dayjs(now)
  const timeDateStart = timeDate.startOf('date')
  const nowDateStart = nowDate.startOf('date')
  const dateDiff = nowDateStart.diff(timeDateStart)
  // 一天之内
  if (dateDiff === 0) {
    return timeDate.format('HH:dd')
  }

  // 两天之内
  if (dateDiff === 1) {
    return `昨天 ${timeDate.format('HH:dd')}`
  }

  const timeWeekEnd = timeDate.endOf('week')
  // 本周内
  if (nowDate.valueOf() < timeWeekEnd.valueOf()) {
    return timeDate.weekday()
  }

  return timeDate.format('M月D日')
}
