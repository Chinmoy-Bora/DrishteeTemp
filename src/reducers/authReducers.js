import { LOGIN_SUCCESS, LOGOUT } from '../actions/authActions';

const initialState = {
  isLoggedIn: false,
  userData: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        userData: action.payload,
      };
    case LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        userData: null,
      };
    default:
      return state;
  }
};

export default authReducer;
