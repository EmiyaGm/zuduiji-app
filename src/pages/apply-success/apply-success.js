import Taro, { Component } from "@tarojs/taro";
import { View, ScrollView } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtButton, AtList, AtListItem } from "taro-ui";
import { USER_ACTIVITY_NOTICE, USER_ORDER_NOTICE } from "@utils/noticeTmpl";
import { getWindowHeight } from "@utils/style";
import successIcon from "@assets/success-icon.png";
import "./apply-success.scss";

class ApplySuccess extends Component {
  config = {
    navigationBarTitleText: "报名成功",
  };

  state = {
    id: "",
    orderId: "",
  };

  componentDidMount() {
    const params = this.$router.params;
    if (params.id && params.orderId) {
      this.setState({
        id: params.id,
        orderId: params.orderId,
      });
      this.notice();
    }
  }

  notice = () => {
    wx.requestSubscribeMessage({
      tmplIds: [USER_ACTIVITY_NOTICE, USER_ORDER_NOTICE],
      success: (rep) => {
        if (
          rep[USER_ACTIVITY_NOTICE] === "accept" ||
          rep[USER_ORDER_NOTICE] === "accept"
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

  goDetail = () => {
    Taro.redirectTo({
      url: `/pages/order-detail/order-detail?id=${this.state.orderId}`,
    });
  };

  render() {
    return (
      <View className="apply-success">
        <ScrollView
          scrollY
          className="apply-success__wrap"
          style={{ height: getWindowHeight() }}
        >
          <View className="successArea">
            <View className="imageArea">
              <Image className="successIcon" src={successIcon} />
            </View>
            <View className="title">报名成功</View>
            <View className="tip">
              <View>1.组队成功待随机分配完序号后，将向您发送序号;</View>
              <View>2.商家在组队成功后将发起直播开卡</View>
            </View>
          </View>
          <View className="buttonArea">
            <AtButton
              type="primary"
              onClick={this.goDetail.bind()}
            >
              订单详情
            </AtButton>
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
          <View className="tipArea">
            <View>注意事项：</View>
            <View>
              为保证能及时获取最新未读消息和活动信息提醒，请点击按钮订阅提醒，建议勾选总是保持以上选择并允许
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default ApplySuccess;
