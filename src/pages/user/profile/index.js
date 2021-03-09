import Taro, { Component } from "@tarojs/taro";
import { connect } from "@tarojs/redux";
import * as actions from "@actions/user";
import { View, Text, Image } from "@tarojs/components";
import { AtButton } from "taro-ui";
import defaultAvatar from "@assets/default-avatar.png";
import bg from "./assets/bg.png";
import fetch from "@utils/request";
import { API_USER_PHONE } from "@constants/api";
import "./index.scss";
@connect((state) => state.user, actions)
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

  getPhoneNumber = (e) => {
    const self = this;
    const { errMsg } = e.detail ? e.detail : {};
    if (errMsg === "getPhoneNumber:ok") {
      fetch({
        url: API_USER_PHONE,
        payload: [
          {
            ...e.detail,
            sessionKey: self.props.loginInfo.account.sessionKey,
          },
        ],
        method: "POST",
        showToast: false,
        autoLogin: false,
      }).then((res) => {
        if (res) {
          self.props.dispatchUser(res);
          Taro.showToast({
            title: "获取成功",
            icon: "success",
          });
        } else {
          Taro.showToast({
            title: "获取失败",
            icon: "error",
          });
        }
      });
    }
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
              !userInfo.phone ? (
                <View className="getPhoneButton">
                  <AtButton
                    type="primary"
                    openType="getPhoneNumber"
                    onGetPhoneNumber={this.getPhoneNumber}
                    size="small"
                    round
                  >
                    获取手机号
                  </AtButton>
                </View>
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
