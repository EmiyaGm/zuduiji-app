import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import fetch from "@utils/request";
import { API_BUSINESS_APPLY } from "@constants/api";
import defaultAvatar from "@assets/default-avatar.png";
import bg from "./assets/bg.png";
import qrCode from "./assets/qr-code.png";
import level01 from "./assets/level-01.png";
import "./index.scss";

export default class Profile extends Component {
  static defaultProps = {
    userInfo: {},
    loginInfo: {},
  };

  handleLogin = () => {
    if (!this.props.loginInfo.token) {
      Taro.navigateTo({
        url: "/pages/user-login/user-login",
      });
    }
  };

  handleApply = () => {
    fetch({ url: API_BUSINESS_APPLY, showToast: false, autoLogin: false }).then(
      (res) => {
        if (res) {
          Taro.showToast({
            title: "申请成功！",
            icon: "none",
          });
        } else {
          Taro.showToast({
            title: "申请失败，请稍后再试",
            icon: "none",
          });
        }
      },
    );
  };

  getUid = (uid) => {
    if (!uid || !/@/.test(uid)) {
      return "";
    }
    const [username, suffix] = uid.split("@");
    const firstLetter = username[0];
    const lastLetter = username[username.length - 1];
    return `${firstLetter}****${lastLetter}@${suffix}`;
  };

  render() {
    const { userInfo, loginInfo } = this.props;

    return (
      <View className="user-profile">
        {/* // NOTE 背景图片：Image 标签 + position absolute 实现 */}
        <Image className="user-profile__bg" src={bg} mode="widthFix" />

        <View className="user-profile__wrap">
          <View className="user-profile__avatar">
            <Image
              className="user-profile__avatar-img"
              src={userInfo.avatarUrl || defaultAvatar}
              onClick={this.handleLogin}
            />
          </View>

          <View className="user-profile__info" onClick={this.handleLogin}>
            <Text className="user-profile__info-name">
              {loginInfo.token ? userInfo.nickName : "未登录"}
            </Text>
            {loginInfo.token ? (
              loginInfo.account && loginInfo.account.role === "USER" ? (
                <Text
                  className="user-profile__info-tip"
                  onClick={this.handleApply}
                >
                  申请成为商家
                </Text>
              ) : (
                ""
              )
            ) : (
              <Text className="user-profile__info-tip">点击登录账号</Text>
            )}
          </View>
        </View>
      </View>
    );
  }
}
