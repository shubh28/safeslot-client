import React, { Component } from 'react';
import {Container, Row, Col, Card, CardBody, CardSubtitle, CardTitle, Button, ModalBody,Modal, ModalHeader, ModalFooter, Badge, Input} from 'reactstrap';
import axios from 'axios';

import {saveState, loadState} from '../../helpers/LocalStorage';

export default class OwnerHome extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			user: {},
			bookings: [],
			viewDetails: false,
			selectedbooking: {}
		}
	}

	componentDidMount() {
		const {user} = this.state;
		const userId = loadState('userAuthenticationDetails') && loadState('userAuthenticationDetails').userId;

		axios.get(`https://safeslot-backend.herokuapp.com/api/users/${userId}?filter={"include": "stores"}`)
			.then(res => {
				const user = res.data;
				this.setState({user});
				if (!user.isStoreOwner) {
					this.props.history.push("/");
					return;
				}
				if (user.isStoreOwner && !user.storeId) {
					this.props.history.push("/onboard");
				} else {
					const storeId = user && user.storeId;
					const filter = {where: {store_id: storeId}}
					axios.get(`https://safeslot-backend.herokuapp.com/api/bookings?filter=${JSON.stringify(filter)}`)
						.then(res => {
							this.setState({bookings: res.data});
						})
						.catch(err => {
							alert("Some error occurred");
						})
				}
			}).catch(err => {
				alert("Some error occurred");
			});
	}

	toggleViewDetails = (booking) => {
		if (booking.id) {
			this.setState({viewDetails: true, selectedbooking: booking});
		} else {
			this.setState({viewDetails: false, selectedbooking: {}});
		}
	}

	viewBooking

	render() {

		const { user } = this.state;
		const store = user && user.stores || {};
		return (
			<div className="owners">
				<div className="bookings">
					<h2 className="text-center">Owner Portal</h2>
					<a href="#" className="logout" onClick={this.logout}>Logout</a>
				</div>
				<Container>
					<div className="booking-wrapper">
						<h5>{store.name}</h5>
						<h5>{user.phone}</h5>
						<h6>{store.address}</h6>
						<h6>{store.locality}</h6>
						{
							this.state.bookings.length === 0 &&
								<h3 className="text-center">No Bookings Found</h3>
						}
						<Row>
							<Col lg="4">
								{
									this.state.bookings.map(booking => {
										return(
											<Card key={booking.id}>
											    <CardBody>
											    	<CardTitle>
											    		<h5>Booking Id: {booking.id}</h5>
											    		<h6><strong>Booking Date:</strong> {new Date(booking.booking_date).toDateString()}</h6> 
											    		<h6><strong>Your Slot:</strong> {booking.slot_id}</h6> 
											    	</CardTitle>
											    	{
											    		booking.stores &&
											    			<CardSubtitle>{booking.stores.locality}, {booking.stores.city}</CardSubtitle>

											    	}
											      <Button outline color="info" onClick={() => this.toggleViewDetails(booking)}>View Details</Button>
											    </CardBody>
											</Card>
										);
									})
								}
							</Col>
						</Row>
					</div>
					<Modal isOpen={this.state.viewDetails} toggle={this.toggleViewDetails}>
						<ModalHeader toggle={this.toggleViewDetails}>Order Details</ModalHeader>
						<ModalBody>
							<p>Please add your order details. Please add your items and quantity of the item you want to purchase. We will get your order prepared while you go to pick it.</p>
							<Input 
								type="textarea" 
								name="order_details" 
								rows="8" 
								value={this.state.orderDetails || this.state.selectedbooking.order_details} 
								onChange={this.handleOrderDetails} 
							/>
							<p>*All items are subject to availabilty</p>
				        </ModalBody>
				        <ModalFooter>
				        	<Button color="info" outline onClick={this.addOrderDetails}>Add</Button>
				        	<Button color="info" outline onClick={this.toggleViewDetails}>Close</Button>
				        </ModalFooter>
					</Modal>
				</Container>
			</div>
		);
	}
}