import { combineReducers } from 'redux';
import userAuthReducer from "./userAuthReducer";

const rootReducer = combineReducers({
  userAuthenticationDetails: userAuthReducer,
});

export default rootReducer;
