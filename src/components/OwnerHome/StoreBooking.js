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
        new Date(getDateString(booking.booking_date)).getTime() >=
        new Date(getDateString(new Date())).getTime()
      );
    } else if (type === BookingListType.history) {
      return (
        new Date(getDateString(booking.booking_date)).getTime() <
        new Date(getDateString(new Date())).getTime()
      );
    } else {
      return true;
    }
  }

  function filterOrderDetails(bookings){
    let { today } = bookings; 
    let timeObj = {};
    if (today) {
      let objKeys = Object.keys(today);
      objKeys.forEach(slot => {
        today[slot].forEach(booking => {
        if (booking.order_details && timeObj[slot]) {
          timeObj[slot].push(booking);
        } else if (booking.order_details) {
          timeObj[slot] = [booking]
        }
      })})
      return timeObj; 
    }
  }

  const filtered = filterOrderDetails(bookings);

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
            Orders to Fulfill Today
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={activeTab === '2' ? 'active' : ''}
            onClick={() => {
              toggle('2');
            }}
          >
            All Bookings Today
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={activeTab === '3' ? 'active' : ''}
            onClick={() => {
              toggle('3');
            }}
          >
            History
          </NavLink>
        </NavItem>
   
      </Nav>
      <TabContent activeTab={activeTab}>
      <TabPane tabId="1">
          <BookingList bookings={filtered} groupByDate={false}/>
        </TabPane>
        <TabPane tabId="2">
          <BookingList bookings={bookings.today} groupByDate={false} />
        </TabPane>
        <TabPane tabId="3">
          <BookingList bookings={bookings.history} />
        </TabPane>
      </TabContent>
    </>
  )
          }