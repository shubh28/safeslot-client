import React, { useState } from 'react';
import BookingCard from '../common/BookingCard';
import {
  Row,
  Col,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Button
} from 'reactstrap';

export default function StoreBooking({ bookings = [] }) {
  const [selectedBooking, setSelectedBooking] = useState();
  return (
    <>
      <Row>
        <Col lg="4">
          {bookings.map(booking => {
            return (
              <BookingCard
                booking={booking}
                key={booking.id}
                setSelectedBooking={setSelectedBooking}
              />
            );
          })}
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
