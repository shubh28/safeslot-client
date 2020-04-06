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
import getSortResult from '../../helpers/getDateSortResult';
export const BookingListType = { today: 'today', history: 'history' };

export default function BookingList({
  type = BookingListType.today,
  bookings = []
}) {
  const [selectedBooking, setSelectedBooking] = useState();

  const todayDateString = `${new Date().getFullYear()}-${new Date().getMonth() +
    1}-${new Date().getDate()}`;

  function filterBasedOnType(booking) {
    if (type === BookingListType.today) {
      return new Date(booking.booking_date) >= new Date(todayDateString);
    } else if (type === BookingListType.history) {
      return new Date(booking.booking_date) < new Date(todayDateString);
    } else {
      return true;
    }
  }
  const filteredBooking = bookings.filter(filterBasedOnType) || [];
  return (
    <>
      <Row>
        <Col>
          {filteredBooking.length ? (
            filteredBooking
              .sort((one, two) =>
                getSortResult(one.booking_date, two.booking_date)
              )
              .map(booking => {
                return (
                  <BookingCard
                    booking={booking}
                    key={booking.id}
                    setSelectedBooking={setSelectedBooking}
                  />
                );
              })
          ) : (
            <div>No records found</div>
          )}
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
