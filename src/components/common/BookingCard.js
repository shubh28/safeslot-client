import React from 'react';
import { Card, CardBody, CardTitle, CardSubtitle, Button } from 'reactstrap';
var CryptoJS = require("crypto-js");
var crypto = require("crypto")
export default async function BookingCard({ booking, setSelectedBooking }) {
  const { id, booking_date, slot_id, stores } = booking;

  const encryptByDES = (message, key) => {
    const keyHex = CryptoJS.enc.Utf8.parse(key);
    const encrypted = CryptoJS.DES.encrypt(message, keyHex, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    })
    return encrypted.toString();
  }

  var encrypted = encryptByDES(id, "12AE0364");
  var hash = crypto.createHmac('sha1', "E126AF73").update(encrypted)
  hash = hash.digest("base64")
  hash = hash.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
  // console.log(hash)
  return (
  
    <Card key={id}>
      <CardBody>
        <CardTitle>
          <h5>Booking Id: {hash}</h5>
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
