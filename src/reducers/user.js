import { USER_INFO, USER_LOGIN, USER_LOGOUT } from "@constants/user";

const INITIAL_STATE = {
  userInfo: {},
  loginInfo: {},
};

export default function user(state = INITIAL_STATE, action) {
  switch (action.type) {
    case USER_INFO: {
      return {
        ...state,
        userInfo: {
          ...action.payload,
        },
      };
    }
    case USER_LOGIN: {
      return {
        ...state,
        loginInfo: {
          ...action.payload,
        },
      };
    }
    case USER_LOGOUT: {
      return {
        ...INITIAL_STATE,
      };
    }
    default:
      return state;
  }
}
