import React, { useState } from 'react';
import {
  Row,
  Col,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Button,
  Collapse
} from 'reactstrap';
import BookingCardForStore from '../common/BookingCardForStore';

function CollapsableWrapper({ children, title, ...others }) {
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
        <strong>{title}</strong>
      </div>
      <Collapse isOpen={isOpen} style={{ margin: '10px' }}>
        {children}
      </Collapse>
    </div>
  );
}

export default function BookingList({
  bookings: dateBookings = [],
  groupByDate = true
}) {
  const [selectedBooking, setSelectedBooking] = useState();

  return (
    <>
      <Row>
        <Col>
          {dateBookings.length
            ? dateBookings.map(dateBooking => (
                <CollapsableWrapper title={dateBooking.date}>
                  {dateBooking.slots.length ? (
                    dateBooking.slots.map(slot => (
                      <CollapsableWrapper title={slot.slotString}>
                        {slot.slotBookings.length
                          ? slot.slotBookings.map(booking => (
                              <BookingCardForStore
                                booking={booking}
                                key={booking.id}
                                setSelectedBooking={setSelectedBooking}
                              />
                            ))
                          : null}
                      </CollapsableWrapper>
                    ))
                  ) : (
                    <div>No records found</div>
                  )}
                </CollapsableWrapper>
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
