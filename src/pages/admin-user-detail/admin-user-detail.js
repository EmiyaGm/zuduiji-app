import Taro, { Component } from "@tarojs/taro";
import { View, Text, ScrollView, Picker, Input } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtAvatar, AtButton } from "taro-ui";
import moment from "moment";
import { getWindowHeight } from "@utils/style";
import fetch from "@utils/request";
import {
  API_ACCOUNT_ACCOUNTS,
  API_ACCOUNT_SETADMIN,
  API_ACCOUNT_SETBUSINESS,
} from "@constants/api";
import "./admin-user-detail.scss";

class AdminUserDetail extends Component {
  config = {
    navigationBarTitleText: "管理商家",
  };

  state = {
    id: 0,
    data: {},
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

  getDetail = (id) => {
    const self = this;
    fetch({
      url: API_ACCOUNT_ACCOUNTS,
      payload: [[id], 0, 1, ""],
      method: "POST",
      showToast: false,
      autoLogin: false,
    }).then((res) => {
      if (res) {
        if (Array.isArray(res) && res.length > 0) {
          self.setState({
            data: res[0],
          });
        }
      } else {
        Taro.showToast({
          title: "暂无数据",
          icon: "none",
        });
      }
    });
  };

  getRole = (role) => {
    switch (role) {
      case "USER":
        return "用户";
      case "ADMIN":
        return "管理员";
      case "BUSINESS":
        return "商户";
      default:
        return "";
    }
  };

  getStatus = (status) => {
    switch (status) {
      case "pass":
        return "审核通过";
      case "never":
        return "未审核";
      case "fail":
        return "审核拒绝";
      default:
        return "";
    }
  };

  setRole(role, userId) {
    const self = this;
    Taro.showModal({
      title: "设置角色",
      content:
        role === "ADMIN" ? "确认设置该用户为管理员？" : "确认设置该用户为商户",
    }).then((res) => {
      if (res.confirm) {
        fetch({
          url:
            role === "ADMIN" ? API_ACCOUNT_SETADMIN : API_ACCOUNT_SETBUSINESS,
          payload: [userId, false],
          method: "POST",
          showToast: false,
          autoLogin: false,
        }).then((res) => {
          if (res) {
            Taro.showToast({
              title: "操作成功",
              icon: "success",
            });
            self.getDetail(self.state.id);
          } else {
            Taro.showToast({
              title: "操作失败",
              icon: "error",
            });
          }
        });
      }
    });
  }

  render() {
    const { data } = this.state;
    return (
      <View className="admin-user-detail">
        <ScrollView
          scrollY
          className="admin-user-detail__wrap"
          style={{ height: getWindowHeight() }}
        >
          <View className="userInfo">
            <View className="title">用户信息</View>
            <View className="content">
              <View>
                <View className="avatar">
                  <AtAvatar image={data.avatarUrl}></AtAvatar>
                </View>
                <View className="role">{this.getRole(data.role)}</View>
              </View>
              <View className="infoContent">
                <View className="name">{data.nickName}</View>
                <View className="phone">{data.phone}</View>
                <View className="userId">用户Id：{data.id}</View>
                <View className="address"></View>
              </View>
            </View>
          </View>
          <View className="applyInfo">
            <View className="title">操作</View>
            <View className="content">
              {data.role === "USER" && (
                <View>
                  <AtButton
                    type="primary"
                    onClick={this.setRole.bind(this, "ADMIN", data.id)}
                    className="firstButton"
                  >
                    设为管理员
                  </AtButton>
                  <AtButton
                    type="primary"
                    onClick={this.setRole.bind(this, "BUSINESS", data.id)}
                  >
                    设为商户
                  </AtButton>
                </View>
              )}
              {data.role === "ADMIN" && (
                <View>
                  <AtButton
                    type="primary"
                    onClick={this.setRole.bind(this, "BUSINESS", data.id)}
                  >
                    设为商户
                  </AtButton>
                </View>
              )}
              {data.role === "BUSINESS" && (
                <View>
                  <AtButton
                    type="primary"
                    onClick={this.setRole.bind(this, "ADMIN", data.id)}
                  >
                    设为管理员
                  </AtButton>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default AdminUserDetail;
