import Taro, { Component, getCurrentInstance } from "@tarojs/taro";
import { View, Text, ScrollView, Picker, Input } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import {
  AtForm,
  AtInput,
  AtButton,
  AtImagePicker,
  AtList,
  AtListItem,
  AtTextarea,
} from "taro-ui";
import { getWindowHeight } from "@utils/style";
import fetch from "@utils/request";
import { API_ACTIVITY_DETIL } from "@constants/api";
import Banner from "./banner";
import "./publish-detail.scss";

class PublishDetail extends Component {
  config = {
    navigationBarTitleText: "组队详情",
    enableShareAppMessage: true,
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
    return {
      title: this.state.publishDetail.name,
      path: `/pages/publish-detail/publish-detail?id=${this.state.id}`,
      imageUrl: this.state.publishDetail.images
        ? `${HOST_UPLOAD}${this.state.publishDetail.images[0]}`
        : "",
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
    Taro.showLoading({
      title: "正在打开",
    });
    Taro.downloadFile({
      url: HOST_UPLOAD + file,
      success: function(res) {
        Taro.hideLoading();
        var filePath = res.tempFilePath;
        Taro.openDocument({
          filePath: filePath,
          success: (res) => {
            console.log("打开文档成功");
          },
        });
      },
      fail: function(res) {
        Taro.hideLoading();
        Taro.showToast({
          title: "打开失败，请检查网络",
          icon: "error",
        });
      },
    });
  }

  confirmOrder(id) {
    Taro.navigateTo({
      url: `/pages/order-confirm/order-confirm?id=${id}`,
    });
  }

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
    const groupRule = {
      random_group: "随机分组",
      random_num: "随机编号",
      random_list: "随机序号",
    };
    const status = {
      wait_review: "待审核",
      review_refuse: "审核未通过",
      wait_team: "待组队",
      wait_open: "待开奖",
      complete: "已完成",
      close: "组队未成功，关闭",
    };
    const { loginInfo } = this.props;
    return (
      <View className="publish-detail">
        <ScrollView
          scrollY
          className="publish-detail__wrap"
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
              {groupRule[this.state.publishDetail.groupRule] === "随机序号" && (
                <AtListItem
                  title="序号总表"
                  extraText="查看"
                  onClick={this.openFile.bind(
                    this,
                    this.state.publishDetail.numsFile,
                  )}
                />
              )}
              <AtListItem
                title="活动状态"
                extraText={status[this.state.publishDetail.status]}
              />
            </AtList>
            <View className="introduceArea">
              <View>活动介绍：</View>
              {this.state.publishDetail.introduce}
            </View>
            {this.state.publishDetail.noticeContent && (
              <View className="noticeArea">
                <View className="noticeTitle">
                  <View>正在开奖：</View>
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
                {this.state.publishDetail.noticeContent}
              </View>
            )}
          </View>
          <View className="descArea"></View>
          {this.state.publishDetail.status === "wait_team" && (
            <View className="bottomArea at-row">
              <View className="share at-col at-col-4">
                <AtButton type="primary" openType="share">
                  分享
                </AtButton>
              </View>
              <View className="buy at-col at-col-8">
                <AtButton
                  type="primary"
                  onClick={this.confirmOrder.bind(this, this.state.id)}
                >
                  报名参加
                </AtButton>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
}

export default PublishDetail;
