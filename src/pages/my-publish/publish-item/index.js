import Taro, { Component } from "@tarojs/taro";
import { View, Text, Button } from "@tarojs/components";
import {
  AtAvatar,
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtModalAction,
  AtInput,
} from "taro-ui";
import defaultAvatar from "@assets/default-avatar.png";
import "./index.scss";

export default class PublishItem extends Component {
  static defaultProps = {
    publishData: {},
  };

  state = {
    hideButton: false,
  };

  onShareAppMessage(res) {
    if (res.from === "button") {
      // 来自页面内转发按钮
      console.log(res.target);
    }
    return {
      title: this.props.publishData.name,
      path: `/pages/publish-detail/publish-detail?id=${this.props.publishData.id}`,
    };
  }

  handleChange = (key, value) => {
    this.setState({
      [key]: value,
    });
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

  goNotice = (id) => {
    Taro.navigateTo({
      url: `/pages/apply-notice/apply-notice?id=${id}`,
    });
  };

  goNums = (id) => {
    Taro.navigateTo({
      url: `/pages/apply-nums/apply-nums?id=${id}`,
    });
  };

  getStatus = (status) => {
    switch (status) {
      case "wait_review":
        return "待审核";
      case "review_refuse":
        return "审核未通过";
      case "wait_team":
        return "待组队";
      case "wait_open":
        return "待开奖";
      case "complete":
        return "已完成";
      case "close":
        return "组队未成功，关闭";
      default:
        return "";
    }
  };

  render() {
    const { publishData } = this.props;
    const { isOpenShow, hideButton, isNoticeShow } = this.state;

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
            <View>
              <View className="name">{publishData.name}</View>
              <View className="price">￥ {publishData.price / 100}</View>
            </View>
            <View className="status">{this.getStatus(publishData.status)}</View>
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
            <Button
              className="actionButton"
              onClick={this.goDetail.bind(this, publishData.id)}
            >
              详情
            </Button>
            <Button className="actionButton" openType="share">
              分享
            </Button>
          </View>
          {publishData.status === "wait_open" && (
            <View
              className="statuArea"
              onClick={this.goNotice.bind(this, publishData.id)}
            >
              提交直播
            </View>
          )}
          {publishData.status === "wait_open" && !hideButton && (
            <View
              className="statuArea"
              onClick={this.goNums.bind(this, publishData.id)}
            >
              提交开奖
            </View>
          )}
        </View>
      </View>
    );
  }
}
