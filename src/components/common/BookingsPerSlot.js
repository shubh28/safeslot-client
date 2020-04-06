import React, { useState } from 'react';
import { Collapse } from 'reactstrap';
import getSortResult from '../../helpers/getDateSortResult';
import BookingCardForStore from '../common/BookingCardForStore';

export default function BookingPerSlot({
  slotString,
  bookings,
  setSelectedBooking,
  ...others
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div {...others}>
      <div
        style={{
          background: '#ccc',
          padding: '5px',
          margin: '3px',
          border: '1px solid #000',
          borderRadius: '4px'
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <strong>{slotString}</strong>
      </div>
      <Collapse isOpen={isOpen} style={{ margin: '10px' }}>
        {bookings.length ? (
          bookings
            .sort((one, two) =>
              getSortResult(one.booking_date, two.booking_date)
            )
            .map(booking => {
              return (
                <BookingCardForStore
                  booking={booking}
                  key={booking.id}
                  setSelectedBooking={setSelectedBooking}
                />
              );
            })
        ) : (
          <div>No records found</div>
        )}
      </Collapse>
    </div>
  );
}
