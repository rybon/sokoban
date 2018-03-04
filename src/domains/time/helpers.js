const prefixZero = (number = 0) => (number < 10 ? `0${number}` : number)

export const convertTimestampToClock = (timestamp = 0) => {
  const date = new Date(timestamp)
  const hours = prefixZero(date.getHours())
  const minutes = prefixZero(date.getMinutes())
  return `${hours}:${minutes}`
}
