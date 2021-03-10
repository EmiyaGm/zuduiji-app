import Taro, { Component } from "@tarojs/taro";
import { View, Text, ScrollView, Picker, Input } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import {
  AtList,
  AtListItem,
  AtAvatar,
  AtCountdown,
  AtButton,
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtModalAction,
  AtInput,
} from "taro-ui";
import fetch from "@utils/request";
import {
  API_ACTIVITY_ORDERDETAIL,
  API_ACTIVITY_LOGISTICS,
} from "@constants/api";
import { getWindowHeight } from "@utils/style";
import defaultAvatar from "@assets/default-avatar.png";
import "./publish-order-detail.scss";

class PublishOrderDetail extends Component {
  config = {
    navigationBarTitleText: "订单详情",
  };

  state = {
    id: "",
    orderDetail: {},
    publishtDetail: {},
    activityItems: [],
    minutes: 0,
    seconds: 0,
    isBingoShow: false,
    logistics: "",
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
              publishtDetail: res.activity,
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

  getStatus(status) {
    switch (status) {
      case "wait_pay":
        return "待支付";
      case "wait_open":
        return "待开奖";
      case "bingo":
        return "待发货";
      case "send":
        return "待收货";
      case "unbingo":
        return "已完成";
      case "cancel":
        return "已关闭";
      default:
        return "";
    }
  }

  getStatusTip(status) {
    let tip1 = "";
    switch (status) {
      case "wait_pay":
        tip1 = "等待买家付款";
        break;
      case "wait_open":
        tip1 = "等待商家开奖";
        break;
      case "bingo":
        tip1 = "等待商家发货";
        break;
      case "send":
        tip1 = "商家已发货，等待买家确认收货";
        break;
      case "unbingo":
        tip1 = "该订单已完成";
        break;
      case "cancel":
        tip1 = "该订单关闭";
        break;
      default:
        return "";
    }
    return tip1;
  }

  getCountDown(payTimeOut) {
    const minusTime = payTimeOut * 1000 - new Date().getTime();
    const HOUR = 1000 * 60 * 60;
    const m = parseInt((minusTime % HOUR) / (1000 * 60));
    const s = parseInt((minusTime % (1000 * 60)) / 1000);
    this.setState({
      minutes: m,
      seconds: s,
    });
  }

  handleChange = (key, value) => {
    this.setState({
      [key]: value,
    });
  };

  bingoShow = () => {
    this.setState({
      isBingoShow: isShow,
    });
  };

  setLogistics = () => {
    const self = this;
    if (this.state.logistics) {
      fetch({
        url: API_ACTIVITY_LOGISTICS,
        payload: [this.state.orderDetail.id, this.state.logistics],
        method: "POST",
        showToast: false,
        autoLogin: false,
      }).then((res) => {
        if (res) {
          Taro.showToast({
            title: "设置成功",
            icon: "success",
          });
          self.getDetail(this.state.orderDetail.id)
          self.setState({
            isBingoShow: false,
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
        title: "请输入快递单号",
        icon: "none",
      });
    }
  };

  render() {
    const { isBingoShow } = this.state;
    return (
      <View className="publish-order-detail">
        <ScrollView
          scrollY
          className="order-detail__wrap"
          style={{ height: getWindowHeight() }}
        >
          <View className="statusArea">
            <View className="status">
              {this.getStatus(this.state.orderDetail.status)}
            </View>
            <View className="statusTip1">
              {this.getStatusTip(this.state.orderDetail.status)}
            </View>
            <View className="statusTip2">
              {this.state.orderDetail.status === "wait_pay" && (
                <AtCountdown
                  minutes={this.state.minutes}
                  seconds={this.state.seconds}
                />
              )}
            </View>
            {this.state.orderDetail === "bingo" && (
              <View className="buttonArea">
                <View className="actionButton">
                  <AtButton
                    type="primary"
                    circle={true}
                    size="small"
                    onClick={this.bingoShow.bind(this, true)}
                  >
                    确认发货
                  </AtButton>
                </View>
              </View>
            )}
            <AtModal isOpened={isBingoShow}>
              <AtModalHeader>请输入快递单号</AtModalHeader>
              <AtModalContent>
                <View>请输入快递单号</View>
                <AtInput
                  name="logistics"
                  title="快递单号"
                  type="text"
                  placeholder="快递单号"
                  value={this.state.logistics}
                  onChange={this.handleChange.bind(this, "logistics")}
                />
              </AtModalContent>
              <AtModalAction>
                <Button onClick={this.bingoShow.bind(this, false)}>取消</Button>{" "}
                <Button onClick={this.setLogistics.bind(this)}>确定</Button>
              </AtModalAction>
            </AtModal>
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
              <AtListItem
                title="数量"
                extraText={`${this.state.orderDetail.num}`}
              />
              <AtListItem
                title="邮费"
                extraText={
                  this.state.publishtDetail.fare
                    ? `￥ ${this.state.publishtDetail.fare / 100}`
                    : "免运费"
                }
              />
              <AtListItem
                title="留言"
                extraText={
                  this.state.orderDetail.remark
                    ? this.state.orderDetail.remark
                    : ""
                }
              />
              <AtListItem
                title="合计"
                extraText={`￥ ${this.state.orderDetail.amount / 100}`}
              />
            </AtList>
          </View>
          <View className="codeArea">
            <View className="title">已为您分配序号：</View>
            <View className="myCode">
              {this.state.activityItems.map((item, index) => {
                return <View className="codeItem">{item.luckNum}</View>;
              })}
            </View>
            <View className="title">中奖序号：</View>
            <View className="luckCode"></View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default PublishOrderDetail;