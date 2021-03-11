import Taro, { Component } from "@tarojs/taro";
import { View, Text, ScrollView, Picker, Input } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import {
  AtButton,
  AtList,
  AtListItem,
  AtInput,
  AtInputNumber,
  AtAvatar,
} from "taro-ui";
import fetch from "@utils/request";
import {
  API_ACTIVITY_DETIL,
  API_ACTIVITY_ORDER,
  API_ADDRESS_LIST,
} from "@constants/api";
import { getWindowHeight } from "@utils/style";
import defaultAvatar from "@assets/default-avatar.png";
import "./order-confirm.scss";

class OrderConfirm extends Component {
  config = {
    navigationBarTitleText: "订单确认",
  };

  state = {
    id: "",
    publishtDetail: {},
    num: 1,
    totalAmount: 0,
    remark: "",
    addressInfo: {},
  };

  componentDidMount() {
    const params = this.$router.params;
    if (params.id) {
      this.setState({
        id: params.id,
      });
      this.getDetail(params.id);
      this.getAddress();
    }
  }

  handleRemarkChange(value) {
    this.setState({
      remark: value,
    });
    // 在小程序中，如果想改变 value 的值，需要 `return value` 从而改变输入框的当前值
    return value;
  }

  getDetail(id) {
    const self = this;
    fetch({
      url: API_ACTIVITY_DETIL,
      payload: [id],
      method: "POST",
      showToast: false,
      autoLogin: false,
    }).then((res) => {
      if (res && res.activity) {
        const totalAmount =
          this.state.num * res.activity.price +
          (res.activity.fare ? res.activity.fare : 0);
        self.setState({
          publishtDetail: res.activity,
          totalAmount,
        });
      }
    });
  }

  getAddress = () => {
    const self = this;
    fetch({
      url: API_ADDRESS_LIST,
      payload: [],
      method: "POST",
      showToast: false,
      autoLogin: false,
    }).then((res) => {
      if (res) {
        self.setState({
          addressInfo: res,
        });
      } else {
        Taro.showToast({
          title: "暂无数据",
          icon: "none",
        });
      }
    });
  };

  handleChange = (num) => {
    const totalAmount =
      num * this.state.publishtDetail.price +
      (this.state.publishtDetail.fare ? this.state.publishtDetail.fare : 0);
    this.setState({
      num,
      totalAmount,
    });
  };

  payOrder = () => {
    const self = this;
    if (this.state.addressInfo.address) {
      fetch({
        url: API_ACTIVITY_ORDER,
        payload: [
          {
            activityId: this.state.id,
            num: this.state.num,
            remark: this.state.remark,
          },
        ],
        method: "POST",
        showToast: false,
        autoLogin: false,
      }).then((res) => {
        if (res) {
          if (res.payInfo) {
            if (res.payInfo.expend && res.payInfo.expend.pay_info) {
              const payInfo = JSON.parse(res.payInfo.expend.pay_info);
              Taro.requestPayment({
                ...payInfo,
                success: () => {
                  Taro.showToast({
                    title: "支付成功",
                    icon: "success",
                  });
                  if (res.order && res.order.activityId) {
                    Taro.redirectTo({
                      url: `/pages/apply-success/apply-success?id=${res.order.activityId}`,
                    });
                  }
                },
                fail: () => {
                  Taro.showToast({
                    title: "支付失败",
                    icon: "error",
                  });
                  if (res.order && res.order.id) {
                    Taro.redirectTo({
                      url: `/pages/order-detail/order-detail?id=${res.order.id}`,
                    });
                  }
                },
              });
            } else {
              Taro.showToast({
                title: "生成支付失败",
                icon: "error",
              });
              if (res.order && res.order.activityId) {
                Taro.redirectTo({
                  url: `/pages/order-detail/order-detail?id=${res.order.id}`,
                });
              }
            }
          } else {
            Taro.showToast({
              title: "生成支付失败",
              icon: "error",
            });
            if (res.order && res.order.activityId) {
              Taro.redirectTo({
                url: `/pages/order-detail/order-detail?id=${res.order.id}`,
              });
            }
          }
        } else {
          Taro.showToast({
            title: "生成订单失败",
            icon: "error",
          });
        }
      });
    } else {
      Taro.showModal({
        title: "设置收货地址",
        content: "请先设置自己的收货地址",
      }).then((res) => {
        if (res.confirm) {
          Taro.navigateTo({
            url: "/pages/edit-address/edit-address",
          });
        }
      });
    }
  };

  notice = () => {
    wx.requestSubscribeMessage({
      tmplIds: [
        "ltd0x1AtVHBlIiuF5S46Ed2osQCITRIJM98Y0uUbnnk",
        "IRbJ73aUzQGQt18XxrmkJZC0kWbcWqAEIXvNZ5lxwHg",
      ],
      success: (rep) => {
        if (
          rep["ltd0x1AtVHBlIiuF5S46Ed2osQCITRIJM98Y0uUbnnk"] === "accept" ||
          rep["IRbJ73aUzQGQt18XxrmkJZC0kWbcWqAEIXvNZ5lxwHg"] === "accept"
        ) {
          Taro.showToast({
            title: "订阅成功",
            icon: "success",
          });
        } else {
          Taro.showToast({
            title: "订阅失败",
            icon: "error",
          });
        }
      },
      fail: () => {
        Taro.showToast({
          title: "订阅失败",
          icon: "error",
        });
      },
    });
  };

  render() {
    return (
      <View className="order-confirm">
        <ScrollView
          scrollY
          className="order-confirm__wrap"
          style={{ height: getWindowHeight() }}
        >
          <View className="addressArea">
            <View className="addressTitle">
              <View>
                <View className="at-icon at-icon-map-pin"></View>
              </View>
              <View>{this.state.addressInfo.address}</View>
            </View>
            <View className="addressContent">
              <View>
                {this.state.addressInfo.name} {this.state.addressInfo.phone}
              </View>
              <View>{this.state.addressInfo.address}</View>
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
                ￥ {this.state.publishtDetail.price / 100}
                <Text className="number">x1</Text>
              </View>
            </View>
          </View>
          <View className="infoArea">
            <View className="infos">
              <View className="infoItem">
                <View className="first">数量</View>
                <View className="second">
                  <AtInputNumber
                    min={1}
                    max={this.state.publishtDetail.num}
                    step={1}
                    value={this.state.num}
                    onChange={this.handleChange.bind(this)}
                  />
                </View>
              </View>
            </View>
            <AtList>
              <AtListItem
                title="邮费"
                extraText={
                  this.state.publishtDetail.fare
                    ? `￥ ${this.state.publishtDetail.fare / 100}`
                    : "免运费"
                }
              />
              <AtInput
                name="remark"
                title="留言"
                type="text"
                placeholder="填写留言"
                value={this.state.remark}
                onChange={this.handleRemarkChange.bind(this)}
              />
              <AtListItem
                title="合计"
                extraText={`￥ ${this.state.totalAmount / 100}`}
              />
            </AtList>
          </View>
          <View className="orderTip">
            <AtList hasBorder={false}>
              <AtListItem
                title="订阅提醒"
                extraText="立即订阅"
                hasBorder={false}
                onClick={this.notice.bind(this)}
              />
            </AtList>
          </View>
          <View className="descArea">
            <View>注意事项：</View>
            <View>
              为保证能及时获取最新未读消息和活动信息提醒，请点击按钮订阅提醒，建议勾选总是保持以上选择并允许
            </View>
          </View>
          <View className="payArea at-row">
            <View className="price at-col at-col-4">
              合计：<Text>￥ {this.state.totalAmount / 100}</Text>
            </View>
            <View className="at-col at-col-8">
              <AtButton type="primary" onClick={this.payOrder.bind(this)}>
                立即支付
              </AtButton>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default OrderConfirm;
