import React, { useState, useEffect } from 'react';
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

export default function BookingList({ bookings = [], groupByDate = true }) {
  const [selectedBooking, setSelectedBooking] = useState();

  return (
    <>
      <Row>
        <Col>
          {/* {uniqueSlotStrings.length
            ? uniqueSlotStrings.map(slotString => (
                <BookingPerSlot
                  key={slotString}
                  slotString={slotString}
                  bookings={getBookingsForSlot(slotString, bookings)}
                  setSelectedBooking={setSelectedBooking}
                />
              ))
            : null} */}
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
