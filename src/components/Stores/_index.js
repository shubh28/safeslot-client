import React, { Component } from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  Button,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap';
import axios from 'axios';

import { loadState } from '../../helpers/LocalStorage';
import { useParams } from 'react-router-dom';
export default class Stores extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stores: [],
      openSlots: false,
      slots: [],
      selectedSlot: '',
      selectedStore: ''
    };
  }

  componentDidMount() {
    const { selectedLocation } = this.props;
    const location = selectedLocation && selectedLocation.split(',')[0];
    axios
      .get(
        `https://safeslot-backend.herokuapp.com/api/stores/location?location=${location}`
      )
      .then(res => {
        this.setState({ stores: res.data });
      })
      .catch(err => {
        alert('Some error while fetching stores');
      });
  }

  toggleModal = storesId => {
    if (this.state.openSlots) {
      this.setState({
        openSlots: !this.state.openSlots,
        slots: []
      });
    } else {
      const filter = { where: { storesId }, include: 'slots' };
      axios
        .get(
          `https://safeslot-backend.herokuapp.com/api/stores_slots_counts?filter=${JSON.stringify(
            filter
          )}`
        )
        .then(res => {
          this.setState({
            openSlots: true,
            slots: res.data,
            selectedStore: storesId
          });
        })
        .catch(err => {
          alert('Some error while fetching stores');
        });
    }
  };

  makeBooking = () => {
    const { isLoggedIn, history } = this.props;
    const { selectedStore, selectedSlot } = this.state;
    const userId =
      loadState('userAuthenticationDetails') &&
      loadState('userAuthenticationDetails').userId;
    if (!isLoggedIn) {
      history.push('/login');
    } else {
      axios
        .post('https://safeslot-backend.herokuapp.com/api/bookings', {
          store_id: selectedStore,
          slot_id: selectedSlot,
          user_id: userId
        })
        .then(res => {
          history.push('/bookings');
        })
        .catch(err => {
          alert('Error while making booking');
        });
    }
  };

  selectSlot = slot => {
    this.setState({
      selectedSlot: slot
    });
  };

  render() {
    return (
      <>
        {/* <Row style={{marginBottom: '1rem'}}>
					<Col lg="4">
						<Map stores={this.state.stores} />
					</Col>
				</Row> */}
        {/* <Row>				
					<Col lg="4">
						{
							this.state.stores.map(store => {
								return (
									<Card key={store.id}>
										<CardBody>
											<CardTitle>
												<h3>{store.name}</h3>
											</CardTitle>
										<CardSubtitle>{store.address}, {store.locality}, {store.city}</CardSubtitle>
										<Button outline color="info" onClick={() => this.toggleModal(store.id)}>Book Slot</Button>
										</CardBody>
									</Card>
								);
							})
						}
					</Col>
					<Modal isOpen={this.state.openSlots} toggle={this.toggleModal}>
						<ModalHeader toggle={this.toggleModal}>Select your slot</ModalHeader>
						<ModalBody>
							{
								this.state.slots.map(slot => {
									return (
										<Button 
											key={slot.id}
											color="info" 
											outline={slot.slots && this.state.selectedSlot !==  `${slot.slots.start_time} - ${slot.slots.end_time}`} 
											size="sm" 
											onClick={() => {this.selectSlot(slot.slots && `${slot.slots.start_time} - ${slot.slots.end_time}`)}}
										>
											{slot.slots && `${slot.slots.start_time} - ${slot.slots.end_time}`}
										</Button>									
									);
								})
							}
						</ModalBody>
						<ModalFooter>
							<Button color="info" onClick={this.makeBooking} disabled={this.state.selectedSlot === ''}>
								Book Now
							</Button>{' '}
							<Button color="info" outline onClick={this.toggleModal}>Cancel</Button>
						</ModalFooter>
					</Modal>
				</Row> */}
      </>
    );
  }
}
