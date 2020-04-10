import React from 'react';
import { Card, CardBody, CardTitle, CardSubtitle, Button } from 'reactstrap';
export default function BookingCardForStore({ booking, setSelectedBooking }) {
  const {
    id,
    users: { name, phone }
  } = booking;
  return (
    <Card key={id}>
      <CardBody>
        <CardTitle>
          <h5>Booking Id: {id}</h5>
          <h6>
            <strong>Name:</strong> {name}
          </h6>

          <h6>
            <strong>Contact No:</strong> {phone}
          </h6>
        </CardTitle>

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
