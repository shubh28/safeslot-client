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
import axios from 'axios';
import Alerts from '../Alerts';
import { Header } from '../common';
import { loadState, saveState } from '../../helpers/LocalStorage';
import { createHours, createMinutes } from '../../helpers/index'
import TimeSelectFormGroup from '../common/TimeSelectFormGroup';
import SlotDuration from '../common/SlotDuration';

export default class OnBoarding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      store_size: '',
      gstin: '',
      billing_counters: '',
      address: '',
      locality: '',
      city: '',
      latitude: '',
      longitude: '',
      locations: [],
      store_type: '',
      shop_open_hours: 0,
      shop_open_minutes: 0,
      shop_close_hours: 0,
      shop_close_minutes: 0,
      slot_duration: 15,
      error: {}
    };
  }

  componentDidMount() {
    const userId =
      loadState('userAuthenticationDetails') &&
      loadState('userAuthenticationDetails').userId;
    if (!userId) {
      this.props.history.push('/');
      return;
    }
  }

  onBoardStore = e => {
    e.preventDefault();
    const {
      name,
      store_size,
      gstin,
      billing_counters,
      address,
      locality,
      city,
      latitude,
      longitude,
      store_type,
      shop_open_hours,
      shop_open_minutes,
      shop_close_hours,
      shop_close_minutes,
      slot_duration
    } = this.state;
    if (
      !name ||
      !billing_counters ||
      !address ||
      !locality ||
      !city ||
      !store_type
    ) {
      this.showError('danger', 'All fields are mandatory');
      return;
    }
    if (!latitude || !longitude) {
      this.showError(
        'danger',
        'Please select locality from drop down to calculate your coordinates'
      );
      return;
    }
    const body = {
      name,
      address,
      locality,
      city,
      store_size,
      gstin,
      billing_counters,
      location: {
        lat: latitude,
        lng: longitude
      },
      store_type,
      isVerified: true,
      shop_open_hours,
      shop_open_minutes,
      shop_close_hours,
      shop_close_minutes,
      slot_duration
    };

    axios
      .post('https://safeslot-backend.herokuapp.com/api/stores', { ...body })
      .then(res => {
        const userId =
          loadState('userAuthenticationDetails') &&
          loadState('userAuthenticationDetails').userId;

        return axios.patch(
          `https://safeslot-backend.herokuapp.com/api/users/${userId}`,
          {
            storeId: res.data.id
          }
        );
      })
      .then(user => {
        saveState('userInfo', user.data);
        this.props.history.push('/owners');
      })
      .catch(err => {
        this.showError('danger', 'Some error occurred');
      });
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

  handleLocalitySearch = e => {
    this.setState({ term: e.target.value });
    if (e.target.value.length > 3) {
      axios
        .get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${e.target.value}.json?access_token=pk.eyJ1Ijoic2h1YmgyOCIsImEiOiJjazhidHQ1Z2QwZm11M2lxcGd0Y21uMnR4In0.pkJ2tMkAcfeI6PC7gHIIwQ&cachebuster=1585165720796&autocomplete=true&limit=8`
        )
        .then(res => {
          this.setState({ locations: (res.data && res.data.features) || [] });
        })
        .catch(err => {
          console.log(err);
        });
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
      store_size,
      gstin,
      billing_counters,
      address,
      locality,
      city,
      shop_open_hours,
      shop_open_minutes,
      shop_close_hours,
      shop_close_minutes,
      slot_duration
    } = this.state;
    return (
      <div className="onboarding">
        <div className="bookings">
          <Header heading="OnBoarding" backPath={'/'} />
        </div>
        <Container>
          <Form>
            <Alerts
              type={this.state.error.type}
              message={this.state.error.message}
              onClose={this.closeError}
            />

            <FormText tag="h5" color="black">
              Please fill in your details to get started up.
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
                name="billing_counters"
                placeholder="Number of billing counters"
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="text"
                value={gstin}
                onChange={this.handleOnChange}
                name="gstin"
                placeholder="Your GSTIN number (optional)"
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="text"
                value={store_size}
                onChange={this.handleOnChange}
                name="store_size"
                placeholder="Your store size (in sq.ft)"
              />
            </FormGroup>
            <TimeSelectFormGroup
              shop_open_hours={shop_open_hours}
              shop_open_minutes={shop_open_minutes}
              shop_close_hours={shop_close_hours}
              shop_close_minutes={shop_close_minutes}
              onOpenHoursChanged={(hours) => {
                this.setState({
                  shop_open_hours: hours
                })
              }}
            >
              <label style={{ width: '50%' }}>Shop Opening Time</label>
              <Input
                type="select"
                style={{ width: '20%' }}
                value={shop_open_hours}
                name="shop_open_hours"
                onChange={this.handleOnChange}
              >
                {createHours('start', shop_open_hours, shop_close_hours)}
              </Input>
              &nbsp;:&nbsp;
              <Input
                type="select"
                style={{ width: '20%' }}
                value={shop_open_minutes}
                name="shop_open_minutes"
                onChange={this.handleOnChange}
              >
                {createMinutes('start')}
              </Input>
            </FormGroup>
            <FormGroup
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <label style={{ width: '50%' }}>Shop Closing Time</label>
              <Input
                type="select"
                style={{ width: '20%' }}
                value={shop_close_hours}
                name="shop_close_hours"
                onChange={this.handleOnChange}
              >
                {createHours('end', shop_open_hours, shop_close_hours)}
              </Input>
              &nbsp;:&nbsp;
              <Input
                type="select"
                style={{ width: '20%' }}
                value={shop_close_minutes}
                name="shop_close_minutes"
                onChange={this.handleOnChange}
              >
                {createMinutes('end')}
              </Input>
            </FormGroup>
            <FormGroup>
              <label>Duration of each slot</label>
              <Input
                type="select"
                value={slot_duration}
                name="slot_duration"
                onChange={this.handleOnChange}
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
              </Input>
            </FormGroup>

              onOpenMinsChanged={(mins) => {
                this.setState({
                  shop_open_minutes: mins
                })
              }}
              onCloseHoursChanged={(hours) => {
                this.setState({
                  shop_close_hours: hours
                })
              }}
              onCloseMinsChanged={(mins) => {
                this.setState({
                  shop_close_minutes: mins
                })
              }}
            />
            <SlotDuration
              slotDuration={slot_duration}
              onDurationChange={(duration) => {
                this.setState({
                  slot_duration: duration
                })
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
