import React, {Component} from 'react';
import Typist from 'react-typist';
import {Link} from "react-router-dom";
import { Button, Input, DropdownItem, DropdownMenu, UncontrolledDropdown } from 'reactstrap';
import axios from 'axios';

import Stores from '../Stores';
import {loadState} from "../../helpers/LocalStorage";

const scrollToBottom = () => {
	window.scrollBy(0, window.innerHeight / 2);
}

export default class Home extends Component {

	constructor(props) {
		super(props);
		this.state = {
			locations: [],
			selectedLocation: '',
			isLoggedIn: false,
			term: ''
		}
	}

	componentDidMount() {
		const token = loadState('userAuthenticationDetails') && loadState('userAuthenticationDetails').id;
		if (token) {
			this.setState({isLoggedIn: true});
		}
	}

	searchLocality = (e) => {
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

	handlePlaceSelect(place) {
		scrollToBottom();
		this.setState({
			selectedLocation: place,
			locations: [],
			term: place
		})
	}

	render() {

		const {isLoggedIn} = this.state;

		return(
			<div className="wrapper">
				<div className="top-fold">
					<div className="overlay">
						<div className="login-btn">
							<Button color="link">Join Us!</Button>
							{
								isLoggedIn?
									<Button tag={Link} to="/bookings" outline color="primary">My Bookings</Button>:
									<Button tag={Link} to="/login" outline color="primary">Login</Button>
							}
							
						</div>
						<h2 className="hero-text">
							Stay Home. Stay Safe! 
						</h2>
						<div className="hero-sub-text">
							<Typist avgTypingDelay={100} startDelay={2000}>
					        	Stuck in lockdown?
					        	<Typist.Backspace count={18} delay={2000} />
					        	Running out off food and essentials?
					        	<Typist.Backspace count={36} delay={2000} />
					        	Want to skip queues and maintain isolation?
					      	</Typist>
					      	<div className="mt1">Book your slots now in your nearest stores</div>
						</div>
						<div className="book-now-btn">
							<Button outline color="primary" onClick={scrollToBottom}>Book Now</Button>	
						</div>
					</div>
				</div>
				<br></br>
				<div className="container store">
					<h3>Find your nearest stores</h3>
					<Input 
						type="search" 
						name="locality" 
						id="locality" 
						placeholder="Your locality.." 
						onChange={this.searchLocality}
						autoComplete="off"
						value={this.state.term}
					/>
					<UncontrolledDropdown isOpen={this.state.locations.length > 0} toggle={() => {}}>
						<DropdownMenu right>
							{
								this.state.locations.map(location => {
									return (
										<DropdownItem tag="a" key={location.id} onClick={() => this.handlePlaceSelect(location.place_name)}>
											{location.place_name}
										</DropdownItem>
									)
								})
							}
						</DropdownMenu>
					</UncontrolledDropdown>
					<div className="cities">
						<p>Popular Cities: {' '}</p>
						<Button outline color="info" size="sm" onClick={() => this.handlePlaceSelect("Delhi")}>Delhi</Button>{' '}
						<Button outline color="info" size="sm" onClick={() => this.handlePlaceSelect("Gurugram")}>Gurugram</Button>{' '}
						<Button outline color="info" size="sm" onClick={() => this.handlePlaceSelect("Bangalore")}>Bangalore</Button>{' '}
						<Button outline color="info" size="sm" onClick={() => this.handlePlaceSelect("Noida")}>Noida</Button>{' '}
						<Button outline color="info" size="sm" onClick={() => this.handlePlaceSelect("Mumbai")}>Mumbai</Button>{' '}
					</div>
					{
						this.state.selectedLocation && 
							<Stores selectedLocation={this.state.selectedLocation} history={this.props.history} isLoggedIn={isLoggedIn} />
					}
				</div>
			</div>
		);
	}
}