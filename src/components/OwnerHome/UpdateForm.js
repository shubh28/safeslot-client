import React, { Component } from 'react';
import {
  Button,
  ModalBody,
  Modal,
  ModalHeader,
  ModalFooter,
  Form,
  FormGroup,
  Input
} from 'reactstrap';
import axios from 'axios';
import { createHours, createMinutes } from '../../helpers/index';
import Alerts from '../Alerts';

export default class UpdateForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: {},
      shop_open_hours: 0,
      shop_close_hours: 0,
      shop_open_minutes: 0,
      shop_close_minutes: 0
    };
  }

  showError = (type, message) => {
    this.setState(
      Object.assign({ ...this.state }, { error: { type, message } })
    );
  };
  closeError = () => {
    this.setState(Object.assign({ ...this.state }, { error: {} }));
  };
  
  handleOnChange = e => {
    const key = e.target.name;
    this.setState(
      Object.assign({ ...this.state }, { [key]: e.target.value, error: {} })
    );
  };

  updateStoreDetails = () => {
    const { shop_open_hours, shop_close_hours, shop_open_minutes, shop_close_minutes } = this.state;

    if (shop_open_hours >= shop_close_hours){
      this.showError('danger', 'Both fields are required.');
      return;
    }

    const {id, storeId} = this.props.user
    const body = { shop_open_hours, shop_close_hours, shop_open_minutes, shop_close_minutes, updatedBy: id };
    axios.patch(
      `https://safeslot-backend.herokuapp.com/api/stores/${storeId}`, { ...body }
    ).then(() => {
      this.props.toggleUpdateDetails();
      this.props.showSuccess('success', 'Store Details Updated');
    }).catch(err => {
      this.showError('danger', 'Some error occurred');
    });
  }

  render() {
    const { toggleUpdateDetails, user, openModal } = this.props;
    const { shop_open_hours, shop_close_hours, shop_open_minutes, shop_close_minutes } = this.state;
    return (
      <Modal isOpen={openModal} toggle={toggleUpdateDetails}>
        <ModalHeader>
          Update Store Details
        </ModalHeader>
        <ModalBody>
          <Alerts
            type={this.state.error.type}
            message={this.state.error.message}
            onClose={this.closeError}
          />
          <Form>
            <FormGroup
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
            <label style={{ width: '50%' }}>Shop Opening Time</label>
              <Input
                type="select"
                style={{ width: '20%' }}
                value={shop_open_hours}
                name="shop_open_hours"
                onChange={this.handleOnChange}
              >
                {createHours('start', shop_open_hours, shop_close_hours)}
              </Input>
              &nbsp;:&nbsp;
              <Input
                type="select"
                style={{ width: '20%' }}
                value={shop_open_minutes}
                name="shop_open_minutes"
                onChange={this.handleOnChange}
              >
                {createMinutes('start')}
              </Input>
            </FormGroup>
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
                {createHours('end', shop_open_hours, shop_close_hours)}
              </Input>
              &nbsp;:&nbsp;
              <Input
                type="select"
                style={{ width: '20%' }}
                value={shop_close_minutes}
                name="shop_close_minutes"
                onChange={this.handleOnChange}
              >
                {createMinutes('end')}
              </Input>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="info" outline onClick={this.updateStoreDetails}>
            Update
          </Button>
          <Button color="info" outline onClick={toggleUpdateDetails}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
