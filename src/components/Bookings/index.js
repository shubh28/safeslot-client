import React, {Component} from 'react';
import {Container, Row, Col, Card, CardBody, CardSubtitle, CardTitle, Button, ModalBody,Modal, ModalHeader, ModalFooter, Badge} from 'reactstrap';
import axios from 'axios';
import {Link} from 'react-router-dom';


import {loadState} from "../../helpers/LocalStorage";

export default class Bookings extends Component {

	constructor(props) {
		super(props);
		this.state = {
			bookings: [],
			openModal: false,
			selectedbooking: {}
		}
	}
	
	componentDidMount() {
		const userId = loadState('userAuthenticationDetails') && loadState('userAuthenticationDetails').userId;
		if (!userId) {
			this.props.history.push('/');
			return;
		}
		// const filter = {"where": {user_id: userId}, "include": "stores"};
		const filter = {"include": "stores"};
		axios.get(`https://safeslot-backend.herokuapp.com/api/bookings?filter=${JSON.stringify(filter)}`)
			.then(res => {
				this.setState({bookings: res.data})
			})
			.catch(err => {

			}) 
	}

	viewBooking = (booking) => {
		if (booking.id) {
			this.setState({openModal: true, selectedbooking: booking})
		} else {
			this.setState({openModal: false, selectedbooking: {}})
		}
	}

	render() {
		return(
			<div>
				<div className="bookings">
					<div className="booking-header">
						<Link to="/">
							<span className="material-icons">
								arrow_back
							</span>
						</Link>
					</div>
					<h2 className="text-center">Bookings</h2>
				</div>
				<Container>
					<div className="booking-wrapper">
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
											    		<h6><strong>Booking Date:</strong> {booking.booking_date}</h6> 
											    		<h6><strong>Your Slot:</strong> {booking.slot_id}</h6> 
											    	</CardTitle>
											    	{
											    		booking.stores &&
											    			<CardSubtitle>{booking.stores.address}, {booking.stores.locality}, {booking.stores.city}</CardSubtitle>

											    	}
											      <Button outline color="info" onClick={() => this.viewBooking(booking)}>View Details</Button>
											    </CardBody>
											</Card>
										);
									})
								}
							</Col>
						</Row>
					</div>
				</Container>				
				<Modal isOpen={this.state.openModal} toggle={this.viewBooking}>
					<ModalHeader toggle={this.viewBooking}>Your Booking Details</ModalHeader>
					<ModalBody>
						<h5>Your booking is &nbsp;
						
						<Badge 
							color={this.state.selectedbooking.status === "CONFIRMED" ? 'success': 'danger'}
						>
							{this.state.selectedbooking.status}
						</Badge>
						Please take screen shot of this screen and show at the store.
						</h5>
			        </ModalBody>
			        <ModalFooter>
			        	<Button color="info" outline onClick={this.viewBooking}>Close</Button>
			        </ModalFooter>
				</Modal>
			</div>
		)
	}
}