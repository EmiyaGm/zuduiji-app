import Taro, { Component } from "@tarojs/taro";
import { View, Text, ScrollView, Picker, Input } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import {
  AtForm,
  AtInput,
  AtButton,
  AtImagePicker,
  AtList,
  AtListItem,
  AtTextarea,
} from "taro-ui";
import { getWindowHeight } from "@utils/style";
import fetch from "@utils/request";
import { API_ACTIVITY_ORDERDETAIL, API_ACTIVITY_ORDER } from "@constants/api";
import "./party-success.scss";

class PartySuccess extends Component {
  config = {
    navigationBarTitleText: "组队成功",
  };

  state = {
    id: "",
    orderDetail: {},
    publishDetail: {},
    activityItems: [],
  };

  componentDidMount() {
    const params = this.$router.params;
    if (params.id) {
      this.setState({
        id: params.id,
      });
      this.getDetail(params.id);
    }
  }

  getDetail(id) {
    const self = this;
    fetch({
      url: API_ACTIVITY_ORDERDETAIL,
      payload: [id],
      method: "POST",
      showToast: false,
      autoLogin: false,
    }).then((res) => {
      if (res && res.activity) {
        if (res.orders && Array.isArray(res.orders) && res.orders.length > 0) {
          self.setState(
            {
              orderDetail: res.orders[0].order,
              publishDetail: res.activity,
              activityItems: res.orders[0].activityItems,
            },
            () => {
              this.getCountDown(res.orders[0].order.payTimeOut);
            },
          );
        }
      }
    });
  }

  render() {
    return (
      <View className="party-success">
        <View className="successArea">
          <View className="title">你参加的队伍已组队成功</View>
          <View className="numTitle">已为您分配序号：</View>
          <View className="numArea">
            {this.state.activityItems.map((item, index) => {
              return <View className="numItem">{item.luckNum}</View>;
            })}
          </View>
        </View>
        <View className="orderTip"></View>
      </View>
    );
  }
}

export default PartySuccess;
