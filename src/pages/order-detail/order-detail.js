import Taro, { Component } from "@tarojs/taro";
import { View, Text, ScrollView, Picker, Input } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtList, AtListItem, AtAvatar } from "taro-ui";
import fetch from "@utils/request";
import { API_ACTIVITY_ORDERDETAIL, API_ACTIVITY_ORDER } from "@constants/api";
import { getWindowHeight } from "@utils/style";
import defaultAvatar from "@assets/default-avatar.png";
import "./order-detail.scss";

class OrderDetail extends Component {
  config = {
    navigationBarTitleText: "订单详情",
  };

  state = {
    id: "",
    orderDetail: {},
    publishtDetail: {},
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
          self.setState({
            orderDetail: res.orders[0].order,
            publishtDetail: res.activity,
            activityItems: res.orders[0].activityItems,
          });
        }
      }
    });
  }

  payOrder = () => {
    fetch({
      url: API_ACTIVITY_ORDER,
      payload: [
        {
          activityId: this.state.publishtDetail.id,
          num: this.state.orderDetail.num,
        },
      ],
      method: "POST",
      showToast: false,
      autoLogin: false,
    }).then((res) => {
      if (res) {
        if (res.activityId) {
          Taro.navigateTo({
            url: `/pages/apply-success/apply-success?id=${res.activityId}`,
          });
        }
      }
    });
  };

  getStatus(status) {
    switch (status) {
      case "wait_pay":
        return "待支付";
        break;
      case "bingo":
        return "待发货";
        break;
      case "send":
        return "待收货";
        break;
      case "unbingo":
        return "已完成";
        break;
      case "cancel":
        return "已关闭";
        break;
      default:
        return "";
    }
  }

  render() {
    return (
      <View className="order-detail">
        <ScrollView
          scrollY
          className="order-detail__wrap"
          style={{ height: getWindowHeight() }}
        >
          <View className="statusArea">
            <View className="status">
              {this.getStatus(this.state.orderDetail.status)}
            </View>
            <View className="statusTip1">状态说明文案1</View>
            <View className="statusTip2">状态说明文案2</View>
          </View>
          <View className="addressArea">
            <View className="addressTitle">
              <View>
                <View className="at-icon at-icon-map-pin"></View>
              </View>
              <View>收货地址</View>
            </View>
            <View className="addressContent">
              <View>姓名 电话</View>
              <View>这里是具体地址</View>
            </View>
          </View>
          <View className="goodsArea">
            <View className="cover">
              <AtAvatar
                image={
                  this.state.publishtDetail.images
                    ? HOST_UPLOAD + this.state.publishtDetail.images[0]
                    : defaultAvatar
                }
                size="large"
              ></AtAvatar>
            </View>
            <View className="content">
              <View className="name">{this.state.publishtDetail.name}</View>
              <View className="price">
                {this.state.publishtDetail.price / 100}
                <Text className="number">x1</Text>
              </View>
            </View>
          </View>
          <View className="infoArea">
            <AtList>
              <AtListItem title="数量" extraText={this.state.orderDetail.num} />
              <AtListItem
                title="邮费"
                extraText={
                  this.state.publishtDetail.fare
                    ? `￥ ${this.state.publishtDetail.fare / 100}`
                    : "免运费"
                }
              />
              <AtListItem title="留言" extraText="123123" />
              <AtListItem
                title="合计"
                extraText={`￥ ${this.state.orderDetail.amount / 100}`}
              />
            </AtList>
          </View>
          <View className="codeArea">
            <View className="title">已为您分配序号：</View>
            <View className="myCode"></View>
            <View className="title">中奖序号：</View>
            <View className="luckCode"></View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default OrderDetail;
