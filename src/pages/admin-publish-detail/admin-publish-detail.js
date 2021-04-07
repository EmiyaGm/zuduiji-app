import Taro, { Component, getCurrentInstance } from "@tarojs/taro";
import { View, Text, ScrollView, Picker, Input } from "@tarojs/components";
import { connect } from "@tarojs/redux";
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
            </AtList>
            <View className="introduceArea">
              <View>活动介绍：</View>
              {this.state.publishDetail.introduce}
            </View>
            {this.state.userLuckInfos.length > 0 && (
              <View className="numList">
                <View className="canvasArea">
                  <Canvas
                    style="width: 100%; height: 660px;"
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
