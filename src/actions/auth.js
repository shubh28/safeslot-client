import * as Constants from "../consts";
import {saveState} from "../helpers/LocalStorage";

export const login = (email, password) => {
  return{
    fetchConfig: {
      host: "http://localhost:7000",
      path: "/api/v1/login",
      method: "POST",
      body: {
        email,
        password
      },
      success: siginSuccess,
      failure: signInFailure,
      init: signinStart
    }
  }
};

function signinStart() {
  return {
    type: Constants.SIGN_IN_INIT
  }
}

function signInFailure(error) {
  return {
    type: Constants.SIGN_IN_ERROR,
    data: error
  }
}

export const signUp = (email, password, confirmPassword)  => {
  return{
    fetchConfig: {
      host: "http://localhost:7000",
      path: "/api/v1/signup",
      method: "POST",
      body: {
        email,
        password,
        confirmPassword
      },
      success: siginSuccess,
      failure: signUpFailure,
      init: signUpStart
    }
  }
};

function siginSuccess(data) {

  return (dispatch, getState) => {
    saveState('userAuthenticationDetails', data);
    dispatch({
      type: Constants.SIGN_IN_SUCCESS,
      data
    });
    if (data.isProfileCompleted) {
      document.location.href = '/profile';
    } else {
      document.location.href = '/create';
    }
  };
}

function signUpStart() {
  return {
    type: Constants.SIGN_UP_INIT
  }
}

function signUpFailure(error) {
  return {
    type: Constants.SIGN_UP_SUCCESS,
    data: error
  }
}

function sigUpSuccess(data) {
  return {
    type: Constants.SIGN_UP_ERROR,
    data
  }
}
