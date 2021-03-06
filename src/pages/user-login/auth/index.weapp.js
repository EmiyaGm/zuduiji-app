import Taro, { Component } from "@tarojs/taro";
import { connect } from "@tarojs/redux";
import * as actions from "@actions/user";
import { ButtonItem } from "@components";
import fetch from "@utils/request";
import { API_USER_INFO } from "@constants/api";

// XXX 仅仅作为多端组件示例，实际只实现了邮箱登录
@connect((state) => state.user, actions)
export default class AUth extends Component {
  agreeAuth = (e) => {
    const { errMsg, userInfo } = e.detail ? e.detail : {};
    const self = this;
    if (errMsg === "getUserInfo:ok") {
      self.props.dispatchUser(userInfo);
      Taro.login({
        success: function(res) {
          if (res.code) {
            Taro.showLoading({
              title: "正在登录",
            });
            self.props.dispatchLogin([res.code]).then((rep) => {
              fetch({
                url: API_USER_INFO,
                payload: [
                  {
                    ...e.detail,
                    sessionKey: rep.account.sessionKey,
                  },
                ],
                method: "POST",
                showToast: false,
                autoLogin: false,
              }).then((result) => {
                if (result) {
                  Taro.hideLoading();
                  Taro.showToast({
                    title: "登录成功！",
                    icon: "none",
                  });
                }
              });
              Taro.navigateBack({ delta: 2 });
            });
          } else {
            console.log("登录失败！" + res.errMsg);
          }
        },
      });
    } else {
      Taro.showToast({
        title: "授权失败",
        icon: "none",
      });
    }
  };

  render() {
    return (
      <ButtonItem
        type="primary"
        text="微信登录"
        openType="getUserInfo"
        onGetUserInfo={this.agreeAuth}
      />
    );
  }
}
