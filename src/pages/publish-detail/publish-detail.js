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
import moment from "moment";
import { getWindowHeight } from "@utils/style";
import fetch from "@utils/request";
import { API_ACTIVITY_DETIL } from "@constants/api";
import Banner from "./banner";
import "./publish-detail.scss";

class PublishDetail extends Component {
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

  onShareAppMessage (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: this.state.publishDetail.name,
      path: `/publish-page/publish-detail?id=${this.state.id}`
    }
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

  confirmOrder(id) {
    Taro.navigateTo({
      url: `/pages/order-confirm/order-confirm?id=${id}`,
    });
  }

  render() {
    const groupRule = {
      random_group: "随机分组",
      random_num: "随机编号",
      random_list: "随机序号",
    };
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
          {this.state.publishDetail.status === "wait_team" && (
            <View className="bottomArea at-row">
              <View className="share at-col at-col-4">
                <AtButton type="primary" openType="share">分享</AtButton>
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
