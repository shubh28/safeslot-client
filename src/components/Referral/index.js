import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import axios from 'axios';

import Alerts from '../Alerts';
import { loadState, saveState } from '../../helpers/LocalStorage';
import { URL_REFS } from '../../common/consts';
import Header from '../common/Header';

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
      email: '',
      phone: '',
      error: {}
    };
  }

  componentDidMount() {
    const userId =
      loadState('userAuthenticationDetails') &&
      loadState('userAuthenticationDetails').userId;
    if (!userId) {
      this.props.history.push(`/login?ref=${URL_REFS.referStore}`);
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
      phone,
      email,
      store_type
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
      store_size,
      gstin,
      billing_counters,
      location: {
        lat: latitude,
        lng: longitude
      },
      phone,
      email,
      store_type,
      isVerified: false,
      referredBy: userId
    };
    axios
      .post('https://safeslot-backend.herokuapp.com/api/stores', { ...body })
      .then(res => {
        this.props.history.push('/');
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
                toggle={() => {}}
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
