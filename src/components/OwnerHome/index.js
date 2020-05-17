import React, { Component } from 'react';
import { Button } from 'reactstrap';
import Alerts from '../Alerts';
import AddSlots from '../AddSlots';
import { loadUserAuthenticationDetails } from '../../helpers/LocalStorage';
import StoreBooking from './StoreBooking';
import formatBookingsList from './formatBookingsList';
import { Header } from '../common';
import { Container } from '../../styles';
import OwnerHomeService from './ownerHomeService';

export default class OwnerHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      bookings: [],
      viewDetails: false,
      selectedbooking: {},
      addSlots: false,
      tokens: {},
      currentToken: 0,
      error: {}
    };
  }

  toggleAddSlots = () => {
    this.setState({ addSlots: !this.state.addSlots });
  };

  async componentDidMount() {
    const userAuthDetails = loadUserAuthenticationDetails();
    const userId = userAuthDetails && userAuthDetails.userId;

    const service = new OwnerHomeService();
    try {
      const userRes = await service.fetchUser(userId);
      const user = userRes.data;
      this.setState({ user });

      if (!user.isStoreOwner) {
        this.props.history.push('/');
        return;
      }

      if (this.storeOwnerUserHasNoStores(user)) {
        this.props.history.push('/onboard');
        return;
      }

      const storeId = user.storeId;
      const  bookingsRes = await service.fetchBookings(storeId);
      const bookings = bookingsRes.data;
      this.setState({ bookings: formatBookingsList(bookings) });

      // Token Section
      const tokens = await service.fetchTokens(storeId);
      console.log("tokens", storeId);
      console.log(tokens[Object.keys(tokens)[0]]);
      this.setState({ tokens: tokens, currentToken: tokens[Object.keys(tokens)[0]].current_token });
    } catch (error) {
      console.log(error);
      this.showError();
    }

  }


  storeOwnerUserHasNoStores = (user) => {
    return (user.isStoreOwner && !user.storeId) || !user.stores || Object.keys(user.stores).length === 0;
  }

  toggleViewDetails = booking => {
    if (booking.id) {
      this.setState({ viewDetails: true, selectedbooking: booking });
    } else {
      this.setState({ viewDetails: false, selectedbooking: {} });
    }
  };

  logout = () => {
    localStorage.clear();
    this.props.history.push('/');
  };

  showError = (type = 'danger', message = 'Some error occurred') => {
    this.setState(
      Object.assign({ ...this.state }, { error: { type, message } })
    );
  };
  closeError = () => {
    this.setState(Object.assign({ ...this.state }, { error: {} }));
  };

  prevToken = () => {
    this.setState({ currentToken: this.state.currentToken - 1 });
  };

  nextToken = () => {
    this.setState({ currentToken: this.state.currentToken + 1 });
  };

  render() {
    const { user } = this.state;
    const store = (user && user.stores) || {};
    return (
      <div>
        <Header heading="Owner Portal" backPath={'/'} />
        <Container className="theme-Container" fluid={true}>
          <Alerts
            type={this.state.error.type}
            message={this.state.error.message}
            onClose={this.closeError}
          />

          <div className="booking-wrapper">
            <h5>{store.name}</h5>
            <h5>{user.phone}</h5>
            <h6>{store.address}</h6>
            <h6>{store.locality}</h6>
            <Button color="info" onClick={this.toggleAddSlots}>
              Edit Slots
            </Button>
            <Button color="info" onClick={this.prevToken}>
              Previous
            </Button>
            {this.state.currentToken}
            <Button color="info" onClick={this.nextToken}>
              Next
            </Button>
            {this.state.addSlots && (
              <AddSlots
                openModal={this.state.addSlots}
                user={this.state.user}
                toggleAddSlots={this.toggleAddSlots}
                storeId={this.state.user.storeId}
              />
            )}

            {this.state.bookings.length === 0 && (
              <h3 className="text-center">No Bookings Found</h3>
            )}

            <StoreBooking
              bookings={this.state.bookings}
              style={{ margin: '10px 0' }}
            />
          </div>
        </Container>
      </div>
    );
  }
}
