import React, { Component } from 'react';
import AddSlotService from './addSlotService';
import {
  Button,
  FormGroup,
  Input,
  ModalBody,
  Modal,
  ModalHeader,
  ModalFooter,
  Label,
  ListGroup,
  ListGroupItem,
} from 'reactstrap';
import Alerts from '../Alerts';
import TimeSelectFormGroup from '../common/TimeSelectFormGroup';
import SlotDuration from '../common/SlotDuration';
import {
  formatHoursAndMinutes,
  generateTimeSlots
} from '../../helpers/timeSlotHelpers';

export default class AddSlots extends Component {

  service = new AddSlotService;

  constructor(props) {
    super(props)
    this.state = {
      error: {},
      store: {},
      slots: [],
      defaultSlotCapacity: 5,
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
  }
  getStartTime = () => {
    const store = this.state.store;
    return formatHoursAndMinutes(
      parseInt(store.shop_open_hours || 0),
      parseInt(store.shop_open_minutes || 0)
    );
  }

  getEndTime = () => {
    const store = this.state.store;
    return formatHoursAndMinutes(
      parseInt(store.shop_close_hours || 0),
      parseInt(store.shop_close_minutes || 0)
    );
  }

  printAllSlots = () => {
    return this.state.slots.map((element, index) => {
      const start = formatHoursAndMinutes(element.start_hours, element.start_minutes);
      const end = formatHoursAndMinutes(element.end_hours, element.end_minutes);

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

  generateSlots = (
    startTime = this.getStartTime(),
    endTime = this.getEndTime(),
    interval = this.state.store.slot_duration,
    defaultCapacity = this.state.defaultSlotCapacity) => {
    const slots = generateTimeSlots({ startTime, endTime, interval, defaultCapacity })

    this.setState({ slots });
  };

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
  };

  render() {
    const { toggleAddSlots, openModal } = this.props;
    const { error, defaultSlotCapacity } = this.state;

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
              this.setState({ store: storeCopy }, this.generateSlots);
            }}
            onOpenMinsChanged={async (mins) => {
              let storeCopy = { ...this.state.store }
              storeCopy.shop_open_minutes = mins
              this.setState({ store: storeCopy }, this.generateSlots)
            }}
            onCloseHoursChanged={async (hours) => {
              let storeCopy = { ...this.state.store }
              storeCopy.shop_close_hours = hours
              this.setState({ store: storeCopy }, this.generateSlots)
            }}
            onCloseMinsChanged={async (mins) => {
              let storeCopy = { ...this.state.store }
              storeCopy.shop_close_minutes = mins
              this.setState({ store: storeCopy }, this.generateSlots)
            }}
          />

          <SlotDuration
            slotDuration={slot_duration}
            onDurationChange={(duration) => {
              let storeCopy = { ...this.state.store }
              storeCopy.slot_duration = duration
              this.setState({ store: storeCopy }, this.generateSlots)
            }} />

          <FormGroup>
            <Label for="exampleEmail">Default Slot Capacity</Label>
            <Input type="number" name="defaultSlotCapacity" value={defaultSlotCapacity} onChange={(e) => {
              this.setState({
                defaultSlotCapacity: e.target.value
              });

            }} />
          </FormGroup>

          <p>
            Please add your slots. Enter maximum people allowed in the space
            for each slot.
          </p>

          <ListGroup>{this.printAllSlots()}</ListGroup>
        </ModalBody>
        <ModalFooter className="modal-footer">
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
