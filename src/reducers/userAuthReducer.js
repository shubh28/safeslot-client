import {SIGN_IN_INIT, SIGN_IN_SUCCESS, SIGN_IN_ERROR} from "../consts";
import initState from './initialState';

export default function (state = initState.userAuthenticationDetails, action) {
  switch (action.type) {
    case SIGN_IN_INIT:
      return {
        isFetching: true,
        data: {...state.data, isLoggedIn: false},
        error: {}
      };
    case SIGN_IN_SUCCESS:
      return {
        isFetching: false,
        data: {...action.data, isLoggedIn: true},
        error: {}
      };
    case SIGN_IN_ERROR:
      return {
        isFetching: false,
        data: {...state.data, isLoggedIn: false},
        error: action.data
      };
    default:
      return state;
  }
}
