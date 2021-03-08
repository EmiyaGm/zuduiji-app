import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { AtAvatar, AtButton } from "taro-ui";
import fetch from "@utils/request";
import defaultAvatar from "@assets/default-avatar.png";
import "./index.scss";

export default class OrderItem extends Component {
  static defaultProps = {
    orderData: {},
    activityData: {},
  };

  goDetail = (id) => {
    Taro.navigateTo({
      url: `/pages/order-detail/order-detail?id=${id}`,
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
    const { activityData, orderData } = this.props;

    return (
      <View className="order-item">
        <View className="statusContent">
          {this.getStatus(orderData.status)}
        </View>
        <View
          className="headContent"
          onClick={this.goDetail.bind(this, orderData.id)}
        >
          <View className="coverArea">
            <AtAvatar
              image={
                activityData.images
                  ? HOST_UPLOAD + activityData.images[0]
                  : defaultAvatar
              }
              size="large"
            ></AtAvatar>
          </View>
          <View className="nameArea">
            <View className="name">{activityData.name}</View>
            <View className="price">
              <View>￥ {activityData.price / 100}</View>
              <View style={{ float: "right" }}>x {orderData.num}</View>
            </View>
          </View>
        </View>
        <View className="middleContent">合计：￥ {orderData.amount / 100}</View>
        {/* {orderData.status === "wait_pay" && (
          <View className="footContent">
            <View className="actionButton">
              <AtButton type="secondary" circle={true} size="small">
                取消订单
              </AtButton>
            </View>
            <View className="actionButton">
              <AtButton type="primary" circle={true} size="small">
                确认支付
              </AtButton>
            </View>
          </View>
        )} */}
        {/* {orderData.status === "send" && (
          <View className="footContent">
            <View className="actionButton">
              <AtButton type="primary" circle={true} size="small">
                确认收货
              </AtButton>
            </View>
          </View>
        )} */}
      </View>
    );
  }
}
