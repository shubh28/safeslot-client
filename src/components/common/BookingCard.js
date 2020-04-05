import React from 'react';
import { Card, CardBody, CardTitle, CardSubtitle, Button } from 'reactstrap';
export default function BookingCard({ booking, setSelectedBooking }) {
  const { id, booking_date, slot_id, stores } = booking;
  return (
    <Card key={id}>
      <CardBody>
        <CardTitle>
          <h5>Booking Id: {id}</h5>
          <h6>
            <strong>Booking Date:</strong>{' '}
            {new Date(booking_date).toDateString()}
          </h6>
          <h6>
            <strong>Your Slot:</strong> {slot_id}
          </h6>
        </CardTitle>
        {stores && (
          <CardSubtitle>
            {stores.locality}, {stores.city}
          </CardSubtitle>
        )}
        <Button
          outline
          color="info"
          onClick={() => setSelectedBooking(booking)}
        >
          View Details
        </Button>
      </CardBody>
    </Card>
  );
}
