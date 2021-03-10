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
    publishtDetail: {},
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
              image: HOST_UPLOAD + item,
              rank: index,
            };
          });
        }
        self.setState({
          publishtDetail: res.activity,
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
                ￥ {this.state.publishtDetail.price / 100}
              </View>
              <View className="fare">
                {this.state.publishtDetail.fare
                  ? `运费：￥ ${this.state.publishtDetail.fare / 100}`
                  : "免运费"}
              </View>
            </View>
            <View className="name">{this.state.publishtDetail.name}</View>
          </View>
          <View className="infoArea">
            <AtList>
              <AtListItem
                title="组队进度"
                extraText={`${
                  this.state.publishtDetail.joinNum
                    ? this.state.publishtDetail.joinNum
                    : 0
                }/${
                  this.state.publishtDetail.num
                    ? this.state.publishtDetail.num
                    : 0
                }`}
              />
              <AtListItem
                title="分配规则"
                extraText={groupRule[this.state.publishtDetail.groupRule]}
              />
              <AtListItem
                title="开卡时间"
                extraText="人齐就开"
                note={moment(this.state.publishtDetail.openTime * 1000).format(
                  "YYYY-MM-DD HH:mm:ss",
                )}
              />
              <AtListItem
                title="序号总表"
                extraText="查看"
                onClick={this.openFile.bind(
                  this,
                  this.state.publishtDetail.numsFile,
                )}
              />
            </AtList>
            <View className="introduceArea">
              <View>活动介绍：</View>
              {this.state.publishtDetail.introduce}
            </View>
            {this.state.publishtDetail.noticeContent && (
              <View className="noticeArea">
                <View>正在开奖：</View>
                {this.state.publishtDetail.noticeContent}
              </View>
            )}
          </View>
          <View className="descArea"></View>
          {this.state.publishtDetail.status === "wait_team" && (
            <View className="bottomArea at-row">
              <View className="share at-col at-col-4">
                <AtButton type="primary">分享</AtButton>
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
