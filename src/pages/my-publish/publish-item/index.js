import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { AtAvatar } from "taro-ui";
import fetch from "@utils/request";
import { API_ACTIVITY_NOTICE } from "@constants/api";
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

  notice = (id) => {
    const self = this;
    Taro.showModal({
      title: "发送开奖提醒",
      content: "确认发送开奖提醒？",
    }).then((res) => {
      if (res.confirm) {
        fetch({
          url: API_ACTIVITY_NOTICE,
          payload: [id, "您参与的活动马上就要开奖了，请前往直播间观看", 10],
          method: "POST",
          showToast: false,
          autoLogin: false,
        }).then((res) => {
          if (res) {
            Taro.showToast({
              title: "发送成功",
              icon: "success",
            });
          } else {
            Taro.showToast({
              title: "发送失败",
              icon: "error",
            });
          }
        });
      }
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
          {publishData.status === "wait_open" && (
            <View
              className="statuArea"
              onClick={this.notice.bind(this, publishData.id)}
            >
              去开播
            </View>
          )}
        </View>
      </View>
    );
  }
}
