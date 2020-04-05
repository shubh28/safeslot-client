import React, { useState } from 'react';
import BookingCard from '../common/BookingCard';
import {
  Row,
  Col,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Button,
  Nav,
  NavItem,
  NavLink,
  TabPane,
  TabContent
} from 'reactstrap';

export default function StoreBooking({ bookings = [], ...others }) {
  const [selectedBooking, setSelectedBooking] = useState();
  const [activeTab, setActiveTab] = useState('1');

  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const todayDateString = `${new Date().getFullYear()}-${new Date().getMonth() +
    1}-${new Date().getDate()}`;
  return (
    <>
      <Nav tabs {...others}>
        <NavItem>
          <NavLink
            className={activeTab === '1' ? 'active' : ''}
            onClick={() => {
              toggle('1');
            }}
          >
            Today
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={activeTab === '2' ? 'active' : ''}
            onClick={() => {
              toggle('2');
            }}
          >
            History
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <Row>
            <Col>
              {bookings
                .filter(
                  booking =>
                    new Date(booking.booking_date) >= new Date(todayDateString)
                )
                .map(booking => {
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
        </TabPane>
        <TabPane tabId="2">
          <Row>
            <Col>
              {bookings
                .filter(
                  booking =>
                    new Date(booking.booking_date) < new Date(todayDateString)
                )
                .map(booking => {
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
        </TabPane>
      </TabContent>

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
