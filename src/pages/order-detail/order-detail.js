import Taro, { Component } from "@tarojs/taro";
import { View, Text, ScrollView, Picker, Input } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtList, AtListItem, AtAvatar, AtCountdown, AtButton } from "taro-ui";
import fetch from "@utils/request";
import {
  API_ACTIVITY_ORDERDETAIL,
  API_ACTIVITY_CANCELORDER,
} from "@constants/api";
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
    publishDetail: {},
    activityItems: [],
    minutes: 0,
    seconds: 0,
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
        tip1 = "请在15分钟内完成付款，否则将自动取消订单";
        break;
      case "wait_open":
        tip1 = "您已付款，等待商家开奖";
        break;
      case "bingo":
        tip1 = "恭喜您已中奖，等待商家发货";
        break;
      case "send":
        tip1 = "商家已发货，请在收到您的货品后确认收货";
        break;
      case "unbingo":
        tip1 = "该订单已完成，期待您的下一次参与";
        break;
      case "cancel":
        tip1 = "该订单关闭，期待您的下一次参与";
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

  payOrder = (order) => {
    const self = this;
    if (order.payInfo) {
      if (order.payInfo.expend) {
        const payInfo = JSON.parse(order.payInfo.expend.pay_info);
        Taro.requestPayment({
          ...payInfo,
          success: () => {
            Taro.showToast({
              title: "支付成功",
              icon: "success",
            });
            if (order.activityId) {
              Taro.redirectTo({
                url: `/pages/apply-success/apply-success?id=${order.activityId}&orderId=${order.id}`,
              });
            }
          },
          fail: () => {
            Taro.showToast({
              title: "支付失败",
              icon: "error",
            });
          },
        });
      } else {
        Taro.showToast({
          title: "生成支付失败",
          icon: "error",
        });
      }
    } else {
      Taro.showToast({
        title: "生成支付失败",
        icon: "error",
      });
    }
  };

  // 需要删除的测试流程接口

  cancelOrder = () => {
    const self = this;
    Taro.showModal({
      title: "取消订单",
      content: "确认取消该订单？",
    }).then((res) => {
      if (res.confirm) {
        fetch({
          url: API_ACTIVITY_CANCELORDER,
          payload: [this.state.orderDetail.id],
          method: "POST",
          showToast: false,
          autoLogin: false,
        }).then((res) => {
          if (res) {
            Taro.showToast({
              title: "取消成功",
              icon: "success",
            });
            self.getDetail();
          } else {
            Taro.showToast({
              title: "取消失败",
              icon: "error",
            });
          }
        });
      }
    });
  };

  copyText = (text) => {
    Taro.setClipboardData({
      data: text,
      success: () => {
        Taro.showToast({
          title: "复制成功",
          icon: "success",
        });
      },
    });
  };

  render() {
    const { orderDetail } = this.state;
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
            {this.state.orderDetail.status === "wait_pay" && (
              <View className="buttonArea">
                <View className="actionButton">
                  <AtButton
                    type="secondary"
                    circle={true}
                    size="small"
                    onClick={this.cancelOrder.bind(this)}
                  >
                    取消订单
                  </AtButton>
                </View>
                <View className="actionButton">
                  <AtButton
                    type="primary"
                    circle={true}
                    size="small"
                    onClick={this.payOrder.bind(this, this.state.orderDetail)}
                  >
                    确认支付
                  </AtButton>
                </View>
              </View>
            )}
          </View>
          <View className="addressArea">
            <View className="addressTitle">
              <View>
                <View className="at-icon at-icon-map-pin"></View>
              </View>
              <View>收货地址</View>
            </View>
            {orderDetail.address && (
              <View className="addressContent">
                <View>
                  {orderDetail.address.userName} {orderDetail.address.telNumber}
                </View>
                <View>
                  {orderDetail.address.provinceName}
                  {orderDetail.address.cityName}
                  {orderDetail.address.countyName}
                  {orderDetail.address.detailInfo}
                </View>
              </View>
            )}
          </View>
          <View className="goodsArea">
            <View className="cover">
              <AtAvatar
                image={
                  this.state.publishDetail.images
                    ? HOST_UPLOAD + this.state.publishDetail.images[0]
                    : defaultAvatar
                }
                size="large"
              ></AtAvatar>
            </View>
            <View className="content">
              <View className="name">{this.state.publishDetail.name}</View>
              <View className="price">
                {this.state.publishDetail.price / 100}
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
                  this.state.publishDetail.fare
                    ? `￥ ${this.state.publishDetail.fare / 100}`
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
          {this.state.publishDetail.noticeContent && (
            <View className="noticeContent">
              <View className="title">直播信息</View>
              <View className="content">
                <View className="contentTitle">
                  <View>直播口令</View>
                  <View>
                    <AtButton
                      type="primary"
                      size="small"
                      onClick={this.copyText.bind(
                        this,
                        this.state.publishDetail.noticeContent,
                      )}
                    >
                      复制
                    </AtButton>
                  </View>
                </View>
                <View>{this.state.publishDetail.noticeContent}</View>
              </View>
            </View>
          )}
          {this.state.orderDetail.logistics && (
            <View className="logisticsContent">
              <View className="title">物流单号</View>
              <View className="content">
                <View className="contentTitle">
                  物流公司：{this.state.orderDetail.logisticsCompany}
                </View>
                <View className="contentArea">
                  <View> 快递单号：{this.state.orderDetail.logistics}</View>
                  <View>
                    <AtButton
                      type="primary"
                      size="small"
                      onClick={this.copyText.bind(
                        this,
                        this.state.orderDetail.logistics,
                      )}
                    >
                      复制
                    </AtButton>
                  </View>
                </View>
              </View>
            </View>
          )}
          <View className="codeArea">
            <View className="title">已为您分配序号：</View>
            <View className="myCode">
              {this.state.activityItems.map((item, index) => {
                return <View className="codeItem">{item.luckNum}</View>;
              })}
            </View>
            <View className="title">中奖序号：</View>
            <View className="luckCode">
              {this.state.orderDetail.luckNums
                ? this.state.orderDetail.luckNums.map((item, index) => {
                    return <View className="codeItem">{item}</View>;
                  })
                : "暂未开奖"}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default OrderDetail;
