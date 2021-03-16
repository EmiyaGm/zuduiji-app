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

  goDetail = (id) => {
    Taro.navigateTo({
      url: `/pages/admin-user-detail/admin-user-detail?id=${id}`,
    });
  };

  render() {
    const { userData } = this.props;

    return (
      <View
        className="user-item"
        onClick={this.goDetail.bind(this, userData.id)}
      >
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
      </View>
    );
  }
}
