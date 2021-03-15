import Taro, { Component } from "@tarojs/taro";
import { View, Text, ScrollView } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtButton, AtCard, AtList, AtListItem } from "taro-ui";
import { ButtonItem } from "@components";
import * as actions from "@actions/user";
import { getWindowHeight } from "@utils/style";
import { API_BUSINESS_APPLY, API_USER_INFO } from "@constants/api";
import fetch from "@utils/request";
import Profile from "./profile";
import waitSend from "@assets/wait-send.png";
import waitPay from "@assets/wait-pay.png";
import waitReceive from "@assets/wait-receive.png";
import businessIcon from "@assets/businessIcon.png";
import userIcon from "@assets/userIcon.png";
import activityIcon from "@assets/activityIcon.png";
import withdrawIcon from "@assets/withdrawIcon.png";
import allIcon from "@assets/allIcon.png";
import "./user.scss";

@connect((state) => state.user, { ...actions })
class User extends Component {
  config = {
    navigationBarTitleText: "个人中心",
  };

  componentDidShow() {}

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

  adminWithdraw = () => {
    Taro.navigateTo({
      url: "/pages/admin-withdraw/admin-withdraw",
    });
  };

  goAddress = () => {
    Taro.navigateTo({
      url: "/pages/address-list/address-list",
    });
  };

  myWallet = () => {
    Taro.navigateTo({
      url: "/pages/my-wallet/my-wallet",
    });
  };

  agreeAuth = (e) => {
    const { errMsg, userInfo } = e.detail ? e.detail : {};
    const self = this;
    if (errMsg === "getUserInfo:ok") {
      self.props.dispatchUser(userInfo);
      Taro.login({
        success: function(res) {
          if (res.code) {
            Taro.showLoading({
              title: "正在登录",
            });
            self.props.dispatchLogin([res.code]).then((rep) => {
              fetch({
                url: API_USER_INFO,
                payload: [
                  {
                    ...e.detail,
                    sessionKey: rep.account.sessionKey,
                  },
                ],
                method: "POST",
                showToast: false,
                autoLogin: false,
              }).then((result) => {
                if (result) {
                  self.props.dispatchUser(result);
                  Taro.hideLoading();
                  Taro.showToast({
                    title: "登录成功！",
                    icon: "none",
                  });
                }
              });
              Taro.navigateBack({ delta: 2 });
            });
          } else {
            console.log("登录失败！" + res.errMsg);
          }
        },
      });
    } else {
      Taro.showToast({
        title: "授权失败",
        icon: "none",
      });
    }
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
          {loginInfo.account && loginInfo.account.role === "ADMIN" && (
            <AtCard extra="" title="平台管理">
              <View className="at-row">
                <View
                  className="at-col at-col-3 statusText"
                  onClick={this.adminApply.bind(this)}
                >
                  <View>
                    <Image className="statusIcon" src={businessIcon} />
                  </View>
                  <View>全部商家</View>
                </View>
                <View
                  className="at-col at-col-3 statusText"
                  onClick={this.adminUser.bind(this)}
                >
                  <View>
                    <Image className="statusIcon" src={userIcon} />
                  </View>
                  <View>全部用户</View>
                </View>
                <View
                  className="at-col at-col-3 statusText"
                  onClick={this.adminPublish.bind(this)}
                >
                  <View>
                    <Image className="statusIcon" src={activityIcon} />
                  </View>
                  <View>全部活动</View>
                </View>
                <View
                  className="at-col at-col-3 statusText"
                  onClick={this.adminWithdraw.bind(this)}
                >
                  <View>
                    <Image className="statusIcon" src={withdrawIcon} />
                  </View>
                  <View>全部提现</View>
                </View>
              </View>
            </AtCard>
          )}
          <View className="user__empty" />
          <AtCard extra="" title="我参与的">
            <View className="at-row">
              <View
                className="at-col at-col-3 statusText"
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
                className="at-col at-col-3 statusText"
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
                className="at-col at-col-3 statusText"
                onClick={(e) => {
                  this.orderList(e, "send");
                }}
              >
                <View>
                  <Image className="statusIcon" src={waitReceive} />
                </View>
                <View>待收货</View>
              </View>
              <View
                className="at-col at-col-3 statusText"
                onClick={this.myOrder.bind(this)}
              >
                <View>
                  <Image className="statusIcon" src={allIcon} />
                </View>
                <View>全部订单</View>
              </View>
            </View>
          </AtCard>
          <View className="user__empty" />
          <AtCard
            extra="全部活动"
            title="我发起的"
            onClick={this.myPublish}
          ></AtCard>
          <View className="user__empty" />
          {!loginInfo.account && (
            <View className="loginArea">
              <View className="loginTip">登录后即可参与报名球星卡组队活动</View>
              <ButtonItem
                type="primary"
                text="立即登录"
                openType="getUserInfo"
                onGetUserInfo={this.agreeAuth}
              />
            </View>
          )}
          <View className="functionArea">
            <AtList>
              {loginInfo.account && loginInfo.account.role === "BUSINESS" && (
                <AtListItem
                  title="我的钱包"
                  arrow="right"
                  onClick={this.myWallet.bind(this)}
                />
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
              <AtListItem
                title="收货地址"
                arrow="right"
                onClick={this.goAddress.bind(this)}
              />
              <AtListItem title="联系客服" arrow="right" />
            </AtList>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default User;
