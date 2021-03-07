import Taro, { Component } from "@tarojs/taro";
import { View, Text, ScrollView } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtButton, AtCard, AtList, AtListItem } from "taro-ui";
import * as actions from "@actions/user";
import { getWindowHeight } from "@utils/style";
import { API_BUSINESS_APPLY } from "@constants/api";
import fetch from "@utils/request";
import Profile from "./profile";
import waitSend from "@assets/wait-send.png";
import waitPay from "@assets/wait-pay.png";
import waitReceive from "@assets/wait-receive.png";
import "./user.scss";

@connect((state) => state.user, { ...actions })
class User extends Component {
  config = {
    navigationBarTitleText: "个人中心",
  };

  componentDidShow() {}

  handleLogin = () => {
    Taro.navigateTo({
      url: "/pages/user-login/user-login",
    });
  };

  handleLogout = () => {
    this.props.dispatchLogout();
  };

  myPublish() {
    Taro.navigateTo({
      url: "/pages/my-publish/my-publish",
    });
  }

  myOrder() {
    Taro.navigateTo({
      url: "/pages/my-order/my-order",
    });
  }

  orderList(e, type) {
    e.stopPropagation();
    Taro.navigateTo({
      url: `/pages/my-order/my-order?type=${type}`,
    });
  }

  handleApply = () => {
    fetch({ url: API_BUSINESS_APPLY, showToast: false, autoLogin: false }).then(
      (res) => {
        if (res) {
          Taro.showToast({
            title: "申请成功！",
            icon: "none",
          });
        } else {
          Taro.showToast({
            title: "申请失败，请稍后再试",
            icon: "none",
          });
        }
      },
    );
  };

  adminPublish = () => {
    Taro.navigateTo({
      url: "/pages/admin-publish/admin-publish",
    });
  };

  adminApply = () => {
    Taro.navigateTo({
      url: "/pages/admin-apply/admin-apply",
    });
  };

  adminUser = () => {
    Taro.navigateTo({
      url: "/pages/admin-user/admin-user",
    });
  };

  render() {
    const { userInfo, loginInfo } = this.props;

    return (
      <View className="user">
        <ScrollView
          scrollY
          className="user__wrap"
          style={{ height: getWindowHeight() }}
        >
          <Profile userInfo={userInfo} loginInfo={loginInfo} />
          {loginInfo.token && (
            <View className="user__logout" onClick={this.handleLogout}>
              <Text className="user__logout-txt">退出登录</Text>
            </View>
          )}
          <View className="user__empty" />
          <AtCard
            extra="全部订单"
            title="我参与的"
            onClick={this.myOrder.bind(this)}
          >
            <View className="at-row">
              <View
                className="at-col at-col-4 statusText"
                onClick={(e) => {
                  this.orderList(e, "wait_pay");
                }}
              >
                <View>
                  <Image className="statusIcon" src={waitPay} />
                </View>
                <View>待支付</View>
              </View>
              <View
                className="at-col at-col-4 statusText"
                onClick={(e) => {
                  this.orderList(e, "bingo");
                }}
              >
                <View>
                  <Image className="statusIcon" src={waitSend} />
                </View>
                <View>待发货</View>
              </View>
              <View
                className="at-col at-col-4 statusText"
                onClick={(e) => {
                  this.orderList(e, "send");
                }}
              >
                <View>
                  <Image className="statusIcon" src={waitReceive} />
                </View>
                <View>待收货</View>
              </View>
            </View>
          </AtCard>
          <View className="user__empty" />
          <AtCard
            extra="全部活动"
            title="我发起的"
            onClick={this.myPublish}
          ></AtCard>
          <View className="functionArea">
            <AtList>
              {loginInfo.account && loginInfo.account.role === "ADMIN" ? (
                <View>
                  <AtListItem
                    title="商家申请管理"
                    arrow="right"
                    onClick={this.adminApply.bind(this)}
                  />
                  <AtListItem
                    title="用户管理"
                    arrow="right"
                    onClick={this.adminUser.bind(this)}
                  />
                  <AtListItem
                    title="活动管理"
                    arrow="right"
                    onClick={this.adminPublish.bind(this)}
                  />
                </View>
              ) : (
                ""
              )}
              {loginInfo.account && loginInfo.account.role === "USER" ? (
                <AtListItem
                  title="入驻商家"
                  arrow="right"
                  onClick={this.handleApply.bind(this)}
                />
              ) : (
                ""
              )}
              <AtListItem title="收货地址" arrow="right" />
              <AtListItem title="联系客服" arrow="right" />
            </AtList>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default User;
