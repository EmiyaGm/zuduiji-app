import Taro, { Component } from "@tarojs/taro";
import { connect } from "@tarojs/redux";
import * as actions from "@actions/user";
import { ButtonItem } from "@components";

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
            //发起网络请求
            Taro.request({
              url: "http://zuduiji.simoncode.top/wx/login",
              method: "POST",
              data: [res.code],
              success: (res) => {
                if (res.data && res.data.length === 2) {
                  self.props.dispatchLogin(res.data[1]);
                  Taro.showToast({
                    title: "登录成功！",
                    icon: "none",
                  });
                  Taro.navigateBack({ delta: 2 });
                }
              },
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
