import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { AtAvatar } from "taro-ui";
import { API_BUSINESS_REVIEW } from "@constants/api";
import fetch from "@utils/request";
import defaultAvatar from "@assets/default-avatar.png";
import "./index.scss";

export default class ApplyItem extends Component {
  static defaultProps = {
    applyData: {},
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

  review = (status, id) => {
    const self = this;
    Taro.showModal({
      title: "用户申请",
      content: status === "pass" ? "确认通过？" : "确认拒绝",
    }).then((res) => {
      if (res.confirm) {
        fetch({
          url: API_BUSINESS_REVIEW,
          payload: [id, status, ""],
          method: "POST",
          showToast: false,
          autoLogin: false,
        }).then((res) => {
          if (res) {
            Taro.showToast({
              title: "操作成功",
              icon: "success",
            });
            self.setState({
              hideButton: true,
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
  };

  render() {
    const { applyData } = this.props;
    const { hideButton } = this.state;
    return (
      <View className="apply-item">
        <View className="headContent">
          <View className="nameArea">
            <View className="name">用户Id：{applyData.userId}</View>
            <View className="status">
              状态：{this.getStatus(applyData.status)}
            </View>
          </View>
        </View>
        <View className="footContent">
          {applyData.status === "never" && !hideButton && (
            <View className="actionArea">
              <Text
                className="actionItem"
                onClick={this.review.bind(this, "pass", applyData.userId)}
              >
                通过
              </Text>
              <Text
                className="actionItem"
                onClick={this.review.bind(this, "fail", applyData.userId)}
              >
                拒绝
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  }
}
