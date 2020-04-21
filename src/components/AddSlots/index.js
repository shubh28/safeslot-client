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
import TimeSelectFormGroup from '../common/TimeSelectFormGroup'


export default class AddSlots extends Component {

  service = new AddSlotService;

  constructor(props) {
    super(props)
    this.state = {
      error: {},
      allSlots: [],
      slot_duration: 15,
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

  addSlots = async (timeString) => {
    this.closeError();
    const storeId = this.props.storeId;
    const timeArray = timeString.split(' - ');
    const startTime = timeArray && timeArray[0].split(':');
    const endTime = timeArray && timeArray[1].split(':');
    const startHours = startTime && startTime[0];
    const startMinutes = startTime && startTime[1];
    const endHours = endTime && endTime[0];
    const endMinutes = endTime && endTime[1];

    const body = {
      start_minutes: startMinutes,
      start_hours: startHours,
      end_hours: endHours,
      end_minutes: endMinutes,
      maximun_people_allowed: document.getElementById(timeString).value || 5,
      storeId: storeId
    };

    try {
      await this.service.addSlots(body);
      this.getSlots();
    } catch (error) {
      this.showError('danger', 'Error in adding slot');
    }
  };

  printAllSlots = () => {
    const store = this.state.store;
    const startHour = parseInt(store.shop_open_hours || 0);
    const endHour = parseInt(store.shop_close_hours || 0);
    const slotDuration = parseInt(store.slot_duration || 15);

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

  render() {
    const { toggleAddSlots, openModal, storeId } = this.props;
    const { allSlots, error } = this.state;

    const {
      shop_open_hours,
      shop_open_minutes,
      shop_close_hours,
      shop_close_minutes,
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
