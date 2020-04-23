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
      allSlots: [],
      slot_duration: 10,
      store: {}
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
      const slotsRes = await this.service.fetchSlots(storeId);
      const slots = slotsRes.data;
      this.setState({ allSlots: slots });

    } catch (error) {
      this.showError('danger', 'Error in fetching all slots');
    }
  };

  deleteSlots = async (slotId) => {
    this.closeError();
    try {
      await this.service.deleteSlots(slotId);
      this.getSlots();
    } catch (error) {
      this.showError('danger', 'Error in deleting slot');
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
    const store = this.state.store;
    const startTime = this.toTimestamp(this.getStartTime());
    const endTime = this.toTimestamp(this.getEndTime());
    const interval = parseInt(store.slot_duration || 10);
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

    return result.map((element) => {
      const timeString = `${this.timestampToTime(element.slotStartTime)} - ${this.timestampToTime(element.slotEndTime)}`;
      return (
        <ListGroupItem key={timeString} className="slot-listItem">
          {timeString}
          <Input
            type="number"
            id={timeString}
            ref={this.maxPeopleAllowedRef}
            style={{ width: '20%' }}
            defaultValue="0"
            min={0}
            max={1000}
            onInput={(e) => {
              e.target.value = Math.min(e.target.value, 1000)
            }}
          />
        </ListGroupItem>
      );
    });
  };

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
            onOpenHoursChanged={async (hours) => {
              this.setState({ store: await this.service.updateShopOpenHours(storeId, hours) });
            }}
            onOpenMinsChanged={async (mins) => {
              this.setState({ store: await this.service.updateShopOpenMins(storeId, mins) });
            }}
            onCloseHoursChanged={async (hours) => {
              this.setState({ store: await this.service.updateShopCloseHours(storeId, hours) });
            }}
            onCloseMinsChanged={async (mins) => {
              this.setState({ store: await this.service.updateShopCloseMins(storeId, mins) });
            }}
          />

          <SlotDuration
            slotDuration={slot_duration}
            onDurationChange={async (duration) => {
              this.setState({ store: await this.service.updateSlotDuration(storeId, duration) });
            }} />

          <p>
            Please add your slots. Enter maximum people allowed in the blank space
            for each slot.
          </p>

          <ListGroup>{this.printAllSlots()}</ListGroup>
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
