import React, { Component } from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  Button,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Badge
} from 'reactstrap';
import axios from 'axios';

import { Link } from 'react-router-dom';

import { loadState } from '../../helpers/LocalStorage';

export default class Stores extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stores: [],
      openSlots: false,
      slots: [],
      selectedSlot: '',
      selectedStore: ''
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedLocation !== this.props.selectedLocation) {
      const { selectedLocation } = this.props;
      const location = selectedLocation && selectedLocation.split(',')[0];
      this.getStoreData(location);
    }
  }

  componentDidMount() {
    const { selectedLocation } = this.props;
    const location = selectedLocation && selectedLocation.split(',')[0];
    this.getStoreData(location);
  }

  toggleModal = storesId => {
    if (this.state.openSlots) {
      this.setState({
        openSlots: !this.state.openSlots,
        slots: []
      });
    } else {
      const filter = { where: { storesId }, include: 'slots' };
      axios
        .get(
          `https://safeslot-backend.herokuapp.com/api/stores_slots_counts?filter=${JSON.stringify(
            filter
          )}`
        )
        .then(res => {
          this.setState({
            openSlots: true,
            slots: res.data,
            selectedStore: storesId
          });
        })
        .catch(err => {
          alert('Some error while fetching stores');
        });
    }
  };

  getStoreData = location => {
    this.setState({ fetchingStores: true });
    axios
      .get(
        `https://safeslot-backend.herokuapp.com/api/stores/location?location=${location}`
      )
      .then(res => {
        this.setState({ stores: res.data, fetchingStores: false });
      })
      .catch(err => {
        alert('Some error while fetching stores');
      });
  };

  makeBooking = () => {
    const { isLoggedIn, history } = this.props;
    const { selectedStore, selectedSlot } = this.state;
    const userId =
      loadState('userAuthenticationDetails') &&
      loadState('userAuthenticationDetails').userId;
    if (!isLoggedIn) {
      history.push('/login');
    } else {
      axios
        .post('https://safeslot-backend.herokuapp.com/api/bookings', {
          store_id: selectedStore,
          slot_id: selectedSlot,
          user_id: userId
        })
        .then(res => {
          history.push('/bookings');
        })
        .catch(err => {
          alert('Error while making booking');
        });
    }
  };

  selectSlot = slot => {
    this.setState({
      selectedSlot: slot
    });
  };

  render() {
    const token =
      loadState('userAuthenticationDetails') &&
      loadState('userAuthenticationDetails').id;

    return (
      <Row>
        <Col lg="4">
          {this.state.stores.length === 0 && !this.state.fetchingStores && (
            <div className="emptySearch">
              Sorry we could not find any store near you. Want to refer nearby
              stores?
              <Button
                tag={Link}
                to={token ? '/refer' : '/login'}
                outline
                color="info"
              >
                Refer Stores
              </Button>
            </div>
          )}
          {this.state.stores.map(store => {
            return (
              <Card key={store.id}>
                <CardBody>
                  <CardTitle className="storeCard">
                    <h3>{store.name}</h3>
                    <div className="storeVerification">
                      {store.isVerified ? (
                        <Badge color="success">Verified</Badge>
                      ) : (
                        <Badge color="warning">Not Verified</Badge>
                      )}
                    </div>
                  </CardTitle>
                  <CardSubtitle>
                    {store.address}, {store.locality}, {store.city}
                  </CardSubtitle>
                  <Button
                    outline
                    color="info"
                    onClick={() => this.toggleModal(store.id)}
                  >
                    Book Slot
                  </Button>
                </CardBody>
              </Card>
            );
          })}
        </Col>
        <Modal isOpen={this.state.openSlots} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>Select your slot</ModalHeader>
          <ModalBody>
            {this.state.slots.length === 0 && (
              <div className="emptySearch">
                Oops! This store has not added any slots for booking. Please
                contact store owner and ask him to add slots.
              </div>
            )}
            {this.state.slots.map(slot => {
              return (
                <Button
                  key={slot.id}
                  color="info"
                  outline={
                    slot.slots &&
                    this.state.selectedSlot !==
                      `${slot.slots.start_time} - ${slot.slots.end_time}`
                  }
                  size="sm"
                  onClick={() => {
                    this.selectSlot(
                      slot.slots &&
                        `${slot.slots.start_time} - ${slot.slots.end_time}`
                    );
                  }}
                >
                  {slot.slots &&
                    `${slot.slots.start_time} - ${slot.slots.end_time}`}
                </Button>
              );
            })}
          </ModalBody>
          <ModalFooter>
            <Button
              color="info"
              onClick={this.makeBooking}
              disabled={
                this.state.selectedSlot === '' || this.state.slots.length === 0
              }
            >
              Book Now
            </Button>{' '}
            <Button color="info" outline onClick={this.toggleModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </Row>
    );
  }
}
