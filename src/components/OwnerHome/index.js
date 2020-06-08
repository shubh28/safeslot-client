import React, { Component } from 'react';
import { Button, Input, Container as ReactContainer, Row } from 'reactstrap';
import Alerts from '../Alerts';
import AddSlots from '../AddSlots';
import { loadUserAuthenticationDetails } from '../../helpers/LocalStorage';
import StoreBooking from './StoreBooking';
import formatBookingsList from './formatBookingsList';
import { Header } from '../common';
import {
  Container,
  TokenStatusContainer,
  SmsInputContainer
} from '../../styles';
import OwnerHomeService from './ownerHomeService';
import 'intl-tel-input/build/css/intlTelInput.css';
import ReactIntlTelInput from 'react-intl-tel-input-v2';

export default class OwnerHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      service: new OwnerHomeService(),
      user: {},
      bookings: [],
      viewDetails: false,
      selectedbooking: {},
      addSlots: false,
      token: {},
      currentToken: 0,
      nextDisable: false,
      prevDisable: false,
      error: {},
      numberInput: { iso2: 'in', dialCode: '91', phone: '' },
      generatedToken: null,
      smsString: '',
      smsSendDisabled: true
    };
  }

  toggleAddSlots = () => {
    this.setState({ addSlots: !this.state.addSlots });
  };

  async componentDidMount() {
    const userAuthDetails = loadUserAuthenticationDetails();
    const userId = userAuthDetails && userAuthDetails.userId;

    const service = this.state.service;
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
      const bookingsRes = await service.fetchBookings(storeId);
      const bookings = bookingsRes.data;
      this.setState({ bookings: formatBookingsList(bookings) });

      // Token Section
      this.fetchTokensInterval(storeId);
      setInterval(() => {
        this.fetchTokensInterval(storeId);
      }, 30000)
      // const token = await service.fetchTokens(storeId);
      // this.setState({ token: token, currentToken: token.current_token });
      // this.checkDisable();
    } catch (error) {
      console.log(error);
      this.showError();
    }
  }

  fetchTokensInterval = async (storeId) => {
    const service = this.state.service;
    const token = await service.fetchTokens(storeId);
    this.setState({ token: token, currentToken: token.current_token });
    this.checkDisable();
  }

  storeOwnerUserHasNoStores = user => {
    return (
      (user.isStoreOwner && !user.storeId) ||
      !user.stores ||
      Object.keys(user.stores).length === 0
    );
  };

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

  updateToken = operation => {
    const service = this.state.service;
    let tokenToUpdate;
    if (operation === 'previous') tokenToUpdate = this.state.currentToken - 1;
    else if (operation === 'next') tokenToUpdate = this.state.currentToken + 1;

    let tokenData = {};
    tokenData.current_token = tokenToUpdate;
    service.updateToken(this.state.token.id, tokenData)
      .then(result => service.updateRealizationTime(tokenToUpdate, this.state.user.storeId))
      .then(result => {
        this.setState({ currentToken: tokenToUpdate });
        this.checkDisable();
      });
  };

  checkDisable = () => {
    let currentToken = this.state.currentToken;
    if (currentToken < this.state.token.next_assign_token)
      this.setState({ nextDisable: false });
    else this.setState({ nextDisable: true });

    if (currentToken > 1) this.setState({ prevDisable: false });
    else this.setState({ prevDisable: true });
  };

  handleNumberInputChange = object => {
    this.setState({ numberInput: object });
  };

  generateManualToken = async mobile => {
    // do generate token things
    const service = this.state.service;
    try {
      const tokenRes = await service.generateToken(
        mobile,
        this.state.user.storeId
      );
      const smsMsg = service.generateSMSurl(
        mobile,
        tokenRes,
        this.state.currentToken
      );
      this.fetchTokensInterval(this.state.user.storeId);
      this.setState({
        generatedToken: tokenRes,
        smsSendDisabled: false,
        smsString: smsMsg
      });
    } catch (error) {
      console.error(error);
      this.setState({ generatedToken: 'error' });
    }
  };

  resetTokenfields = () => {
    if (!this.state.smsSendDisabled) {
      // resets Input number, resets stored token value, disables SMS button
      this.setState({
        numberInput: { iso2: 'in', dialCode: '91', phone: '' },
        generatedToken: null,
        smsSendDisabled: true
      });
    }
  };

  render() {
    const {
      user,
      numberInput,
      smsString,
      smsSendDisabled,
      generatedToken
    } = this.state;
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
            <TokenStatusContainer>
              <ReactContainer>
                <Row>
                  Current Line Token
                </Row>
                <Row>
                  <Button
                    color="info"
                    onClick={this.updateToken.bind(null, 'previous')}
                    disabled={this.state.prevDisable}
                  >
                    Previous
                  </Button>
                  <Button
                    color="info"
                  >
                    {this.state.currentToken}
                  </Button>
                  <Button
                    color="info"
                    onClick={this.updateToken.bind(null, 'next')}
                    disabled={this.state.nextDisable}
                  >
                    Next
                  </Button>
                </Row>
              </ReactContainer>
            </TokenStatusContainer>
            <SmsInputContainer>
              <ReactContainer>
                Generate Token
              </ReactContainer>
              <ReactContainer>
                <ReactIntlTelInput
                  inputProps={{ placeholder: 'Enter a phone number', style: { width: '100%' } }}
                  intlTelOpts={{ prefferedCountries: ['in'] }}
                  value={numberInput}
                  onChange={e => this.handleNumberInputChange(e)}
                />
              </ReactContainer>
              <ReactContainer>
                <Button
                  color="info"
                  onClick={() =>
                    this.generateManualToken(
                      this.state.numberInput.dialCode +
                      this.state.numberInput.phone
                    )
                  }
                >
                  Get Token
                </Button>
                <div hidden={!generatedToken}>#{generatedToken}</div>
                <Button
                  color="info"
                  onClick={this.resetTokenfields}
                  href={smsString}
                  disabled={smsSendDisabled}
                >
                  Send SMS
                </Button>
              </ReactContainer>
            </SmsInputContainer>
            <br />
            <Button color="info" onClick={this.toggleAddSlots}>
              Edit Slots
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