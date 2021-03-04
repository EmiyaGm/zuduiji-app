import { USER_INFO, USER_LOGIN, USER_LOGOUT } from "@constants/user";

/**
 * 用户登录
 * @param {*} payload
 */
export const dispatchLogin = (payload) => ({ type: USER_LOGIN, payload });

/**
 * 用户退出登录
 */
export const dispatchLogout = () => ({ type: USER_LOGOUT });

/**
 * 保存用户微信信息
 */
export const dispatchUser = (payload) => ({ type: USER_INFO, payload });
