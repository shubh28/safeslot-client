import axios from 'axios';
import {
  API_URL,
  USER_LOGIN,
  GET_USER,
  USER_LOGOUT,
  GET_PROFILE_INIT,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_ERROR,
  CREATE_PROFILE_INIT,
  CREATE_PROFILE_SUCCESS,
  CREATE_PROFILE_ERROR, GET_MENTORS_INIT, GET_MENTORS_SUCCESS, GET_MENTORS_ERROR
} from "../consts";

export const createProfile = (profile) => {
  return {
    fetchConfig: {
      host: "http://localhost:7000",
      path: "/api/v1/profile",
      method: "POST",
      body: profile,
      success: createProfileSuccess,
      failure: createProfileError,
      init: createProfileStart
    }
  }
};

function createProfileError(error) {
  return {
    type: CREATE_PROFILE_ERROR,
    data: error
  }
}

function createProfileSuccess(data) {

  return (dispatch, getState) => {
    dispatch({
      type: CREATE_PROFILE_SUCCESS,
      data
    });
    const localState = getState('userAuthenticationDetails');
    try {

    } catch (e) {
      console.log(e);
    }
    document.location.href = "/profile";
  };

}

function createProfileStart() {
  return {
    type: CREATE_PROFILE_INIT
  }
}

export const getUserProfileForId = (id) => {
  return {
    fetchConfig: {
      host: "http://localhost:7000",
      path: `/api/v1/user/${id}`,
      method: "GET",
      success: getProfileSuccess,
      failure: getProfileError,
      init: getProfileStart
    }
  }
};

export const getUserProfile = () => {
  return {
    fetchConfig: {
      host: "http://localhost:7000",
      path: "/api/v1/profile",
      method: "GET",
      success: getProfileSuccess,
      failure: getProfileError,
      init: getProfileStart
    }
  }
};

function getProfileSuccess(data) {
  return {
    type: GET_PROFILE_SUCCESS,
    data
  }
}

function getProfileError(error) {
  return {
    type: GET_PROFILE_ERROR,
    data: error
  }
}

function getProfileStart() {
  return {
    type: GET_PROFILE_INIT
  }
}

function siginSuccess(data) {
  return {
    type: GET_PROFILE_SUCCESS,
    data
  }
}

function signInFailure(error) {
  return {
    type: GET_PROFILE_ERROR,
    data: error
  }
}

export const getMentors = () => {
  return{
    type: "FETCH_MENTORS",
    fetchConfig: {
      host: "http://localhost:7000",
      path: "/api/v1/mentors",
      method: "GET",
      success: fetchMentorsSuccess,
      failure: fetchMentorsFail,
      init: fetchMentorsStart
    }
  };
};

function fetchMentorsStart() {
  return {
    type: GET_MENTORS_INIT
  }
}

function fetchMentorsSuccess(data) {
  return {
    type: GET_MENTORS_SUCCESS,
    data
  }
}

function fetchMentorsFail(error) {
  return {
    type: GET_MENTORS_ERROR,
    error
  }
}

function emitLogoutData() {
  return {
    type: USER_LOGOUT
  }
}

export const logout = () => dispatch => {
  dispatch(emitLogoutData());
  window.location.href = '/';
};
