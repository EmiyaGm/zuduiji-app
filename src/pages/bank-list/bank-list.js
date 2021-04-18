import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtActivityIndicator } from "taro-ui";
import fetch from "@utils/request";
import { API_WALLET_BANK } from "@constants/api";
import BankItem from "./bank-item";
import "./bank-list.scss";

class BankList extends Component {
  config = {
    navigationBarTitleText: "银行卡",
  };

  state = {
    bankInfo: "",
  };

  componentDidShow() {
    this.onLoad();
  }

  onLoad = () => {
    const self = this;
    fetch({
      url: API_WALLET_BANK,
      payload: [],
      method: "POST",
      showToast: false,
      autoLogin: false,
    }).then((res) => {
      if (res && res.open) {
        self.setState({
          bankInfo: res,
        });
      }
    });
  };

  render() {
    const { bankInfo } = this.state;
    return (
      <View className="bank-list">
        <View className="bankList">
          {bankInfo && <BankItem bankData={bankInfo} />}
        </View>
      </View>
    );
  }
}

export default BankList;
