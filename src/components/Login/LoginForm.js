import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, FormGroup, Input, Button } from 'reactstrap';
import { useHistory, useLocation } from 'react-router-dom';
import Alerts from '../Alerts';
import { loadState } from '../../helpers/LocalStorage';
import useLogin from '../../hooks/useLogin';

export default function LoginForm({ toggleLogin }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState({ type: '', message: '' });
  const history = useHistory();

  const { login, loading } = useLogin(message =>
    setError({ type: 'danger', message })
  );

  useEffect(() => {
    const token =
      loadState('userAuthenticationDetails') &&
      loadState('userAuthenticationDetails').id;
    if (token) {
      history.push('/');
    }
  }, []);

  const showError = (type, message) => setError({ type, message });
  const closeError = () => setError({ type: '', message: '' });

  function onLoginClick(e) {
    e.preventDefault();
    const { email, password } = formData;
    if (email === '' || password === '') {
      showError('danger', 'Please enter email and password');
    } else {
      login(email, password);
    }
  }

  function handleChange(e) {
    setError({ type: '', message: '' });
    setFormData(
      Object.assign({ ...formData }, { [e.target.name]: e.target.value })
    );
  }

  return (
    <Form>
      <Alerts type={error.type} message={error.message} onClose={closeError} />

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
        <Link to="/signup">
          Sign Up
        </Link>
      </p>
      <Button
        type="submit"
        color="info"
        disabled={loading}
        onClick={onLoginClick}
      >
        {loading ? 'Logging In' : 'Login'}
      </Button>
    </Form>
  );
}
