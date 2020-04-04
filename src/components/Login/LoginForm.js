import React, { useState, useEffect } from 'react';
import { Form, FormGroup, Input, Button } from 'reactstrap';
import { useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';

import { saveState, loadState } from '../../helpers/LocalStorage';
import { useLocationAndStoreContext } from '../../contexts/location-and-store-context';

export default function LoginForm({ toggleLogin }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const history = useHistory();
  const location = useLocation();

  const params = location ? new URLSearchParams(location.search) : undefined;

  const referrer = params ? params.get('ref') : undefined;
  const { storeSlotId } = useLocationAndStoreContext();

  useEffect(() => {
    const token =
      loadState('userAuthenticationDetails') &&
      loadState('userAuthenticationDetails').id;
    if (token) {
      history.push('/');
    }
  }, []);

  function onLoginClick(e) {
    e.preventDefault();
    const { email, password } = formData;
    if (email === '' || password === '') {
      alert('Please enter email and password');
    } else {
      axios
        .post('https://safeslot-backend.herokuapp.com/api/users/login', {
          email,
          password
        })
        .then(res => {
          saveState('userAuthenticationDetails', res.data);
          axios
            .get(
              `https://safeslot-backend.herokuapp.com/api/users/${res.data.userId}`
            )
            .then(response => {
              saveState('userInfo', response.data);
              if (!response.data.isStoreOwner) {
                if (referrer === 'stores') {
                  history.replace('/stores');
                } else if (referrer === 'refer-store') {
                  history.replace('/refer');
                } else {
                  history.replace('/');
                }
              } else if (response.data.isStoreOwner && !response.data.storeId) {
                history.push('/onboard');
              } else {
                history.push('/owners');
              }
            });
        })
        .catch(err => {
          alert('Error in logging user');
        });
    }
  }

  function handleChange(e) {
    var obj = { ...formData };
    obj[e.target.name] = e.target.value;
    setFormData(obj);
  }

  return (
    <Form>
      <FormGroup>
        <Input
          type="email"
          value={formData.email}
          onChange={handleChange}
          name="email"
          id="exampleEmail"
          placeholder="Enter Email"
        />
      </FormGroup>
      <FormGroup>
        <Input
          type="password"
          value={formData.password}
          onChange={handleChange}
          name="password"
          id="examplePassword"
          placeholder="Enter Password"
        />
      </FormGroup>
      <p>
        Don't have account?{' '}
        <a href="#" onClick={toggleLogin}>
          Sign Up
        </a>
      </p>
      <Button type="submit" color="info" onClick={onLoginClick}>
        Login
      </Button>
    </Form>
  );
}
