import Taro, { Component, getCurrentInstance } from "@tarojs/taro";
import { View, Text, ScrollView, Canvas } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import * as actions from "@actions/user";
import { AtButton, AtList, AtListItem } from "taro-ui";
import moment from "moment";
import { getWindowHeight } from "@utils/style";
import fetch from "@utils/request";
import {
  API_ACTIVITY_DETIL,
  API_ACTIVITY_ADMINREVIEWACTIVITY,
} from "@constants/api";
import Banner from "./banner";
import "./admin-publish-detail.scss";

@connect((state) => state.user, { ...actions })
class AdminPublishDetail extends Component {
  config = {
    navigationBarTitleText: "组队详情",
    enableShareAppMessage: true,
  };

  state = {
    id: "",
    publishDetail: {},
    orders: [],
    images: [],
    userLuckInfos: [],
  };

  componentDidShow() {
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
        self.setState(
          {
            publishDetail: res.activity,
            orders: res.orders,
            images,
            userLuckInfos: res.userLuckInfos ? res.userLuckInfos : [],
          },
          () => {
            if (res.userLuckInfos) {
              this.createImage();
            }
          },
        );
      }
    });
  }

  createImage() {
    const selectorQuery = Taro.createSelectorQuery();
    const canvas = Taro.createCanvasContext("canvas", this.$scope);
    let width = 0;
    selectorQuery
      .in(this.$scope)
      .select(".canvas")
      .boundingClientRect()
      .exec((res) => {
        const dom = res[0];
        if (dom && dom.width) {
          width = dom.width / 2;
          canvas.setFontSize(16);
          canvas.setFillStyle("black");
          canvas.setTextAlign("center");
          canvas.fillText(this.state.publishDetail.name, width, 20);
          canvas.fillText(
            moment(this.state.publishDetail.teamStartTime * 1000).format(
              "YYYY-MM-DD HH:mm:ss",
            ),
            width,
            40,
          );
          canvas.setTextAlign("left");
          if (this.state.userLuckInfos) {
            this.state.userLuckInfos.map((item, index) => {
              canvas.fillText(
                `${item.luckNum}.${item.nickName}`,
                0,
                (index + 3) * 20,
              );
            });
          }
          if (this.state.publishDetail.groupRule === "random_group") {
            Object.keys(this.props.nbaTeams).map((item, index) => {
              canvas.fillText(
                `${this.props.nbaTeams[item].id}.${this.props.nbaTeams[item].name}`,
                width,
                (index + 3) * 20,
              );
            });
          }
          canvas.setTextAlign("center");
          canvas.setFontSize(48);
          canvas.setFillStyle("rgba(188, 188, 188, 0.5)");
          canvas.fillText("组队鸡", width, 130);
          canvas.fillText("组队鸡", width, 330);
          canvas.fillText("组队鸡", width, 530);
          canvas.draw();
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

  saveCanvas() {
    const self = this;
    Taro.canvasToTempFilePath({
      canvasId: "canvas",
      success: function(res) {
        // 获得图片临时路径
        const url = res.tempFilePath;
        Taro.getSetting({
          complete() {},
        })
          .then((res) => {
            if (res.authSetting["scope.writePhotosAlbum"]) {
              Taro.saveImageToPhotosAlbum({
                filePath: url,
                success: () => {
                  Taro.showToast({
                    title: "保存成功",
                    icon: "success",
                  });
                },
                fail: () => {
                  Taro.showToast({
                    title: "保存失败",
                    icon: "error",
                  });
                },
              });
            } else {
              Taro.authorize({
                scope: "scope.writePhotosAlbum",
              }).then(() => {
                Taro.saveImageToPhotosAlbum({
                  filePath: url,
                  success: () => {
                    Taro.showToast({
                      title: "保存成功",
                      icon: "success",
                    });
                  },
                  fail: () => {
                    Taro.showToast({
                      title: "保存失败",
                      icon: "error",
                    });
                  },
                });
              });
            }
          })
          .catch((e) => {
            Taro.showToast({
              title: "保存失败",
              icon: "error",
            });
          });
      },
    });
  }

  render() {
    const groupRule = {
      random_group: "随机队伍",
      random_num: "随机编号",
      random_list: "随机序号",
    };
    const { publishDetail } = this.state;
    return (
      <View className="admin-publish-detail">
        <ScrollView className="admin-publish-detail__wrap">
          <View className="imagesArea">
            <Banner list={this.state.images} />
          </View>
          <View className="priceArea">
            <View className="price">
              <View style={{ color: "red" }}>
                ￥ {this.state.publishDetail.price / 100}
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
                  {publishDetail.orderNums ? publishDetail.orderNums : 0}
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
            <View className="partyArea">
              <View className="title">组队规则</View>
              <View className="infoItem">
                <View className="infoTitle">组队进度</View>
                <View className="infoContent">
                  {`${
                    this.state.publishDetail.joinNum
                      ? this.state.publishDetail.joinNum
                      : 0
                  }/${
                    this.state.publishDetail.num
                      ? this.state.publishDetail.num
                      : 0
                  }`}
                </View>
              </View>
              <View className="infoItem">
                <View className="infoTitle">组队规则</View>
                <View className="infoContent">
                  {groupRule[this.state.publishDetail.groupRule]}
                </View>
              </View>
              {groupRule[this.state.publishDetail.groupRule] === "随机序号" && (
                <View className="infoItem">
                  <View className="infoTitle">序号总表</View>
                  <View
                    className="infoContent"
                    onClick={this.openFile.bind(
                      this,
                      this.state.publishDetail.numsFile,
                    )}
                    style="color: #6FC9FF"
                  >
                    查看
                    <View className='at-icon at-icon-chevron-right'></View>
                  </View>
                </View>
              )}
              <View className="infoItem">
                <View className="infoTitle">邮费</View>
                <View className="infoContent">
                  {this.state.publishDetail.fare
                    ? `￥ ${this.state.publishDetail.fare / 100}`
                    : "免运费"}
                </View>
              </View>
              {/* <AtList>
              <AtListItem
                title="活动状态"
                extraText={status[this.state.publishDetail.status]}
              />
            </AtList> */}
            </View>
            <View className="introduceArea">
              <View className="title">组队介绍</View>
              <View className="introduceContent">
                {this.state.publishDetail.introduce}
              </View>
            </View>
            {this.state.userLuckInfos.length > 0 && (
              <View className="numList">
                <View className="canvasArea">
                  <Canvas
                    style={`width: 100%; height: ${this.state.userLuckInfos
                      .length *
                      20 +
                      48}px;`}
                    canvasId="canvas"
                    className="canvas"
                  />
                </View>
                <AtButton type="primary" onClick={this.saveCanvas.bind(this)}>
                  保存图片
                </AtButton>
              </View>
            )}
            {this.state.publishDetail.noticeContent && (
              <View className="noticeArea">
                <View className="noticeTitle">
                  <View>正在开奖</View>
                  <View
                    onClick={this.copyText.bind(
                      this,
                      this.state.publishDetail.noticeContent,
                    )}
                    className="copyNotice"
                  >
                    复制
                  </View>
                </View>
                <View>{this.state.publishDetail.noticeContent}</View>
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
