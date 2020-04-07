import getDateString from '../../helpers/getDateString';

export default function formatBookingsList(bookings) {
  const dateStrings = bookings
    .map(booking => getDateString(booking.booking_date))
    .filter((current, index, array) => array.indexOf(current) === index);

  return dateStrings.map(dateString => {
    const bookingsOfDate = bookings.filter(
      booking => getDateString(booking.booking_date) === dateString
    );

    const slotStrings = bookingsOfDate
      .map(booking => `${booking.slots.start_time} - ${booking.slots.end_time}`)
      .filter((current, index, array) => array.indexOf(current) === index);

    const slotBookings = slotStrings.map(slotString => {
      const bookingsOfSlots = bookingsOfDate.filter(
        booking =>
          `${booking.slots.start_time} - ${booking.slots.end_time}` ===
          slotString
      );

      return {
        slotString,
        bookings: bookingsOfSlots
      };
    });

    return {
      date: dateString,
      bookings: slotBookings
    };
  });
}
