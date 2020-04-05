import React, { useState } from 'react';
import { Form, FormGroup, Input, Button } from 'reactstrap';
import axios from 'axios';

import Alerts from '../Alerts';

export default function SignUpForm({ toggleLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    isStoreOwner: false
  });
  const [error, setError] = useState({ type: '', message: '' });

  const showError = (type, message) => setError({ type, message });
  const closeError = () => setError({ type: '', message: '' });

  function onSignupClick(e) {
    e.preventDefault();
    const { email, phone, name, password, isStoreOwner } = formData;
    if (email === '' || password === '' || phone === '' || name === '') {
      return showError('danger', 'All fields are mandatory. Please try again');
    }

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
        toggleLogin();
      })
      .catch(err => {
        showError('danger', 'Error in signing you up');
      });
  }

  function handleChange(e) {
    setFormData(
      Object.assign(
        { ...formData },
        {
          [e.target.name]:
            e.target.name === 'isStoreOwner'
              ? e.target.checked
              : e.target.value,
          error: {}
        }
      )
    );
  }

  const { email, phone, name, password, isStoreOwner } = formData;
  return (
    <Form>
      <Alerts type={error.type} message={error.message} onClose={closeError} />

      <FormGroup>
        <Input
          type="text"
          value={name}
          required
          onChange={handleChange}
          name="name"
          placeholder="Enter name"
        />
      </FormGroup>
      <FormGroup>
        <Input
          type="email"
          value={email}
          required
          onChange={handleChange}
          name="email"
          placeholder="Enter Email"
        />
      </FormGroup>
      <FormGroup>
        <Input
          type="number"
          value={phone}
          required
          onChange={handleChange}
          name="phone"
          placeholder="Enter Contact Number"
        />
      </FormGroup>
      <FormGroup>
        <Input
          type="password"
          value={password}
          required
          onChange={handleChange}
          name="password"
          placeholder="Enter Password"
        />
      </FormGroup>
      <FormGroup>
        <Input
          type="checkbox"
          checked={isStoreOwner}
          onChange={handleChange}
          name="isStoreOwner"
        />{' '}
        Are you a store owner?
      </FormGroup>

      <p>
        Already have account?{' '}
        <a href="#" onClick={toggleLogin}>
          Login
        </a>
      </p>
      <Button type="submit" color="info" onClick={onSignupClick}>
        SignUp
      </Button>
    </Form>
  );
}
