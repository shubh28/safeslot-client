import React, {Component} from 'react';
import {Button, ModalBody,Modal, ModalHeader, ModalFooter, ListGroup, ListGroupItem} from 'reactstrap';
import axios from 'axios';

export default class AddSlots extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			allSlots: [],
			mySlots: {}
		}
	}

	componentDidMount() {
		this.getSlots();
	}

	getSlots = () => {
		const {user} = this.props;
		const storeId = user && user.stores && user.stores.id;
		const filter = {where:{storesId: storeId}, include: "slots"};
		const mySlots = {};
		axios.get(`https://safeslot-backend.herokuapp.com/api/stores_slots_counts?filter=${JSON.stringify(filter)}`)
			.then(res => {
				res.data.forEach(slot => {
					mySlots[slot.slotsId] = slot
				});
				this.setState({mySlots});
			})
			.catch(err => {
				alert("Error in fetching slots");
			})
		axios.get(`https://safeslot-backend.herokuapp.com/api/slots`)
			.then(res => {
				this.setState({
					allSlots: res.data
				});
			})
			.catch(err => {
				alert("Error in fetching slots");
			})
	}

	addSlots = (slot) => {
		const {user} = this.props;
		const storeId = user && user.stores && user.stores.id;
		console.log(slot);
		const body = {
			"slot_count": 5,
			"slotsId": slot.id,
			"storesId": storeId
		};

		axios.post(`https://safeslot-backend.herokuapp.com/api/stores_slots_counts`, {...body})
			.then(res => {
				this.getSlots();
			})
			.catch(err => {
				alert("Error in adding slot");
			})

	}

	deleteSlots = (slot) => {
		axios.delete(`https://safeslot-backend.herokuapp.com/api/stores_slots_counts/${slot.id}`)
			.then(res => {
				this.getSlots();
			})
			.catch(err => {
				alert("Error in deleting slot");
			})
	}

	render() {

		const { toggleAddSlots, user, openModal } = this.props;
		const {mySlots, allSlots} = this.state;
		return(
			<Modal isOpen={openModal} toggle={toggleAddSlots}>
				<ModalHeader toggle={toggleAddSlots}>Your Slots</ModalHeader>
				<ModalBody>
					<p>Please add/remove your slots.</p>
					<ListGroup>
						{
							Object.keys(mySlots).map(slot => {
								return (
									<ListGroupItem key={slot} className="slot-listItem">
										{mySlots[slot] && `${mySlots[slot].slots.start_time} - ${mySlots[slot].slots.end_time}`}
										<Button color="link" onClick={() => {this.deleteSlots(mySlots[slot])}}>Remove</Button>
									</ListGroupItem>
								)
							})
						}
					</ListGroup>
					<br></br>
					<ListGroup>
						{
							allSlots.map(slot => {
								if (!mySlots[slot.id]) {
									return(
										<ListGroupItem key={slot.id} className="slot-listItem">
											{slot.start_time} - {slot.end_time}
											<Button color="link" onClick={() => this.addSlots(slot)}>Add</Button>
										</ListGroupItem>
									);
								}
							})
						}
					</ListGroup>
		        </ModalBody>
		        <ModalFooter>
		        	<Button color="info" outline onClick={toggleAddSlots}>Close</Button>
		        </ModalFooter>
			</Modal>
		);
	}
}