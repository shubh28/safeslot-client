export default function getSortResult(one, two) {
  const dateOne = new Date(one);
  const dateTwo = new Date(two);
  return dateOne > dateTwo ? -1 : dateOne < dateTwo ? 1 : 0;
}
