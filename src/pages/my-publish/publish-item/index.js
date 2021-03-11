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
import fetch from "@utils/request";
import { API_ACTIVITY_NOTICE, API_ACTIVITY_SETLUCKNUMS } from "@constants/api";
import defaultAvatar from "@assets/default-avatar.png";
import "./index.scss";

export default class PublishItem extends Component {
  static defaultProps = {
    publishData: {},
  };

  state = {
    isOpenShow: false,
    luckNums: "",
    hideButton: false,
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

  setLuckNums = () => {
    const self = this;
    if (this.state.luckNums) {
      const luckNums = this.state.luckNums.split(",");
      if (luckNums.length > 0) {
        fetch({
          url: API_ACTIVITY_SETLUCKNUMS,
          payload: [this.props.publishData.id, luckNums],
          method: "POST",
          showToast: false,
          autoLogin: false,
        }).then((res) => {
          if (res) {
            Taro.showToast({
              title: "设置成功",
              icon: "success",
            });
            self.setState({
              isOpenShow: false,
              hideButton: true,
            });
          } else {
            Taro.showToast({
              title: "设置失败",
              icon: "error",
            });
          }
        });
      } else {
        Taro.showToast({
          title: "中奖号码不合法",
          icon: "error",
        });
      }
    } else {
      Taro.showToast({
        title: "请填写中奖号码",
        icon: "error",
      });
    }
  };

  openShow = (isShow) => {
    this.setState({
      isOpenShow: isShow,
    });
  };

  render() {
    const { publishData } = this.props;
    const { isOpenShow, hideButton } = this.state;

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
            <Button className="actionButton" onClick={this.goDetail.bind(this, publishData.id)}>详情</Button>
            <Button className="actionButton" openType="share">分享</Button>
          </View>
          {publishData.status === "wait_open" && (
            <View
              className="statuArea"
              onClick={this.notice.bind(this, publishData.id)}
            >
              发送开播提醒
            </View>
          )}
          {publishData.status === "wait_open" && !hideButton && (
            <View
              className="statuArea"
              onClick={this.openShow.bind(this, true)}
            >
              开奖
            </View>
          )}
          <AtModal isOpened={isOpenShow}>
            <AtModalHeader>请输入开奖号码</AtModalHeader>
            <AtModalContent>
              <View>请输入开奖号码，并用英文逗号 ',' 做分隔</View>
              {this.state.isOpenShow && (
                <AtInput
                  name="luckNums"
                  title="开奖号码"
                  type="text"
                  placeholder="开奖号码"
                  value={this.state.luckNums}
                  onChange={this.handleChange.bind(this, "luckNums")}
                />
              )}
            </AtModalContent>
            <AtModalAction>
              <Button onClick={this.openShow.bind(this, false)}>取消</Button>{" "}
              <Button onClick={this.setLuckNums.bind(this)}>确定</Button>
            </AtModalAction>
          </AtModal>
        </View>
      </View>
    );
  }
}
