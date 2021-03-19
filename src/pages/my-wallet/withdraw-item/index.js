import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { AtAvatar } from "taro-ui";
import fetch from "@utils/request";
import defaultAvatar from "@assets/default-avatar.png";
import "./index.scss";

export default class WithdrawItem extends Component {
  static defaultProps = {
    withdrawData: {},
  };

  state = {};

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

  render() {
    const { withdrawData } = this.props;
    return (
      <View className="withdraw-item">
        <View className="headContent">
          <View className="typeArea">
            类型：{withdrawData.type === 'withdraw' ? '提现' : '充值'}
          </View>
          <View className="nameArea">
            <View className="name">用户名称：{withdrawData.user.nickName}</View>
            <View className="status">
              状态：{this.getStatus(withdrawData.status)}
            </View>
          </View>
          <View className="moneyArea">
            <View className="total">总金额：{withdrawData.total ? withdrawData.total / 100 : 0}</View>
            <View className="fee">手续费：{withdrawData.fee ? withdrawData.fee / 100 : 0}</View>
            <View className="amount">
              实际金额：{withdrawData.amount ? withdrawData.amount / 100 : 0}
            </View>
          </View>
        </View>
      </View>
    );
  }
}
