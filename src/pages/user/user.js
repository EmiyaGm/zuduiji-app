import Taro, { Component } from "@tarojs/taro";
import { View, Text, ScrollView } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtButton, AtCard } from "taro-ui";
import * as actions from "@actions/user";
import { getWindowHeight } from "@utils/style";
import Profile from "./profile";
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
            <View className="user__logout" onClick={this.handleLogin}>
              <Text className="user__logout-txt">切换账号</Text>
            </View>
          )}
          <View className="user__empty" />
          <AtCard extra="全部订单" title="我买的">
            这也是内容区 可以随意定义功能
          </AtCard>
          <View className="user__empty" />
          <AtCard extra="全部订单" title="我卖的">
            这也是内容区 可以随意定义功能
          </AtCard>
        </ScrollView>
      </View>
    );
  }
}

export default User;
