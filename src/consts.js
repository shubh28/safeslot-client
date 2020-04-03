// Types for action types
// export const API_URL = "http://theanswerme.com:8000/api/v1";
export const API_URL = 'http://localhost:7000/api';
export const DEFAULT_LOCATION = {
    latitude: 28.63298099999998,
    longitude: 77.21928800000002
  };
export const SIGN_IN_INIT = 'SIGN_IN_INIT';
export const SIGN_IN_SUCCESS = 'SIGIN_IN_SUCCESS';
export const SIGN_IN_ERROR = 'SIGIN_IN_ERROR';
export const SIGN_UP_INIT = 'SIGN_UP_INIT';
export const SIGN_UP_SUCCESS = 'SIGIN_UP_SUCCESS';
export const SIGN_UP_ERROR = 'SIGIN_UP_ERROR';
export const GET_PROFILE_INIT = 'GET_PROFILE_INIT';
export const GET_PROFILE_SUCCESS = 'GET_PROFILE_SUCCESS';
export const GET_PROFILE_ERROR = 'GET_PROFILE_ERROR';
export const CREATE_PROFILE_INIT = 'CREATE_PROFILE_INIT';
export const CREATE_PROFILE_SUCCESS = 'CREATE_PROFILE_SUCCESS';
export const CREATE_PROFILE_ERROR = 'CREATE_PROFILE_ERROR';
export const GET_MENTORS_ERROR = 'GET_MENTORS_ERROR';
export const GET_MENTORS_INIT = 'GET_MENTORS_INIT';
export const GET_MENTORS_SUCCESS = 'GET_MENTORS_SUCCESS';

export const USER_LOGIN = 'USER_LOGIN';
export const USER_LOGOUT = 'USER_LOGOUT';
export const GET_USER = 'GET_USER';

export const GET_ALL_POSTS = 'GET_ALL_POSTS';
export const GET_POST_DETAIL = 'GET_POST_DETAIL';

export const GET_SIMILAR_QUESTIONS = 'GET_SIMILAR_QUESTIONS';

export const SHOW_NOTIFICATION = 'SHOW_NOTIFICATION';
