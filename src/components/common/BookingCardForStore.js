import React from 'react';
import { Card, CardBody, CardTitle, CardSubtitle, Button } from 'reactstrap';
var CryptoJS = require("crypto-js");
var crypto = require("crypto")
export default function BookingCardForStore({ booking, setSelectedBooking }) {
  const {
    id,
    users: { name, phone }
  } = booking;

 
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
  console.log(hash)
  return (

    <Card key={id}>
      <CardBody>
        <CardTitle>
          <h5>Booking Id: {hash}</h5>
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
