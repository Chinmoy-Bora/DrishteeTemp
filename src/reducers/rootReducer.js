import { combineReducers } from 'redux';
import authReducer from './authReducers';

const rootReducer = combineReducers({
  auth: authReducer, // Can add more reducers here
});

export default rootReducer;
