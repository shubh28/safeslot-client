export default function getDateString(rawDate) {
  const date = new Date(rawDate);
  return `${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}/${date
    .getDate()
    .toString()
    .padStart(2, '0')}/${date.getFullYear()}`
}
