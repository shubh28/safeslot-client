import React, { useState, useEffect } from 'react';
import { Form, FormGroup, Input, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import useLogin from '../../hooks/useLogin';

import Alerts from '../Alerts';

export default function SignUpForm({ isStorePage }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    isStoreOwner: false
  });
  const [error, setError] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const { loading: loggingIn, login } = useLogin(message =>
    setError({ type: 'danger', message })
  );

  const showError = (type, message) => setError({ type, message });
  const closeError = () => setError({ type: '', message: '' });

  function onSignupClick(e) {
    e.preventDefault();
    const { email, phone, name, password, isStoreOwner } = formData;
    if (email === '' || password === '' || phone === '' || name === '') {
      return showError('danger', 'All fields are mandatory. Please try again');
    }

    // make user sign up
    setLoading(true);
    axios
      .post('https://safeslot-backend.herokuapp.com/api/users', {
        email: email.toLowerCase(),
        password,
        name,
        phone,
        isStoreOwner
      })
      .then(res => {
        login(email, password);
      })
      .catch(res => {
        if (
          res?.response?.data?.error?.details?.messages?.email?.length &&
          res.response.data.error.details.messages.email[0] ===
            'Email already exists'
        ) {
          showError(
            'danger',
            'Email address already exists, please login instead'
          );
        } else {
          showError('danger', 'Error ocurred while signing you up');
        }
      })
      .finally(() => {
        setLoading(false);
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
          checked={isStoreOwner || isStorePage}
          onChange={handleChange}
          name="isStoreOwner"
          style={{
            width: "20px",
            height: "20px",
            position: "relative",
            marginLeft: "10px"}}
        />{' '}
        <span style={{fontSize: '1.8rem'}}>Are you a store owner?</span>
      </FormGroup>

      <p>
        Already have account?{' '}
        <Link to="/login">
          Login
        </Link>
      </p>
      <Button
        type="submit"
        color="info"
        disabled={loading || loggingIn}
        onClick={onSignupClick}
      >
        {loading || loggingIn ? 'Signing Up' : 'SignUp'}
      </Button>
    </Form>
  );
}
