import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { AtAvatar } from "taro-ui";
import fetch from "@utils/request";
import { API_ACTIVITY_ADMINREVIEWACTIVITY } from "@constants/api";
import defaultAvatar from "@assets/default-avatar.png";
import "./index.scss";

export default class PublishItem extends Component {
  static defaultProps = {
    publishData: {},
  };

  state = {
    hideButton: false,
  };

  goDetail = (id) => {
    Taro.navigateTo({
      url: `/pages/publish-detail/publish-detail?id=${id}`,
    });
  };

  review = (status, id) => {
    const self = this;
    Taro.showModal({
      title: "活动申请",
      content: status === "pass" ? "确认通过？" : "确认拒绝",
    }).then((res) => {
      if (res.confirm) {
        fetch({
          url: API_ACTIVITY_ADMINREVIEWACTIVITY,
          payload: [id, status, ""],
          method: "POST",
          showToast: false,
          autoLogin: false,
        }).then((res) => {
          if (res) {
            Taro.showToast({
              title: "操作成功",
              icon: "success",
            });
            self.setState({
              hideButton: true,
            });
          } else {
            Taro.showToast({
              title: "操作失败",
              icon: "error",
            });
          }
        });
      }
    });
  };

  render() {
    const { publishData } = this.props;
    const { hideButton } = this.state;

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
            <View className="at-col">
              <View
                style={{
                  color: "lightblue",
                }}
              >
                0
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
          {publishData.status === "wait_review" && !hideButton && (
            <View className="actionArea">
              <Text
                className="actionItem"
                onClick={this.review.bind(this, "pass", publishData.id)}
              >
                审核通过
              </Text>
              <Text
                className="actionItem"
                onClick={this.review.bind(this, "fail", publishData.id)}
              >
                审核拒绝
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  }
}
