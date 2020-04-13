import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button,
  ModalBody,
  Modal,
  ModalHeader,
  ModalFooter,
  ListGroup,
  ListGroupItem,
  Form,
  Input,
  FormGroup,
  Label
} from 'reactstrap';

import Alerts from '../Alerts';

export default function AddSlots({toggleAddSlots, user, openModal, ...others}) {

	const [allSlots, setAllSlots] = useState([]);
	const [error, setError] = useState({});
	const [selectedTime, setSelectedTime] = useState({start_minutes: 0, start_hours: 0, end_hours: 0, end_minutes: 0, maximun_people_allowed: 5})

	useEffect(() => {
		getSlots();
	}, [])

	const showError = (type, message) => setError({ type, message });
	const closeError = () => setError({ type: '', message: '' });
	
	const getSlots = () => {
		const storeId = user && user.storeId;
		const filter = {where: { storeId: storeId }};
		axios
	      .get(`https://safeslot-backend.herokuapp.com/api/stores_slots?filter=${JSON.stringify(filter)}`)
	      .then(res => {
	      	setAllSlots(res.data);
	      })
	      .catch(err => {
	        showError('danger', 'Error in fetching all slots');
	      });
	}
	
	const deleteSlots = (slotId) => {
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
	}

	const createHours = (type) => {
		const options = [];
		if (type === "start") {
			const endTime = selectedTime.end_hours !== 0 ? parseInt(selectedTime.end_hours) : 23;
			for(let i=0; i<=endTime; i++){
				options.push(
					<option key={i} value={i.toString().padStart(2, '0')}>
						{i.toString().padStart(2, '0')}
					</option>
				);
			}

		} else {
			const startTime = selectedTime.start_hours !== 0 ? parseInt(selectedTime.start_hours) : 0;
			for(let i=startTime; i<=23; i++){
				options.push(
					<option key={i} value={i.toString().padStart(2, '0')}>
						{i.toString().padStart(2, '0')}
					</option>
				);
			}
		}
		return options;
	}

	const createMinutes = (type) => {
		const options = [];
		if (type === "start") {
			const endTime = selectedTime.end_minutes !== 0 ? parseInt(selectedTime.end_minutes) : 55;
			for(let i=0; i<=endTime; i+=5){
				options.push(
					<option key={i} value={i.toString().padStart(2, '0')}>
						{i.toString().padStart(2, '0')}
					</option>
				);
			}
		} else {
			const startTime = selectedTime.start_minutes !== 0 ? parseInt(selectedTime.start_minutes) : 0;
			for(let i=startTime; i<=55; i+=5){
				options.push(
					<option key={i} value={i.toString().padStart(2, '0')}>
						{i.toString().padStart(2, '0')}
					</option>
				);
			}

		}
		return options;
	}

	const handleTimeSelection = (e) => {
		const obj = {...selectedTime};
		obj[e.target.name] = e.target.value;
		if (e.target.name === "start_hours") {
			obj["end_hours"] = e.target.value;
		}
		if (e.target.name === "end_hours") {
			obj["start_hours"] = e.target.value;
		}
		if (e.target.name === "start_minutes") {
			obj["end_minutes"] = e.target.value;
		}
		// if (e.target.name === "end_minutes" && selectedTime.start_minutes == 0 ) {
		// 	obj["start_minutes"] = e.target.value;
		// }
		setSelectedTime(obj);
	}

	const addSlots = (e) => {
		e.preventDefault();
	    closeError();
	    const storeId = user && user.storeId;
	    const body = {...selectedTime};
	    body.storeId = storeId;

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
	
	return (
	  <Modal isOpen={openModal} toggle={toggleAddSlots}>
        <ModalHeader toggle={toggleAddSlots}>Your Slots</ModalHeader>
        <ModalBody>
          <Alerts
            type={error.type}
            message={error.message}
            onClose={closeError}
          />

          <p>Please add/remove your slots.</p>
          <ListGroup>
            {allSlots.map(slot => {
              return (
                <ListGroupItem key={slot.id} className="slot-listItem">
                    {slot.start_hours && slot.start_hours.toString().padStart(2, '0')}:{slot.start_minutes && slot.start_minutes.toString().padStart(2, '0')} 
                    &nbsp;-&nbsp; 
                    {slot.end_hours && slot.end_hours.toString().padStart(2, '0') }:{slot.end_minutes && slot.end_minutes.toString().padStart(2, '0') }
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

		  <Form inline className="addSlotsForm" onSubmit={addSlots}>
		  	<FormGroup>
		  		<Label>Start Time</Label>
				<Input type="select" value={selectedTime.start_hours} name="start_hours" onChange={handleTimeSelection}>
					{createHours("start")}
				</Input>
				&nbsp;:&nbsp;
				<Input type="select" value={selectedTime.start_minutes} name="start_minutes" onChange={handleTimeSelection}>
					{createMinutes("start")}
				</Input>		  		
		  	</FormGroup>
		  	<FormGroup>
		  		<Label>End Time</Label>
				<Input type="select" value={selectedTime.end_hours} name="end_hours" onChange={handleTimeSelection}>
					{createHours("end")}
				</Input>
				&nbsp;:&nbsp;
				<Input type="select" value={selectedTime.end_minutes} name="end_minutes" onChange={handleTimeSelection}>
					{createMinutes("end")}
				</Input>		  		
		  	</FormGroup>
			<FormGroup>
				<Label>People Allowed(per slot)</Label>
				<Input type="number" value={selectedTime.maximun_people_allowed} name="maximun_people_allowed" onChange={handleTimeSelection} />
				<Button color="info" type="submit">Add Slot</Button>				
			</FormGroup>
		  </Form>

        </ModalBody>
        <ModalFooter>
          <Button color="info" outline onClick={toggleAddSlots}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
	)
}