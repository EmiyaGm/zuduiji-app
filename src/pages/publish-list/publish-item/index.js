import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, Button } from "@tarojs/components";
import { AtAvatar } from "taro-ui";
import fetch from "@utils/request";
import defaultAvatar from "@assets/default-avatar.png";
import "./index.scss";

export default class PublishItem extends Component {
  static defaultProps = {
    publishData: {},
  };

  onShareAppMessage (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: this.props.publishData.name,
      path: `/publish-page/publish-detail?id=${this.props.publishData.id}`
    }
  }


  goDetail = (id) => {
    Taro.navigateTo({
      url: `/pages/publish-detail/publish-detail?id=${id}`,
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
            <Button
              className="actionButton"
              onClick={this.goDetail.bind(this, publishData.id)}
            >
              详情
            </Button>
            <Button className="actionButton" openType="share">分享</Button>
          </View>
        </View>
      </View>
    );
  }
}
