import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { AtAvatar } from "taro-ui";
import { API_BUSINESS_REVIEW } from "@constants/api";
import fetch from "@utils/request";
import defaultAvatar from "@assets/default-avatar.png";
import "./index.scss";

export default class ApplyItem extends Component {
  static defaultProps = {
    applyData: {
      account: {},
      business: {},
      address: {},
    },
  };

  state = {
    hideButton: false,
  };

  getStatus(status) {
    switch (status) {
      case "never":
        return "未审核";
      case "pass":
        return "审核通过";
      case "fail":
        return "审核拒绝";
      default:
        return "";
    }
  }

  goDetail = (id) => {
    Taro.navigateTo({
      url: `/pages/admin-apply-detail/admin-apply-detail?id=${id}`,
    });
  };

  render() {
    const { applyData } = this.props;
    return (
      <View
        className="apply-item"
        onClick={this.goDetail.bind(this, applyData.account.id)}
      >
        <View className="headContent">
          <View className="nameArea">
            <View className="avatar">
              <AtAvatar image={applyData.account ? applyData.account.avatarUrl : ''}></AtAvatar>
            </View>
            <View className="name">{applyData.account.nickName}</View>
          </View>
        </View>
      </View>
    );
  }
}
