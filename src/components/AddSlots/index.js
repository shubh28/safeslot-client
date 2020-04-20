import React, { Component } from 'react';
import AddSlotService from './addSlotService';
import {
  Button,
  ModalBody,
  Modal,
  ModalHeader,
  ModalFooter,
  ListGroup,
  ListGroupItem,
  Input,
  FormGroup
} from 'reactstrap';

import Alerts from '../Alerts';

export default class AddSlots extends Component {
  constructor(props) {
    super(props)

    this.state = {
      error: {},
      allSlots: [],
      selectedTime: {
        start_minutes: 0,
        start_hours: 0,
        end_hours: 0,
        end_minutes: 0,
        maximun_people_allowed: 5
      },
      shop_open_hours: 0,
      shop_open_minutes: 0,
      shop_close_hours: 0,
      shop_close_minutes: 0,
      slot_duration: 15,
    }
    this.maxPeopleAllowedRef = React.createRef();
  }

  componentDidMount() {
    this.getSlots();
  }

  showError = (type, message) => {
    this.setState({
      error: { type, message }
    });
  };

  closeError = () => {
    this.setState({
      error: { type: '', message: '' }
    })
  };

  getSlots = async () => {
    const user = this.props.user;
    const storeId = user && user.storeId;
    const service = new AddSlotService;
    try {
      const slotsRes = await service.fetchSlots(storeId);
      const slots = slotsRes.data;
      this.setState({ allSlots: slots });

    } catch (error) {
      this.showError('danger', 'Error in fetching all slots');
    }
  };

  deleteSlots = async(slotId) => {
    this.closeError();
    const service = new AddSlotService;
    try {
      await service.deleteSlots(slotId);
      this.getSlots();
    } catch (error) {
      this.showError('danger', 'Error in deleting slot');
    }
  };

  addSlots = async(timeString) => {
    this.closeError();
    const user = this.props.user;
    const storeId = user && user.storeId;

    const timeArray = timeString.split(' - ');
    const startTime = timeArray && timeArray[0].split(':');
    const endTime = timeArray && timeArray[1].split(':');
    const startHours = startTime && startTime[0];
    const startMinutes = startTime && startTime[1];
    const endHours = endTime && endTime[0];
    const endMinutes = endTime && endTime[1];

    console.log(timeArray[0]);
    console.log(startTime, endTime);

    const body = {
      start_minutes: startMinutes,
      start_hours: startHours,
      end_hours: endHours,
      end_minutes: endMinutes,
      maximun_people_allowed: document.getElementById(timeString).value || 5,
      storeId: storeId
    };

    const service = new AddSlotService;
    try {
      await service.addSlots(body);
      this.getSlots();
    } catch (error) {
      this.showError('danger', 'Error in adding slot');
    }
  };

  printAllSlots = () => {
    const user = this.props.user;
    const store = user.stores || {};
    const startHour = parseInt(store.shop_open_hours || 0);
    const endHour = parseInt(store.shop_close_hours || 0);
    const startMinutes = parseInt(store.shop_open_minutes || 0);
    const endMinutes = parseInt(store.shop_close_hours || 0);
    const slotDuration = parseInt(store.slot_duration || 0);

    const buttons = [];

    let count = 0;

    for (let i = startHour; i <= endHour; i++) {
      let timeString = '';
      let minutes = 0;
      while (minutes <= 45) {
        timeString = `${i
          .toString()
          .padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        minutes += slotDuration;
        if (minutes >= 60) {
          minutes = minutes % 60;
          i++;
        }
        timeString = timeString + ' - ';
        timeString += `${i
          .toString()
          .padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        const jsx = (
          <ListGroupItem key={timeString} className="slot-listItem">
            {timeString}
            <Input
              type="number"
              id={timeString}
              ref={this.maxPeopleAllowedRef}
              style={{ width: '20%' }}
              defaultValue="0"
            />
            <Button color="link" onClick={this.addSlots.bind(null, timeString)}>
              Add
            </Button>
          </ListGroupItem>
        );
        buttons.push(jsx);
        timeString = '';
        minutes += slotDuration;
      }
    }
    return buttons;
  };

  createHours = type => {
    const options = [];
    const { shop_open_hours, shop_close_hours } = this.state;
    if (type === 'start') {
      const endTime = shop_close_hours !== 0 ? parseInt(shop_close_hours) : 23;
      for (let i = 0; i <= endTime; i++) {
        options.push(
          <option key={i} value={i.toString().padStart(2, '0')}>
            {i.toString().padStart(2, '0')}
          </option>
        );
      }
    } else {
      const startTime = shop_open_hours !== 0 ? parseInt(shop_open_hours) : 0;
      for (let i = startTime; i <= 23; i++) {
        options.push(
          <option key={i} value={i.toString().padStart(2, '0')}>
            {i.toString().padStart(2, '0')}
          </option>
        );
      }
    }
    return options;
  };


  createMinutes = type => {
    const options = [];
    const { shop_close_minutes, shop_open_minutes } = this.state;
    // if (type === "start") {
    // const endTime = shop_close_minutes !== 0 ? parseInt(shop_close_minutes) : 55;
    for (let i = 0; i <= 45; i += 15) {
      options.push(
        <option key={i} value={i.toString().padStart(2, '0')}>
          {i.toString().padStart(2, '0')}
        </option>
      );
    }
    // }

    // else {
    //   const startTime = shop_open_minutes !== 0 ? parseInt(shop_open_minutes) : 0;
    //   for(let i=startTime; i<=55; i+=15){
    //     options.push(
    //       <option key={i} value={i.toString().padStart(2, '0')}>
    //         {i.toString().padStart(2, '0')}
    //       </option>
    //     );
    //   }
    // }
    return options;
  };

  render() {
    const { toggleAddSlots, openModal } = this.props;
    const { allSlots, error,
      shop_close_hours,
      shop_close_minutes } = this.state;

    return (
      <Modal isOpen={openModal} toggle={toggleAddSlots}>
        <ModalHeader toggle={toggleAddSlots}>Your Slots</ModalHeader>
        <ModalBody>
          <Alerts
            type={error.type}
            message={error.message}
            onClose={this.closeError}
          />

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
                {this.createHours('end')}
              </Input>
              &nbsp;:&nbsp;
              <Input
                type="select"
                style={{ width: '20%' }}
                value={shop_close_minutes}
                name="shop_close_minutes"
                onChange={this.handleOnChange}
              >
                {this.createMinutes('end')}
              </Input>
            </FormGroup>

          <p>
            Please add your slots. Enter maximun people allowed in the blank space
            for each slot.
          </p>

          <ListGroup>{this.printAllSlots()}</ListGroup>

          <br></br>
          {allSlots.length > 0 && <p>Delete slots.</p>}

          <ListGroup>
            {allSlots.map(slot => {
              return (
                <ListGroupItem key={slot.id} className="slot-listItem">
                  {slot.start_hours &&
                    slot.start_hours.toString().padStart(2, '0')}
                  :
                  {slot.start_minutes &&
                    slot.start_minutes.toString().padStart(2, '0')}
                  &nbsp;-&nbsp;
                  {slot.end_hours && slot.end_hours.toString().padStart(2, '0')}:
                  {slot.end_minutes &&
                    slot.end_minutes.toString().padStart(2, '0')}
                  <Button
                    color="link"
                    onClick={() => {
                      this.deleteSlots(slot.id);
                    }}
                  >
                    Remove
                  </Button>
                </ListGroupItem>
              );
            })}
          </ListGroup>
          <br></br>
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
