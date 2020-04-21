import React, { Component } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardSubtitle,
  CardTitle,
  Button,
  ModalBody,
  Modal,
  ModalHeader,
  ModalFooter,
  Badge,
  Input
} from 'reactstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

import Alerts from '../Alerts';
import { loadState } from '../../helpers/LocalStorage';

import { getSlotTime } from '../../helpers';

import { API_URL } from '../../common/consts';
import { Header } from '../common';

export default class Bookings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookings: [],
      viewBooking: false,
      selectedbooking: {},
      addDetails: false,
      orderDetails: '',
      error: {},
      imagesUploaded: [],
      imagesUploadedPreview: [],
    };
  }

  componentDidMount() {
    this.getBookings();
  }

  getBookings = () => {
    const userId =
      loadState('userAuthenticationDetails') &&
      loadState('userAuthenticationDetails').userId;
    if (!userId) {
      this.props.history.push('/');
      return;
    }
    const filter = {
      where: { user_id: userId },
      include: ['stores', 'stores_slots']
    };
    axios
      .get(`${API_URL}/bookings?filter=${JSON.stringify(filter)}`)
      .then(res => {
        this.setState({ bookings: res.data });
      })
      .catch(err => {
        this.showError('danger', 'Some error occurred');
      });
  };

  viewBooking = booking => {
    if (booking.id) {
      this.setState({ viewBooking: true, selectedbooking: booking });
    } else {
      this.setState({ viewBooking: false, selectedbooking: {} });
    }
  };

  toggleAddDetails = booking => {
    if (booking.id) {
      this.setState({ addDetails: true, selectedbooking: booking });
    } else {
      this.setState({ addDetails: false, selectedbooking: {} });
    }
  };

  logout = () => {
    localStorage.clear();
    this.props.history.push('/');
  };

  handleOrderDetails = e => {
    this.setState({ orderDetails: e.target.value });
  };

  uploadImageOrderDetails = e => {
    if (e.target.files.length > 2){
      this.showError('danger', 'A maximum of 2 images can be attached to a booking.');
    } else {
      let files = Array.from(e.target.files);
      files.forEach((file, i) => {
        let reader = new FileReader();
        reader.onloadend = () => {
            this.setState({
                 imagesUploaded: [...this.state.imagesUploaded, file],
                 imagesUploadedPreview: [...this.state.imagesUploadedPreview, reader.result]
            });
        }
        reader.readAsDataURL(file);
      });
    }
    e.target.value = null;
  }

  removeImageUploaded = (key) => {
    let files = this.state.imagesUploaded.filter((file, i)=> key !== i) || [];
    let urls = this.state.imagesUploadedPreview.filter((file, i) => key !== i) || [];
    this.setState({
      imagesUploaded: files,
      imagesUploadedPreview: urls
    });
  }

  addOrderDetails = () => {
    axios
      .patch(`${API_URL}/bookings/${this.state.selectedbooking.id}`, {
        order_details: this.state.orderDetails
      })
      .then(res => {
        this.getBookings();
        this.setState({ addDetails: false, selectedbooking: {} });
      })
      .catch(err => {});
  };

  showError = (type, message) => {
    this.setState(
      Object.assign({ ...this.state }, { error: { type, message } })
    );
  };
  closeError = () => {
    this.setState(Object.assign({ ...this.state }, { error: {} }));
  };

  render() {
    const { selectedbooking } = this.state;
    return (
      <div>
        <Header heading="Bookings" backPath={'/'} />
        <Container>
          <div className="booking-wrapper">
            <Alerts
              type={this.state.error.type}
              message={this.state.error.message}
              onClose={this.closeError}
            />

            {this.state.bookings.length === 0 && (
              <h3 className="text-center">No Bookings Found</h3>
            )}
            <Row>
              <Col>
                {this.state.bookings.map(booking => {
                  return (
                    <Card key={booking.id}>
                      <CardBody>
                        <CardTitle>
                          <h5>Booking Id: {booking.id}</h5>
                          <h6>
                            <strong>Booking Date:</strong>{' '}
                            {new Date(booking.booking_date).toDateString()}
                          </h6>
                          <h6>
                            <strong>Your Slot:</strong>{' '}
                            {getSlotTime(booking.stores_slots)}
                          </h6>
                        </CardTitle>
                        {booking.stores && (
                          <CardSubtitle>
                            {booking.stores.locality}, {booking.stores.city}
                          </CardSubtitle>
                        )}
                        <Button
                          outline
                          color="info"
                          onClick={() => this.viewBooking(booking)}
                        >
                          View Details
                        </Button>
                        <Button
                          outline
                          color="info"
                          onClick={() => this.toggleAddDetails(booking)}
                        >
                          Add Order Details
                        </Button>
                      </CardBody>
                    </Card>
                  );
                })}
              </Col>
            </Row>
          </div>
        </Container>
        <Modal isOpen={this.state.viewBooking} toggle={this.viewBooking}>
          <ModalHeader toggle={this.viewBooking}>
            Your Booking Details
          </ModalHeader>
          <ModalBody>
            <h5>
              Your booking is &nbsp;
              <Badge
                color={
                  selectedbooking.status === 'CONFIRMED' ? 'success' : 'danger'
                }
              >
                {selectedbooking.status}
              </Badge>
            </h5>
            <p>
              Your visiting slot is {getSlotTime(selectedbooking.stores_slots)}
            </p>
            <p>
              <strong>Booking Id:</strong>
              {selectedbooking.id}
            </p>
            <p>
              <strong>Store Name:</strong>
              {selectedbooking.stores && selectedbooking.stores.name}
            </p>
            {selectedbooking.stores && (
              <p>
                <strong>Address:</strong> {selectedbooking.stores.address},{' '}
                {selectedbooking.stores.locality}, {selectedbooking.stores.city}
              </p>
            )}
            <p>Please take screen shot of this screen and show at the store.</p>
          </ModalBody>
          <ModalFooter>
            <Button color="info" outline onClick={this.viewBooking}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.addDetails} toggle={this.toggleAddDetails}>
          <ModalHeader toggle={this.toggleAddDetails}>
            Order Details
          </ModalHeader>
          <ModalBody>
            <p>
              Please add your order details. Please add your items and quantity
              of the item you want to purchase. We will get your order prepared
              while you go to pick it.
            </p>
            <Input
              type="textarea"
              name="order_details"
              rows="8"
              value={
                this.state.orderDetails ||
                this.state.selectedbooking.order_details
              }
              onChange={this.handleOrderDetails}
            />
            <p>*All items are subject to availability</p>

            <div>
              <label for="orderDetails_image" class="custom_image_uploader">
                Upload Image
              </label>
              <input id="orderDetails_image" type="file" accept="image/*" multiple="true"
                onChange={this.uploadImageOrderDetails} style={{display:"none"}}
              />
              {this.state.imagesUploadedPreview.length ?
                this.state.imagesUploadedPreview.map((url,i) =>
                <div key={i}>
                  <span onClick={ () => this.removeImageUploaded(i) }>X</span>
                  <img src={url} style={{width: "6em", height: "6em", margin:"1em"}} />
                </div>
                ) : ''}
              <Alerts
                type={this.state.error.type}
                message={this.state.error.message}
                onClose={this.closeError}
              />
            </div>

          </ModalBody>
          <ModalFooter>
            <Button color="info" outline onClick={this.addOrderDetails}>
              Add
            </Button>
            <Button color="info" outline onClick={this.toggleAddDetails}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
