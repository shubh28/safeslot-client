import React, { useState } from 'react';
import {
  Row,
  Col,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Button
} from 'reactstrap';

import BookingPerSlot from './BookingsPerSlot';

export default function BookingList({ bookings = [] }) {
  const [selectedBooking, setSelectedBooking] = useState();

  const uniqueSlotStrings = bookings
    .map(booking => `${booking.slots.start_time} - ${booking.slots.end_time}`)
    .filter((current, index, array) => array.indexOf(current) === index);

  function getBookingsForSlot(slotString, bookings) {
    return bookings.filter(
      booking =>
        `${booking.slots.start_time} - ${booking.slots.end_time}` === slotString
    );
  }
  console.log({ uniqueSlotStrings });
  return (
    <>
      <Row>
        <Col>
          {uniqueSlotStrings.length
            ? uniqueSlotStrings.map(slotString => (
                <BookingPerSlot
                  key={slotString}
                  slotString={slotString}
                  bookings={getBookingsForSlot(slotString, bookings)}
                  setSelectedBooking={setSelectedBooking}
                />
              ))
            : null}
        </Col>
      </Row>
      {selectedBooking && (
        <Modal
          isOpen={!!selectedBooking}
          toggle={() => setSelectedBooking(!selectedBooking)}
        >
          <ModalHeader toggle={() => setSelectedBooking(!selectedBooking)}>
            Order Details
          </ModalHeader>
          <ModalBody>
            <p>
              Please prepare following order for the user to come and pickup.
            </p>
            <p>{selectedBooking.order_details}</p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="info"
              outline
              onClick={() => setSelectedBooking(!selectedBooking)}
            >
              Close
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </>
  );
}
