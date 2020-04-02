import React, { PureComponent } from 'react';
import { Form, FormGroup, Input, Button } from 'reactstrap';
import axios from 'axios';

import { saveState, loadState } from '../../helpers/LocalStorage';

export default class SignUpForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      phone: '',
      password: '',
      isStoreOwner: false
    };
  }

  onLoginClick = e => {
    e.preventDefault();
    const { email, phone, name, password, isStoreOwner } = this.state;
    if (email === '' || password === '' || phone === '' || name === '') {
      alert('All fields are mandatory. Please try again');
    } else {
      // make user sign up
      axios
        .post('https://safeslot-backend.herokuapp.com/api/users', {
          email,
          password,
          name,
          phone,
          isStoreOwner
        })
        .then(res => {
          this.props.toggleLogin();
        })
        .catch(err => {
          alert('Error in signing you up');
        });
    }
  };

  handleChange = e => {
    var obj = { ...this.state };
    obj[e.target.name] = e.target.value;
    if (e.target.name === 'isStoreOwner') {
      if (e.target.value == 'false') {
        obj['isStoreOwner'] = true;
      } else {
        obj['isStoreOwner'] = false;
      }
    }
    console.log(obj);
    this.setState(obj);
  };

  render() {
    const { email, phone, name, password, isStoreOwner } = this.state;
    return (
      <Form>
        <FormGroup>
          <Input
            type="text"
            value={name}
            required
            onChange={this.handleChange}
            name="name"
            placeholder="Enter name"
          />
        </FormGroup>
        <FormGroup>
          <Input
            type="email"
            value={email}
            required
            onChange={this.handleChange}
            name="email"
            placeholder="Enter Email"
          />
        </FormGroup>
        <FormGroup>
          <Input
            type="number"
            value={phone}
            required
            onChange={this.handleChange}
            name="phone"
            placeholder="Enter Contact Number"
          />
        </FormGroup>
        <FormGroup>
          <Input
            type="password"
            value={password}
            required
            onChange={this.handleChange}
            name="password"
            placeholder="Enter Password"
          />
        </FormGroup>
        <FormGroup>
          <Input
            type="checkbox"
            value={isStoreOwner}
            checked={isStoreOwner}
            onChange={this.handleChange}
            name="isStoreOwner"
          />{' '}
          Are you a store owner?
        </FormGroup>

        <p>
          Alrady have account?{' '}
          <a href="#" onClick={this.props.toggleLogin}>
            Login
          </a>
        </p>
        <Button type="submit" color="info" onClick={this.onLoginClick}>
          SignUp
        </Button>
      </Form>
    );
  }
}
