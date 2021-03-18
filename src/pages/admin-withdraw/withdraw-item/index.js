import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { AtAvatar } from "taro-ui";
import { API_WALLET_REVIEW } from "@constants/api";
import fetch from "@utils/request";
import defaultAvatar from "@assets/default-avatar.png";
import "./index.scss";

export default class WithdrawItem extends Component {
  static defaultProps = {
    withdrawData: {},
  };

  state = {
    hideButton: false,
  };

  getStatus(status) {
    switch (status) {
      case "wait_review":
        return "待审核";
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
      title: "商户提现申请",
      content: status === "pass" ? "确认通过？" : "确认拒绝",
    }).then((res) => {
      if (res.confirm) {
        fetch({
          url: API_WALLET_REVIEW,
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
  }

  render() {
    const { withdrawData } = this.props;
    const { hideButton } = this.state;
    return (
      <View className="withdraw-item">
        <View className="headContent">
          <View className="nameArea">
            <View className="name">用户名称：{withdrawData.user.nickName}</View>
            <View className="status">
              状态：{this.getStatus(withdrawData.status)}
            </View>
          </View>
          <View className="moneyArea">
            <View className="total">
              总金额：{withdrawData.total ? withdrawData.total / 100 : 0}
            </View>
            <View className="fee">
              手续费：{withdrawData.fee ? withdrawData.fee / 100 : 0}
            </View>
            <View className="amount">
              实际金额：{withdrawData.amount ? withdrawData.amount / 100 : 0}
            </View>
          </View>
        </View>
        <View className="footContent">
          {withdrawData.status === "wait_review" && !hideButton && (
            <View className="actionArea">
              <Text
                className="actionItem"
                onClick={this.review.bind(this, "pass", withdrawData.id)}
              >
                通过
              </Text>
              <Text
                className="actionItem"
                onClick={this.review.bind(this, "fail", withdrawData.id)}
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
