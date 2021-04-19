import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtAvatar } from "taro-ui";
import fetch from "@utils/request";
import { API_WALLET_UNBANKBIND } from "@constants/api";
import "./index.scss";

export default class BankItem extends Component {
  static defaultProps = {
    bankData: {},
    showNo: "",
  };

  unBankBind = () => {
    const self = this;
    Taro.showModal({
      title: "解除银行卡绑定",
      content: "您确定要解除此张银行卡的绑定吗？",
    }).then((res) => {
      if (res.confirm) {
        fetch({
          url: API_WALLET_UNBANKBIND,
          payload: [],
          method: "POST",
          showToast: false,
          autoLogin: false,
        }).then((res) => {
          if (res) {
            Taro.showToast({
              title: "解除成功",
            });
            Taro.navigateBack({ delta: 1 });
          } else {
            Taro.showToast({
              title: "解除失败",
              icon: "error",
            });
          }
        });
      }
    });
  };

  showNo = (no) => {
    if (no) {
      const value = no.replace(/(\d{4})(?=\d)/g, "$1 ");
      const newValue = value.split(" ").map((item, index) => {
        if (index < value.split(" ").length - 1) {
          return "****";
        }
        return item;
      });
      return newValue.join(" ");
    }
    return "";
  };

  render() {
    return (
      <View className="bank-item">
        <View className="bankImage"></View>
        <View className="bankInfo">
          <View className="bankName">{this.props.bankData.bankName}</View>
          <View className="no">{this.showNo(this.props.bankData.no)}</View>
        </View>
        <View className="unbind" onClick={this.unBankBind.bind(this)}>
          解绑
        </View>
      </View>
    );
  }
}
