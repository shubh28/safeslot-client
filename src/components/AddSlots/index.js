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
} from 'reactstrap';
import Alerts from '../Alerts';
import TimeSelectFormGroup from '../common/TimeSelectFormGroup';
import SlotDuration from '../common/SlotDuration';


export default class AddSlots extends Component {

  service = new AddSlotService;

  constructor(props) {
    super(props)
    this.state = {
      error: {},
      store: {},
      slots: [],
    }
    this.maxPeopleAllowedRef = React.createRef();
  }

  async componentDidMount() {
    const storeId = this.props.storeId;
    this.setState({
      store: await this.service.getStoreData(storeId)
    });
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
    const storeId = this.props.storeId;
    try {
      const slots = await this.service.fetchSlots(storeId);
      this.setState({ slots });
    } catch (error) {
      this.showError('danger', 'Error in fetching all slots');
    }
  };

  toTimestamp = (str) => {
    // date requires a date and time. we can't have only time
    // so this is a dummy date
    return new Date('01/01/1970 ' + str).getTime();
  }

  timestampToTime = (timestamp) => {
    let date = new Date(timestamp);
    return this.formatHoursAndMinutes(date.getHours(), date.getMinutes());
  }

  formatHoursAndMinutes = (hours, mins) => {
    return ((hours.toString().length === 1) ? '0' + hours : hours) + ':' +
      ((mins.toString().length === 1) ? '0' + mins : mins);
  }

  addMinutes = (timeInSeconds, minutesToAdd) => {
    let secondsToAdd = (minutesToAdd * 60000);
    return timeInSeconds + secondsToAdd
  }

  pairwise = (arr, func) => {
    for (let i = 0; i < arr.length - 1; i++) {
      func(arr[i], arr[i + 1])
    }
  }

  getStartTime = () => {
    const store = this.state.store;
    return this.formatHoursAndMinutes(
      parseInt(store.shop_open_hours || 0),
      parseInt(store.shop_open_minutes || 0)
    );
  }

  getEndTime = () => {
    const store = this.state.store;
    return this.formatHoursAndMinutes(
      parseInt(store.shop_close_hours || 0),
      parseInt(store.shop_close_minutes || 0)
    );
  }

  printAllSlots = () => {
    return this.state.slots.map((element, index) => {
      const start = this.formatHoursAndMinutes(element.start_hours, element.start_minutes);
      const end = this.formatHoursAndMinutes(element.end_hours, element.end_minutes);

      const timeString = `${start} - ${end}`;
      return (
        <ListGroupItem key={timeString} className="slot-listItem">
          {timeString}
          <Input
            type="number"
            id={timeString}
            ref={this.maxPeopleAllowedRef}
            style={{ width: '20%' }}
            min={0}
            max={1000}
            value={element.maximun_people_allowed}
            onInput={(e) => {
              e.target.value = Math.min(e.target.value, 1000)
            }}
            onChange={async (e) => {
              let newMax = e.target.value;
              let slotsCopy = [...this.state.slots];
              slotsCopy[index].maximun_people_allowed = newMax
              this.setState({
                slots: slotsCopy
              });
            }}
          />
        </ListGroupItem>
      );
    });
  };

  generateTimeSlots = async (
    startTime = this.toTimestamp(this.getStartTime()),
    endTime = this.toTimestamp(this.getEndTime()),
    interval = this.state.store.slot_duration) => {
    const timeslots = [startTime];

    let tempTime = startTime;
    while (tempTime < endTime) {
      tempTime = this.addMinutes(tempTime, interval);
      if (tempTime >= endTime) {
        timeslots.push(endTime);
      } else {
        timeslots.push(tempTime);
      }
    }

    let result = [];
    this.pairwise(timeslots, function (slotStartTime, slotEndTime) {
      result.push({ slotStartTime, slotEndTime })
    })

    let slots = result.map((element) => {
      //09:00
      let start = this.timestampToTime(element.slotStartTime).split(':');
      let end = this.timestampToTime(element.slotEndTime).split(':');

      return {
        "start_hours": parseInt(start[0]),
        "start_minutes": parseInt(start[1]),
        "end_hours": parseInt(end[0]),
        "end_minutes": parseInt(end[1]),
        "maximun_people_allowed": 0,
      }
    });

    this.setState({ slots });
  }

  handleSave = async () => {
    const { storeId, toggleAddSlots } = this.props;
    const { store, slots } = this.state;

    await this.service.updateStore(storeId,
      store.shop_open_hours,
      store.shop_open_minutes,
      store.shop_close_hours,
      store.shop_close_minutes,
      store.slot_duration);
    await this.service.updateSlots(storeId, slots);
    toggleAddSlots();
  }

  render() {
    const { toggleAddSlots, openModal, storeId } = this.props;
    const { error } = this.state;

    const {
      shop_open_hours,
      shop_open_minutes,
      shop_close_hours,
      shop_close_minutes,
      slot_duration,
    } = this.state.store;

    return (
      <Modal isOpen={openModal} toggle={toggleAddSlots}>
        <ModalHeader toggle={toggleAddSlots}>Your Slots</ModalHeader>
        <ModalBody>
          <Alerts
            type={error.type}
            message={error.message}
            onClose={this.closeError}
          />

          <TimeSelectFormGroup
            shop_open_hours={shop_open_hours}
            shop_open_minutes={shop_open_minutes}
            shop_close_hours={shop_close_hours}
            shop_close_minutes={shop_close_minutes}
            onOpenHoursChanged={(hours) => {
              let storeCopy = { ...this.state.store }
              storeCopy.shop_open_hours = hours
              this.setState({ store: storeCopy }, this.generateTimeSlots);
            }}
            onOpenMinsChanged={async (mins) => {
              let storeCopy = { ...this.state.store }
              storeCopy.shop_open_minutes = mins
              this.setState({ store: storeCopy }, this.generateTimeSlots)
            }}
            onCloseHoursChanged={async (hours) => {
              let storeCopy = { ...this.state.store }
              storeCopy.shop_close_hours = hours
              this.setState({ store: storeCopy }, this.generateTimeSlots)
            }}
            onCloseMinsChanged={async (mins) => {
              let storeCopy = { ...this.state.store }
              storeCopy.shop_close_minutes = mins
              this.setState({ store: storeCopy }, this.generateTimeSlots)
            }}
          />

          <SlotDuration
            slotDuration={slot_duration}
            onDurationChange={(duration) => {
              let storeCopy = { ...this.state.store }
              storeCopy.slot_duration = duration
              this.setState({ store: storeCopy }, this.generateTimeSlots)
            }} />

          <p>
            Please add your slots. Enter maximum people allowed in the blank space
            for each slot.
          </p>

          <ListGroup>{this.printAllSlots()}</ListGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="info" outline onClick={toggleAddSlots}>
            Cancel
          </Button>
          <Button color="info" outline onClick={this.handleSave}>
            Save
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
