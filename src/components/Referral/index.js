import React, { Component } from 'react';
import {
  Container,
  Button,
  Form,
  FormGroup,
  Input,
  FormText,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import ReferralService from './ReferralService';
import { loadUserAuthenticationDetails } from '../../helpers/LocalStorage';
import Alerts from '../Alerts';
import { loadState } from '../../helpers/LocalStorage';
import { URL_REFS } from '../../common/consts';
import Header from '../common/Header';
import {
  formatHoursAndMinutes,
  generateTimeSlots
} from '../../helpers/timeSlotHelpers';
import TimeSelectFormGroup from '../common/TimeSelectFormGroup';
import SlotDuration from '../common/SlotDuration';

export default class OnBoarding extends Component {

  service = new ReferralService;

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      billing_counters: '',
      address: '',
      locality: '',
      city: '',
      latitude: '',
      longitude: '',
      locations: [],
      store_type: '',
      email: '',
      phone: '',
      error: {},
      shop_open_hours: 9,
      shop_open_minutes: 0,
      shop_close_hours: 17,
      shop_close_minutes: 0,
    };
  }

  componentDidMount() {
    const userAuthDetails = loadUserAuthenticationDetails();
    const userId = userAuthDetails && userAuthDetails.userId;
    if (!userId) {
      this.props.history.push(`/login?ref=${URL_REFS.referStore}`);
      return;
    }
  }

  onBoardStore = async e => {
    e.preventDefault();
    try {
      const {
        name,
        billing_counters,
        address,
        locality,
        city,
        latitude,
        longitude,
        phone,
        email,
        store_type,
        shop_open_hours,
        shop_open_minutes,
        shop_close_hours,
        shop_close_minutes
      } = this.state;
      if (
        !name ||
        !billing_counters ||
        !address ||
        !locality ||
        !city ||
        !store_type
      ) {
        this.showError('danger', 'Please fill in the fields that are mandatory');
        return;
      }
      if (!latitude || !longitude) {
        this.showError(
          'danger',
          'Please select locality from drop down to calculated your coordinates'
        );
        return;
      }
      const userId =
        loadState('userAuthenticationDetails') &&
        loadState('userAuthenticationDetails').userId;

      const body = {
        name,
        address,
        locality,
        city,
        billing_counters,
        location: {
          lat: latitude,
          lng: longitude
        },
        phone,
        email,
        store_type,
        isVerified: false,
        referredBy: userId,
        shop_open_hours,
        shop_open_minutes,
        shop_close_hours,
        shop_close_minutes,
        slot_duration: 30
      };

      const res = await this.service.postReferredStore(body);
      let store = res.data;

      const startTime = formatHoursAndMinutes(
        parseInt(store.shop_open_hours || 0),
        parseInt(store.shop_open_minutes || 0)
      );

      const endTime = formatHoursAndMinutes(
        parseInt(store.shop_close_hours || 0),
        parseInt(store.shop_close_minutes || 0)
      );

      const slotDuration = store.slot_duration;
      const isVerified = store.isVerified;
      const slots = generateTimeSlots(startTime, endTime, slotDuration, isVerified)
      await this.service.updateSlotsForReferredStore(store.id, slots);


      this.props.history.push('/');

    } catch (error) {
      this.showError('danger', 'Some error occurred');
    }
  };

  handleOnChange = e => {
    const key = e.target.name;
    if (key === 'locality') {
      this.handleLocalitySearch(e);
    }
    this.setState(
      Object.assign({ ...this.state }, { [key]: e.target.value, error: {} })
    );
  };

  handleLocalitySearch = async e => {
    try {
      this.setState({ term: e.target.value });
      if (e.target.value.length > 3) {
        const res = await this.service.getLocations(e.target.value);
        this.setState({ locations: (res.data && res.data.features) || [] });
      }
    } catch (error) {
      console.log(error);
    }
  };

  handleLocationSelect = (location, center) => {
    this.setState({
      locality: location,
      latitude: center[1],
      longitude: center[0],
      locations: []
    });
  };

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

  render() {
    const {
      name,
      billing_counters,
      address,
      locality,
      city,
      phone,
      email
    } = this.state;
    return (
      <div className="onboarding">
        <Header heading={'Refer Store'} backPath={'/'} />
        <Container>
          <Form>
            <Alerts
              type={this.state.error.type}
              message={this.state.error.message}
              onClose={this.closeError}
            />

            <FormText tag="h5" color="black">
              Please refer nearby stores.
            </FormText>
            <FormGroup>
              <Input
                type="text"
                value={name}
                required
                onChange={this.handleOnChange}
                name="name"
                placeholder="Store name"
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="tel"
                value={phone}
                required
                onChange={this.handleOnChange}
                name="phone"
                placeholder="Phone Number (Optional)"
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="email"
                value={email}
                required
                onChange={this.handleOnChange}
                name="email"
                placeholder="Email (Optional)"
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="select"
                name="store_type"
                onChange={this.handleOnChange}
                required
              >
                <option>Select Store type</option>
                <option value="GROCERY">Groceries</option>
                <option value="PHARMACY">Pharmacies</option>
                <option value="BOOK STORE">Book Store</option>
                <option value="CLOTHING">Clothing</option>
                <option value="OTHERS">Others</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Input
                type="text"
                value={address}
                required
                onChange={this.handleOnChange}
                name="address"
                placeholder="Your store address"
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="search"
                autoComplete="off"
                required
                value={locality}
                onChange={this.handleOnChange}
                name="locality"
                placeholder="Locality"
              />
              <UncontrolledDropdown
                isOpen={this.state.locations.length > 0}
                toggle={() => { }}
              >
                <DropdownMenu right>
                  {this.state.locations.map(location => {
                    return (
                      <DropdownItem
                        tag="a"
                        key={location.id}
                        onClick={() =>
                          this.handleLocationSelect(
                            location.place_name,
                            location.center
                          )
                        }
                      >
                        {location.place_name}
                      </DropdownItem>
                    );
                  })}
                </DropdownMenu>
              </UncontrolledDropdown>
            </FormGroup>
            <FormGroup>
              <Input
                required
                type="text"
                value={city}
                onChange={this.handleOnChange}
                name="city"
                placeholder="City"
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="number"
                value={billing_counters}
                required
                onChange={this.handleOnChange}
                min={0}
                max={1000}
                onInput={(e) => {
                  e.target.value = Math.min(e.target.value, 1000)
                }}
                name="billing_counters"
                placeholder="Number of billing counters"
              />
            </FormGroup>
            <TimeSelectFormGroup shop_open_hours={this.state.shop_open_hours}
              shop_open_minutes={this.state.shop_open_minutes}
              shop_close_hours={this.state.shop_close_hours}
              shop_close_minutes={this.state.shop_close_minutes}
              onOpenHoursChanged={(hours) => {
                this.setState({ shop_open_hours: hours });
              }}
              onOpenMinsChanged={async (mins) => {
                this.setState({ shop_open_minutes: mins })
              }}
              onCloseHoursChanged={async (hours) => {
                this.setState({ shop_close_hours: hours })
              }}
              onCloseMinsChanged={async (mins) => {
                this.setState({ shop_close_minutes: mins })
              }} />
            <FormGroup>
              <Button
                required
                type="submit"
                color="info"
                onClick={this.onBoardStore}
              >
                Submit
              </Button>
            </FormGroup>
          </Form>
        </Container>
      </div>
    );
  }
}
