import React, { useState,useEffect } from 'react';
import { Form, FormGroup, Input, Button } from 'reactstrap';
import {useHistory} from 'react-router-dom';
import axios from 'axios';

  import { saveState, loadState } from '../../helpers/LocalStorage';

export default function LoginForm ({toggleLogin}){


  const [formData,setFormData] = useState({email:'',password:''});
  const history = useHistory();

  useEffect(()=>{
    const token =
    loadState('userAuthenticationDetails') &&
    loadState('userAuthenticationDetails').id;
    if (token) {
      history.push('/');
    }
  },[])
 
  function onLoginClick(e){
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
                history.push('/');
              } else if (response.data.isStoreOwner && !response.data.storeId) {
                history.push('/onboard');
              } else {
                history.push('/owner');
              }
            });
        })
        .catch(err => {
          alert('Error in logging user');
        });
    }
  }


  function handleChange (e) {
    var obj = { ...formData };
    obj[e.target.name] = e.target.value;
    setFormData(obj);
  };

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
