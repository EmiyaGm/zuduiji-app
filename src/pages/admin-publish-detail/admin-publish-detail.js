import Taro, { Component, getCurrentInstance } from "@tarojs/taro";
import { View, Text, ScrollView, Picker, Input } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtButton, AtList, AtListItem } from "taro-ui";
import moment from "moment";
import { getWindowHeight } from "@utils/style";
import fetch from "@utils/request";
import { API_ACTIVITY_DETIL, API_ACTIVITY_ADMINREVIEWACTIVITY } from "@constants/api";
import Banner from "./banner";
import "./admin-publish-detail.scss";

class AdminPublishDetail extends Component {
  config = {
    navigationBarTitleText: "组队详情",
  };

  state = {
    id: "",
    publishDetail: {},
    orders: [],
    images: [],
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

  onShareAppMessage(res) {
    if (res.from === "button") {
      // 来自页面内转发按钮
      console.log(res.target);
    }
    return {
      title: this.state.publishDetail.name,
      path: `/publish-page/publish-detail?id=${this.state.id}`,
    };
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
        let images = [];
        if (res.activity.images) {
          images = res.activity.images.map((item, index) => {
            return {
              img: HOST_UPLOAD + item,
              rank: index,
            };
          });
        }
        self.setState({
          publishDetail: res.activity,
          orders: res.orders,
          images,
        });
      }
    });
  }

  openFile(file) {
    Taro.downloadFile({
      url: HOST_UPLOAD + file,
      success: function(res) {
        var filePath = res.tempFilePath;
        Taro.openDocument({
          filePath: filePath,
          success: (res) => {
            console.log("打开文档成功");
          },
        });
      },
    });
  }

  review = (status, id) => {
    const self = this;
    Taro.showModal({
      title: "活动申请",
      content: status === "pass" ? "确认通过？" : "确认拒绝",
    }).then((res) => {
      if (res.confirm) {
        fetch({
          url: API_ACTIVITY_ADMINREVIEWACTIVITY,
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

  render() {
    const groupRule = {
      random_group: "随机分组",
      random_num: "随机编号",
      random_list: "随机序号",
    };
    const { publishDetail } = this.state;
    return (
      <View className="admin-publish-detail">
        <ScrollView
          scrollY
          className="admin-publish-detail__wrap"
          style={{ height: getWindowHeight() }}
        >
          <View className="imagesArea">
            <Banner list={this.state.images} />
          </View>
          <View className="priceArea">
            <View className="price">
              <View style={{ color: "red" }}>
                ￥ {this.state.publishDetail.price / 100}
              </View>
              <View className="fare">
                {this.state.publishDetail.fare
                  ? `运费：￥ ${this.state.publishDetail.fare / 100}`
                  : "免运费"}
              </View>
            </View>
            <View className="name">{this.state.publishDetail.name}</View>
          </View>
          {publishDetail.status === "wait_review" && !hideButton && (
            <View className="actionArea">
              <Text
                className="actionItem"
                onClick={this.review.bind(this, "pass", publishDetail.id)}
              >
                审核通过
              </Text>
              <Text
                className="actionItem"
                onClick={this.review.bind(this, "fail", publishDetail.id)}
              >
                审核拒绝
              </Text>
            </View>
          )}
          <View className="orderArea">
            <View className="title">订单信息</View>
            <View className="at-row">
              <View className="at-col">
                <View
                  style={{
                    color: "lightblue",
                  }}
                >
                  0
                </View>
                <View>订单数</View>
              </View>
              <View className="at-col">
                <View style={{ color: "red" }}>
                  {(publishDetail.num * publishDetail.price) / 100}
                </View>
                <View>订单总额</View>
              </View>
              <View className="at-col">
                <View>{publishDetail.joinNum ? publishDetail.joinNum : 0}</View>
                <View>已卖出</View>
              </View>
              <View className="at-col">
                <View style={{ color: "red" }}>
                  {publishDetail.joinNum
                    ? publishDetail.num - publishDetail.joinNum
                    : publishDetail.num}
                </View>
                <View>剩余数</View>
              </View>
            </View>
          </View>
          <View className="infoArea">
            <AtList>
              <AtListItem
                title="组队进度"
                extraText={`${
                  this.state.publishDetail.joinNum
                    ? this.state.publishDetail.joinNum
                    : 0
                }/${
                  this.state.publishDetail.num
                    ? this.state.publishDetail.num
                    : 0
                }`}
              />
              <AtListItem
                title="分配规则"
                extraText={groupRule[this.state.publishDetail.groupRule]}
              />
              <AtListItem
                title="开卡时间"
                extraText="人齐就开"
                note={moment(this.state.publishDetail.openTime * 1000).format(
                  "YYYY-MM-DD HH:mm:ss",
                )}
              />
              <AtListItem
                title="序号总表"
                extraText="查看"
                onClick={this.openFile.bind(
                  this,
                  this.state.publishDetail.numsFile,
                )}
              />
            </AtList>
            <View className="introduceArea">
              <View>活动介绍：</View>
              {this.state.publishDetail.introduce}
            </View>
            {this.state.publishDetail.noticeContent && (
              <View className="noticeArea">
                <View>正在开奖：</View>
                {this.state.publishDetail.noticeContent}
              </View>
            )}
          </View>
          <View className="descArea"></View>
        </ScrollView>
      </View>
    );
  }
}

export default AdminPublishDetail;