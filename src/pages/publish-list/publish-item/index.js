import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { AtAvatar } from "taro-ui";
import fetch from "@utils/request";
import defaultAvatar from "@assets/default-avatar.png";
import "./index.scss";

export default class PublishItem extends Component {
  static defaultProps = {
    publishData: {},
  };

  goDetail = (id) => {
    Taro.navigateTo({
      url: `/pages/publish-detail/publish-detail?id=${id}`,
    });
  };

  goOrderList = (id) => {
    Taro.navigateTo({
      url: `/pages/publish-order-list/publish-order-list?id=${id}`,
    });
  };

  render() {
    const { publishData } = this.props;

    return (
      <View className="publish-item">
        <View className="headContent">
          <View className="coverArea">
            <AtAvatar
              image={
                publishData.images
                  ? HOST_UPLOAD + publishData.images[0]
                  : defaultAvatar
              }
              size="large"
            ></AtAvatar>
          </View>
          <View className="nameArea">
            <View className="name">{publishData.name}</View>
            <View className="price">￥ {publishData.price / 100}</View>
          </View>
        </View>
        <View className="middleContent">
          <View className="at-row">
            <View
              className="at-col"
              onClick={this.goOrderList.bind(this, publishData.id)}
            >
              <View
                style={{
                  color: "lightblue",
                }}
              >
                {publishData.orderNums ? publishData.orderNums : 0}
              </View>
              <View>订单数</View>
            </View>
            <View className="at-col">
              <View style={{ color: "red" }}>
                {(publishData.num * publishData.price) / 100}
              </View>
              <View>订单总额</View>
            </View>
            <View className="at-col">
              <View>{publishData.joinNum ? publishData.joinNum : 0}</View>
              <View>已卖出</View>
            </View>
            <View className="at-col">
              <View style={{ color: "red" }}>
                {publishData.joinNum
                  ? publishData.num - publishData.joinNum
                  : publishData.num}
              </View>
              <View>剩余数</View>
            </View>
          </View>
        </View>
        <View className="footContent">
          <View className="actionArea">
            <Text
              className="actionItem"
              onClick={this.goDetail.bind(this, publishData.id)}
            >
              详情
            </Text>
            <Text>分享</Text>
          </View>
        </View>
      </View>
    );
  }
}
