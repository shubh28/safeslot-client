import React, { Component } from 'react';
import {
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
  Badge
} from 'reactstrap';
import axios from 'axios';

import Alerts from '../Alerts';
import AddSlots from '../AddSlots/b';
import { saveState, loadState } from '../../helpers/LocalStorage';
import StoreBooking from './StoreBooking';
import { API_URL } from '../../common/consts';
import formatBookingsList from './formatBookingsList';
import { Header } from '../common';
import { Container } from '../../styles';
import UpdateForm from './UpdateForm';

export default class OwnerHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      bookings: [],
      viewDetails: false,
      selectedbooking: {},
      addSlots: false,
      error: {},
      editingDetails: false,
      updateSuccessful: {}
    };
  }

  toggleAddSlots = () => {
    this.setState({ addSlots: !this.state.addSlots });
  };

  componentDidMount() {
    const { user } = this.state;
    const userId =
      loadState('userAuthenticationDetails') &&
      loadState('userAuthenticationDetails').userId;
      
    axios
      .get(
        `https://safeslot-backend.herokuapp.com/api/users/${userId}?filter={"include": "stores"}`
      )
      .then(res => {
        const user = res.data;
        this.setState({ user });
        if (!user.isStoreOwner) {
          this.props.history.push('/');
          return;
        }
        if (
          (user.isStoreOwner && !user.storeId) ||
          !user.stores ||
          Object.keys(user.stores).length === 0
        ) {
          this.props.history.push('/onboard');
        } else {
          const storeId = user && user.storeId;
          const filter = {
            where: { store_id: storeId },
            include: ['stores', 'stores_slots', 'users', 'slots']
          };
          axios
            .get(`${API_URL}/bookings?filter=${JSON.stringify(filter)}`)
            .then(res => {
              this.setState({ bookings: formatBookingsList(res.data) });
            })
            .catch(err => {
              this.showError('danger', 'Some error occurred');
            });
        }
      })
      .catch(err => {
        this.showError('danger', 'Some error occurred');
      });
  }

  toggleViewDetails = booking => {
    if (booking.id) {
      this.setState({ viewDetails: true, selectedbooking: booking });
    } else {
      this.setState({ viewDetails: false, selectedbooking: {} });
    }
  };
  
  toggleUpdateDetails = () => {
    this.setState({ editingDetails: !this.state.editingDetails });
  }

  logout = () => {
    localStorage.clear();
    this.props.history.push('/');
  };

  showError = (type, message) => {
    this.setState(
      Object.assign({ ...this.state }, { error: { type, message } })
    );
  };
  closeError = () => {
    this.setState(Object.assign({ ...this.state }, { error: {} }));
  };
  
  showSuccess = (type, message) => {
    this.setState(
      Object.assign({ ...this.state }, { updateSuccessful: { type, message } })
    )
  }
  
  closeAlert = () => {
     this.setState(
      Object.assign({ ...this.state }, { updateSuccessful: {} })
    )
  }

  render() {
    const { user } = this.state;
    const store = (user && user.stores) || {};
    return (
      <>
        <Header heading="Owner Portal" backPath={'/'} />
        <Container className="theme-Container" fluid={true}>
          <Alerts
            type={this.state.error.type}
            message={this.state.error.message}
            onClose={this.closeError}
          />
          <Alerts
            type={this.state.updateSuccessful.type}
            message={this.state.updateSuccessful.message}
            onClose={this.closeAlert}
          />
          <div className="booking-wrapper">
            <h5>{store.name}</h5>
            <h5>{user.phone}</h5>
            <h6>{store.address}</h6>
            <h6>{store.locality}</h6>
            <Button color="info" onClick={this.toggleAddSlots}>
              Edit Slots
            </Button>
            {store.isVerified && (
              <Button color="info" onClick={this.toggleUpdateDetails}>
                Update Store Details
              </Button>
            )}
            {this.state.addSlots && (
              <AddSlots
                openModal={this.state.addSlots}
                user={this.state.user}
                toggleAddSlots={this.toggleAddSlots}
              />
            )}
            {this.state.bookings.length === 0 && (
              <h3 className="text-center">No Bookings Found</h3>
            )}

            <StoreBooking
              bookings={this.state.bookings}
              style={{ margin: '10px 0' }}
            />

            {this.state.editingDetails && (
              <UpdateForm
                openModal={this.state.editingDetails}
                user={this.state.user}
                toggleUpdateDetails={this.toggleUpdateDetails}
                showSuccess={this.showSuccess}
              />
            )}
          </div>
        </Container>
      </>
    );
  }
}
