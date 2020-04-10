import React, { useState } from 'react';
import { Nav, NavItem, NavLink, TabPane, TabContent } from 'reactstrap';
import BookingList from '../common/BookingList';
import getDateString from '../../helpers/getDateString';

const BookingListType = { today: 'today', history: 'history' };

export default function StoreBooking({ bookings = [], ...others }) {
  const [activeTab, setActiveTab] = useState('1');

  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  function filterBasedOnType(type, booking) {
    if (type === BookingListType.today) {
      return (
        new Date(booking.date) >=
        new Date(getDateString(new Date().toLocaleString()))
      );
    } else if (type === BookingListType.history) {
      return (
        new Date(booking.date) <
        new Date(getDateString(new Date().toLocaleString()))
      );
    } else {
      return true;
    }
  }
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
          <BookingList
            bookings={bookings.filter(booking =>
              filterBasedOnType(BookingListType.today, booking)
            )}
            groupByDate={false}
          />
        </TabPane>
        <TabPane tabId="2">
          <BookingList
            bookings={bookings.filter(booking =>
              filterBasedOnType(BookingListType.history, booking)
            )}
          />
        </TabPane>
      </TabContent>
    </>
  );
}
