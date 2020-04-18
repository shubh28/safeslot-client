import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Button,
  ModalBody,
  Modal,
  ModalHeader,
  ModalFooter,
  ListGroup,
  ListGroupItem,
  Input
} from 'reactstrap';

import Alerts from '../Alerts';

export default function AddSlots({
  toggleAddSlots,
  user,
  openModal,
  ...others
}) {
  let maxPeopleAllowedRef = useRef(null);
  const [allSlots, setAllSlots] = useState([]);
  const [error, setError] = useState({});
  const [selectedTime, setSelectedTime] = useState({
    start_minutes: 0,
    start_hours: 0,
    end_hours: 0,
    end_minutes: 0,
    maximun_people_allowed: 5
  });

  useEffect(() => {
    getSlots();
  }, []);

  const showError = (type, message) => setError({ type, message });
  const closeError = () => setError({ type: '', message: '' });

  const getSlots = () => {
    const storeId = user && user.storeId;
    const filter = { where: { storeId: storeId } };
    axios
      .get(
        `https://safeslot-backend.herokuapp.com/api/stores_slots?filter=${JSON.stringify(
          filter
        )}`
      )
      .then(res => {
        setAllSlots(res.data);
      })
      .catch(err => {
        showError('danger', 'Error in fetching all slots');
      });
  };

  const deleteSlots = slotId => {
    closeError();
    axios
      .delete(
        `https://safeslot-backend.herokuapp.com/api/stores_slots/${slotId}`
      )
      .then(res => {
        getSlots();
      })
      .catch(err => {
        showError('danger', 'Error in deleting slot');
      });
  };

  const addSlots = timeString => {
    closeError();
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

    axios
      .post(`https://safeslot-backend.herokuapp.com/api/stores_slots`, {
        ...body
      })
      .then(res => {
        getSlots();
      })
      .catch(err => {
        showError('danger', 'Error in adding slot');
      });
  };

  const printAllSlots = () => {
    const store = user.stores || {};
    const startHour = parseInt(store.shop_open_hours || 0);
    const endHour = parseInt(store.shop_close_hours || 23);
    const startMinutes = parseInt(store.shop_open_minutes || 0);
    const endMinutes = parseInt(store.shop_close_hours || 0);
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
              ref={maxPeopleAllowedRef}
              style={{ width: '20%' }}
              defaultValue="0"
            />
            <Button color="link" onClick={addSlots.bind(null, timeString)}>
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

  return (
    <Modal isOpen={openModal} toggle={toggleAddSlots}>
      <ModalHeader toggle={toggleAddSlots}>Your Slots</ModalHeader>
      <ModalBody>
        <Alerts
          type={error.type}
          message={error.message}
          onClose={closeError}
        />

        <p>
          Please add your slots. Enter maximun people allowed in the blank space
          for each slot.
        </p>

        <ListGroup>{printAllSlots()}</ListGroup>

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
                    deleteSlots(slot.id);
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
