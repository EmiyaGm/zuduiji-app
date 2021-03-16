import Taro, { Component } from "@tarojs/taro";
import { View, Text, ScrollView, Picker, Input } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtAvatar, AtButton } from "taro-ui";
import moment from "moment";
import { getWindowHeight } from "@utils/style";
import fetch from "@utils/request";
import { API_BUSINESS_REVIEW, API_BUSINESS_LIST } from "@constants/api";
import "./admin-apply-detail.scss";

class AdminApplyDetail extends Component {
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
      url: API_BUSINESS_LIST,
      payload: ["", [id], 0, 1],
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

  review = (status, id) => {
    const self = this;
    Taro.showModal({
      title: "用户申请",
      content: status === "pass" ? "确认通过？" : "确认拒绝",
    }).then((res) => {
      if (res.confirm) {
        fetch({
          url: API_BUSINESS_REVIEW,
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

  render() {
    const { data } = this.state;
    return (
      <View className="admin-apply-detail">
        <ScrollView
          scrollY
          className="admin-apply-detail__wrap"
          style={{ height: getWindowHeight() }}
        >
          <View className="userInfo">
            <View className="title">用户信息</View>
            <View className="content">
              <View>
                <View className="avatar">
                  <AtAvatar
                    image={data.account ? data.account.avatarUrl : ""}
                  ></AtAvatar>
                </View>
                <View className="role">{this.getRole(data.account ? data.account.role : '')}</View>
              </View>
              <View className="infoContent">
                <View className="name">{data.account.nickName}</View>
                <View className="phone">{data.account.phone}</View>
                <View className="userId">用户Id：{data.account.id}</View>
                <View className="address"></View>
              </View>
            </View>
          </View>
          <View className="applyInfo">
            <View className="title">入驻申请</View>
            <View className="content">
              <View>
                申请时间：
                {data.business ? moment(data.business.createTime * 1000).format(
                  "YYYY-MM-DD HH:mm:ss",
                ) : ''}
              </View>
              <View>
                <View>审核：</View>
                {data.business && data.business.status === "never" && (
                  <View>
                    <AtButton
                      size="small"
                      type="primary"
                      onClick={this.review.bind(this, "pass")}
                      className="passButton"
                    >
                      通过
                    </AtButton>
                    <AtButton
                      size="small"
                      type="primary"
                      onClick={this.review.bind(this, "fail")}
                    >
                      拒绝
                    </AtButton>
                  </View>
                )}
              </View>
            </View>
          </View>
          <View className="statusInfo">
            <View className="title">状态</View>
            <View className="content">
              {this.getStatus(data.business ? data.business.status : '')}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default AdminApplyDetail;
