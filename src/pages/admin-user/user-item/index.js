import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { AtAvatar, AtButton } from "taro-ui";
import fetch from "@utils/request";
import { API_ACCOUNT_SETADMIN, API_ACCOUNT_SETBUSINESS } from "@constants/api";
import defaultAvatar from "@assets/default-avatar.png";
import "./index.scss";

export default class UserItem extends Component {
  static defaultProps = {
    userData: {},
  };

  getRole(role) {
    switch (role) {
      case "USER":
        return "用户";
      case "ADMIN":
        return "管理员";
      case "BUSINESS":
        return "商户";
      default:
        return "";
    }
  }

  setRole(role, userId) {
    Taro.showModal({
      title: "设置角色",
      content:
        role === "ADMIN"
          ? "确认设置该用户为管理员？"
          : "确认设置该用户为管理员商户",
    }).then((res) => {
      if (res.confirm) {
        fetch({
          url:
            role === "ADMIN" ? API_ACCOUNT_SETADMIN : API_ACCOUNT_SETBUSINESS,
          payload: [userId, false],
          method: "POST",
          showToast: false,
          autoLogin: false,
        }).then((res) => {
          if (res) {
            Taro.showToast({
              title: "操作成功",
              icon: "success",
            });
          } else {
            Taro.showToast({
              title: "操作失败",
              icon: "error",
            });
          }
        });
      }
    });
  }

  render() {
    const { userData } = this.props;

    return (
      <View className="user-item">
        <View className="headContent">
          <View className="coverArea">
            <AtAvatar
              image={userData.avatarUrl ? userData.avatarUrl : defaultAvatar}
              size="large"
            ></AtAvatar>
          </View>
          <View className="nameArea">
            <View className="name">{userData.nickName}</View>
            <View className="price">
              <View>{userData.phone}</View>
            </View>
          </View>
        </View>
        <View className="middleContent">{this.getRole(userData.role)}</View>
        {userData.role === "USER" && (
          <View className="footContent">
            <View className="actionButton">
              <AtButton
                type="secondary"
                circle={true}
                size="small"
                onClick={this.setRole.bind(this, "ADMIN", userData.id)}
              >
                设置管理员
              </AtButton>
            </View>
            <View className="actionButton">
              <AtButton
                type="primary"
                circle={true}
                size="small"
                onClick={this.setRole.bind(this, "BUSINESS", userData.id)}
              >
                设置商户
              </AtButton>
            </View>
          </View>
        )}
        {userData.role === "BUSINESS" && (
          <View className="footContent">
            <View className="actionButton">
              <AtButton
                type="primary"
                circle={true}
                size="small"
                onClick={this.setRole.bind(this, "ADMIN", userData.id)}
              >
                设置管理员
              </AtButton>
            </View>
          </View>
        )}
      </View>
    );
  }
}
