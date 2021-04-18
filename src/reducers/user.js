import {
  USER_INFO,
  USER_LOGIN,
  USER_LOGOUT,
  USER_CFG,
  NBA_TEAMS,
  BANK_NAMES,
} from "@constants/user";

const INITIAL_STATE = {
  userInfo: {},
  loginInfo: {},
  cfg: {},
  nbaTeams: {},
  bankNames: [],
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
    case USER_CFG: {
      return {
        ...state,
        cfg: {
          ...action.payload,
        },
      };
    }
    case NBA_TEAMS: {
      return {
        ...state,
        nbaTeams: {
          ...action.payload,
        },
      };
    }
    case BANK_NAMES: {
      return {
        ...state,
        bankNames: [...action.payload],
      };
    }
    default:
      return state;
  }
}
