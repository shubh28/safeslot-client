export function formatStoreHours(storeData) {
  if (!storeData) {
    return 'H: Hours Unkown';
  }
  const {
    shop_open_hours,
    shop_open_minutes,
    shop_close_hours,
    shop_close_minutes
  } = storeData;
  const openHour =
    shop_open_hours === 12 || shop_open_hours === 0
      ? '12'
      : shop_open_hours % 12;
  const openMin =
    shop_open_minutes < 10 ? `0${shop_open_minutes}` : shop_open_minutes;
  const closeHour =
    shop_close_hours === 12 || shop_close_hours === 0
      ? '12'
      : shop_close_hours % 12;
  const closeMin =
    shop_close_minutes < 10 ? `0${shop_close_minutes}` : shop_close_minutes;
  const startAMPM = shop_open_hours < 12 ? 'AM' : 'PM';
  const endAMPM = shop_close_hours < 12 ? 'AM' : 'PM';
  const open = `${openHour}:${openMin} ${startAMPM}`;
  const close = `${closeHour}:${closeMin} ${endAMPM}`;
  //   if (open === close) {
  //     return 'H: OPEN 24 HOURS';
  //   }

  return 'H: ' + open + ' - ' + close;
}

export function formatSlotHours(slotData) {
  const { start_hours, start_minutes, end_hours, end_minutes } = slotData;
  const openHour =
    start_hours === 12 || start_hours === 0 ? '12' : start_hours % 12;
  const openMin = start_minutes < 10 ? `0${start_minutes}` : start_minutes;
  const closeHour = end_hours === 12 || end_hours === 0 ? '12' : end_hours % 12;
  const closeMin = end_minutes < 10 ? `0${end_minutes}` : end_minutes;
  const startAMPM = start_hours < 12 ? 'AM' : 'PM';
  const endAMPM = end_hours < 12 ? 'AM' : 'PM';
  const open = `${openHour}:${openMin} ${startAMPM}`;
  const close = `${closeHour}:${closeMin} ${endAMPM}`;

  return open + ' - ' + close;
}
