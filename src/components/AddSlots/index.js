import React, { Component } from 'react';
import {
  Button,
  ModalBody,
  Modal,
  ModalHeader,
  ModalFooter,
  ListGroup,
  ListGroupItem
} from 'reactstrap';
import axios from 'axios';

import Alerts from '../Alerts';

export default class AddSlots extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allSlots: [],
      mySlots: {},
      error: {}
    };
  }

  componentDidMount() {
    this.getSlots();
  }

  getSlots = () => {
    this.closeError();
    const { user } = this.props;
    const storeId = user && user.stores && user.stores.id;
    const filter = { where: { storesId: storeId }, include: 'slots' };
    const mySlots = {};
    axios
      .get(
        `https://safeslot-backend.herokuapp.com/api/stores_slots_counts?filter=${JSON.stringify(
          filter
        )}`
      )
      .then(res => {
        res.data.forEach(slot => {
          mySlots[slot.slotsId] = slot;
        });
        this.setState({ mySlots });
      })
      .catch(err => {
        this.showError('danger', 'Error in fetching slots');
      });

    axios
      .get(`https://safeslot-backend.herokuapp.com/api/slots`)
      .then(res => {
        this.setState({
          allSlots: res.data
        });
      })
      .catch(err => {
        this.showError('danger', 'Error in fetching all slots');
      });
  };

  addSlots = slot => {
    this.closeError();
    const { user } = this.props;
    const storeId = user && user.stores && user.stores.id;
    console.log(slot);
    const body = {
      slot_count: 5,
      slotsId: slot.id,
      storesId: storeId
    };

    axios
      .post(`https://safeslot-backend.herokuapp.com/api/stores_slots_counts`, {
        ...body
      })
      .then(res => {
        this.getSlots();
      })
      .catch(err => {
        this.showError('danger', 'Error in adding slot');
      });
  };

  deleteSlots = slot => {
    this.closeError();
    axios
      .delete(
        `https://safeslot-backend.herokuapp.com/api/stores_slots_counts/${slot.id}`
      )
      .then(res => {
        this.getSlots();
      })
      .catch(err => {
        this.showError('danger', 'Error in deleting slot');
      });
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
    const { toggleAddSlots, user, openModal } = this.props;
    const { mySlots, allSlots } = this.state;
    return (
      <Modal isOpen={openModal} toggle={toggleAddSlots}>
        <ModalHeader toggle={toggleAddSlots}>Your Slots</ModalHeader>
        <ModalBody>
          <Alerts
            type={this.state.error.type}
            message={this.state.error.message}
            onClose={this.closeError}
          />

          <p>Please add/remove your slots.</p>
          <ListGroup>
            {Object.keys(mySlots).map(slot => {
              return (
                <ListGroupItem key={slot} className="slot-listItem">
                  {mySlots[slot] &&
                    `${mySlots[slot].slots.start_time} - ${mySlots[slot].slots.end_time}`}
                  <Button
                    color="link"
                    onClick={() => {
                      this.deleteSlots(mySlots[slot]);
                    }}
                  >
                    Remove
                  </Button>
                </ListGroupItem>
              );
            })}
          </ListGroup>
          <br></br>
          <ListGroup>
            {allSlots.map(slot => {
              if (!mySlots[slot.id]) {
                return (
                  <ListGroupItem key={slot.id} className="slot-listItem">
                    {slot.start_time} - {slot.end_time}
                    <Button color="link" onClick={() => this.addSlots(slot)}>
                      Add
                    </Button>
                  </ListGroupItem>
                );
              }
            })}
          </ListGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="info" outline onClick={toggleAddSlots}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
