import { combineReducers } from 'redux';
import { authStateReducer } from 'redux-oauth';

export default combineReducers({
  auth: authStateReducer,
});
