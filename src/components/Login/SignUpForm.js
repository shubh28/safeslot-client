import React, { useState } from 'react';
import { Form, FormGroup, Input, Button } from 'reactstrap';
import axios from 'axios';
import { API_URL } from '../../common/consts';

export default function SignUpForm({ toggleLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    isStoreOwner: false
  });

  function onSignupClick(e) {
    e.preventDefault();
    const { email, phone, name, password, isStoreOwner } = formData;
    if (email === '' || password === '' || phone === '' || name === '') {
      alert('All fields are mandatory. Please try again');
    } else {
      // make user sign up
      axios
        .post(`${API_URL}/users`, {
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
          alert('Error in signing you up');
        });
    }
  }

  function handleChange(e) {
    var obj = { ...formData };
    obj[e.target.name] = e.target.value;
    if (e.target.name === 'isStoreOwner') {
      if (e.target.value == 'false') {
        obj['isStoreOwner'] = true;
      } else {
        obj['isStoreOwner'] = false;
      }
    }
    console.log(obj);
    setFormData(obj);
  }

  const { email, phone, name, password, isStoreOwner } = formData;
  return (
    <Form>
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
          value={isStoreOwner}
          checked={isStoreOwner}
          onChange={handleChange}
          name="isStoreOwner"
        />{' '}
        Are you a store owner?
      </FormGroup>

      <p>
        Alrady have account?{' '}
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
