import Taro from "@tarojs/taro";
import { API_USER_LOGIN } from "@constants/api";
var log = require("./log.js");

const CODE_SUCCESS = "200";
const CODE_AUTH_EXPIRED = "600";

function getStorage(key) {
  return Taro.getStorage({ key })
    .then((res) => res.data)
    .catch(() => "");
}

function updateStorage(data = {}) {
  return Promise.all([
    Taro.setStorage({ key: "token", data: data["token"] || "" }),
  ]);
}

/**
 * 简易封装网络请求
 * // NOTE 需要注意 RN 不支持 *StorageSync，此处用 async/await 解决
 * @param {*} options
 */
export default async function fetch(options) {
  const {
    url,
    payload,
    method = "GET",
    showToast = true,
    autoLogin = true,
  } = options;
  const token = await getStorage("token");
  const header = token ? { Authorization: token } : {};
  if (method === "POST") {
    header["content-type"] = "application/json";
  }

  return Taro.request({
    url,
    method,
    data: payload,
    header,
  })
    .then(async (res) => {
      if (res.data && res.data.length !== 2) {
        if (res.data.length === 4) {
          Taro.showToast({
            title: res.data[3][2],
            icon: "error",
          });
        }
        return Promise.reject(res.data);
      }

      if (url === API_USER_LOGIN) {
        await updateStorage(res.data[1]);
      }

      if (res.data[0] === "NO_LOGIN") {
        Taro.showToast({
          title: "请先登录",
          icon: "error",
        });
      }

      return res.data[1];
    })
    .catch((err) => {
      console.log("-------error-------");
      log.error(JSON.stringify(err));
      console.log(err);
      const defaultMsg =
        err.code === CODE_AUTH_EXPIRED ? "登录失效" : "请求异常";
      if (showToast) {
        Taro.showToast({
          title: (err && err.errorMsg) || defaultMsg,
          icon: "none",
        });
      }

      if (err.code === CODE_AUTH_EXPIRED && autoLogin) {
        Taro.navigateTo({
          url: "/pages/user/user",
        });
      }

      return Promise.reject({ message: defaultMsg, ...err });
    });
}
