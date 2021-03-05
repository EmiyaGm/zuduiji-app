import Taro from "@tarojs/taro";
import { API_ACTIVITY_UPLOAD } from "@constants/api";

function getStorage(key) {
  return Taro.getStorage({ key })
    .then((res) => res.data)
    .catch(() => "");
}

/**
 * 简易封装网络请求
 * // NOTE 需要注意 RN 不支持 *StorageSync，此处用 async/await 解决
 * @param {*} options
 */
export default async function upload(file) {
  const token = await getStorage("token");
  const header = token ? { Authorization: token } : {};

  return Taro.uploadFile({
    url: API_ACTIVITY_UPLOAD, //仅为示例，非真实的接口地址
    filePath: file,
    name: "upload",
    header,
  });
}
