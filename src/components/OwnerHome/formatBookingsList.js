import getDateString from '../../helpers/getDateString';
import { getSlotTime } from '../../helpers';

export default function formatBookingsList(bookings) {
  const result = {
    today: [],
    history: {}
  };

  bookings.forEach(booking => {
    const today = new Date(getDateString(new Date())).getTime();
    const bookingDate = new Date(getDateString(booking.booking_date)).getTime();
    const slotString = getSlotTime(booking.stores_slots);
    const bookingDateString = getDateString(booking.booking_date);
    if (today === bookingDate) {
      result.today.push(booking);
    } else {
      if (result.history[bookingDateString]) {
        if (result.history[bookingDateString][slotString]) {
          result.history[bookingDateString][slotString].push(booking);
        } else {
          result.history[bookingDateString][slotString] = [booking];
        }
      } else {
        result.history[bookingDateString] = {};
        result.history[bookingDateString][slotString] = [booking];
      }
    }
  });

  return result;

  // const dateStrings = bookings
  //   .map(booking => getDateString(booking.booking_date))
  //   .filter((current, index, array) => array.indexOf(current) === index);

  // console.log(dateStrings)

  // return dateStrings.map(dateString => {
  //   const bookingsOfDate = bookings.filter(
  //     booking => getDateString(booking.booking_date) === dateString
  //   );

  //   console.log(dateStrings);

  // const slotStrings = bookingsOfDate
  //   .map(booking => `${booking.slots.start_time} - ${booking.slots.end_time}`)
  //   .filter((current, index, array) => array.indexOf(current) === index);

  // const slots = slotStrings.map(slotString => {
  //   const slotBookings = bookingsOfDate.filter(
  //     booking =>
  //       `${booking.slots.start_time} - ${booking.slots.end_time}` ===
  //       slotString
  //   );

  //   return {
  //     slotString,
  //     slotBookings
  //   };
  // });

  // return {
  //   date: dateString,
  //   slots
  // };
  // });
}
