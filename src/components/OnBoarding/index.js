import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Button, Form, FormGroup, Label, Input, FormText, UncontrolledDropdown, DropdownMenu, DropdownItem } from 'reactstrap';
import axios from 'axios';

import {loadState, saveState} from '../../helpers/LocalStorage';

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
			locations: []
		};
	}

	onBoardStore = (e) => {
		e.preventDefault();
		const {	name, store_size, gstin, billing_counters, address,locality,city,latitude, longitude} = this.state;
		if (!name || !billing_counters || !address || !locality || !city) {
			alert("All fields are mandatory")
			return;
		}
		if (!latitude || !longitude) {
			alert("Please select locality from drop down to calculated your coordinates")
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
			}
		}
		axios.post("https://safeslot-backend.herokuapp.com/api/stores", {...body}).then(res => {
			const userId = loadState('userAuthenticationDetails') && loadState('userAuthenticationDetails').userId;
			axios.patch(`https://safeslot-backend.herokuapp.com/api/users/${userId}`, {storeId: res.data.id}).then(user => {
				saveState('userInfo', user.data);
				this.props.history.push("/owners");
			})
			.catch(err => {
				alert("Some error occurred");
			})
		}).catch(err => {
			alert("Some error occurred");
		})
	}

	handleOnChange = (e) => {
		var key = e.target.name;
		if (key === 'locality') {
			this.handleLocalitySearch(e);
		}
		var state = {...this.state};
		state[key] = e.target.value;
		this.setState({...state});
	}

	handleLocalitySearch = (e) => {
		this.setState({term: e.target.value});
		if (e.target.value.length > 3) {
			axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${e.target.value}.json?access_token=pk.eyJ1Ijoic2h1YmgyOCIsImEiOiJjazhidHQ1Z2QwZm11M2lxcGd0Y21uMnR4In0.pkJ2tMkAcfeI6PC7gHIIwQ&cachebuster=1585165720796&autocomplete=true&limit=8`)
				.then(res => {
					this.setState({locations: res.data && res.data.features || []})
				})
				.catch(err => {
					console.log(err);
				})
		}
	}

	handleLocationSelect = (location, center) => {
		this.setState({locality: location, latitude: center[0], longitude: center[1], locations: []});
	}

	render() {
		const {	name, store_size, gstin, billing_counters, address, locality, city} = this.state;
		return(
			<div className="onboarding">
				<div className="bookings">
					<h2 className="text-center">OnBoarding</h2>
					<a href="#" className="logout" onClick={this.logout}>Logout</a>
				</div>
				<Container>
					<Form>
						<FormText tag="h5" color="black">Please fill in your details to get started up.</FormText>
					    <FormGroup>
							<Input type="text" value={name} required onChange={this.handleOnChange} name="name" placeholder="Store name" />
					    </FormGroup>
					    <FormGroup>
							<Input type="text" value={address} required onChange={this.handleOnChange} name="address" placeholder="Your store address" />
					    </FormGroup>
						<FormGroup>
							<Input type="search" autoComplete="off" required value={locality} onChange={this.handleOnChange} name="locality" placeholder="Locality" />
								<UncontrolledDropdown isOpen={this.state.locations.length > 0} toggle={() => {}}>
									<DropdownMenu right>
										{
											this.state.locations.map(location => {
												return (
													<DropdownItem tag="a" key={location.id} onClick={() => this.handleLocationSelect(location.place_name, location.center)}>
														{location.place_name}
													</DropdownItem>
												)
											})
										}
									</DropdownMenu>
								</UncontrolledDropdown>

					    </FormGroup>
						<FormGroup>
							<Input required type="text" value={city} onChange={this.handleOnChange} name="city" placeholder="City" />
					    </FormGroup>
					    <FormGroup>
							<Input type="number" value={billing_counters} required onChange={this.handleOnChange} name="billing_counters" placeholder="Number of billing counters" />
					    </FormGroup>
					    <FormGroup>
							<Input type="text" value={gstin} onChange={this.handleOnChange} name="gstin" placeholder="Your GSTIN number (optional)" />
					    </FormGroup>
					    <FormGroup>
							<Input type="text" value={store_size} onChange={this.handleOnChange} name="store_size" placeholder="Your store size (in sq.ft)" />
					    </FormGroup>
						<FormGroup>
							<Button required type="submit" color="info" onClick={this.onBoardStore} >Submit</Button>
					    </FormGroup>

				    </Form>
				</Container>
			</div>
		);
	}
}