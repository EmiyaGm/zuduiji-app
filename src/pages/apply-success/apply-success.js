import Taro, { Component } from "@tarojs/taro";
import { View, ScrollView } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import {
  AtList,
  AtListItem,
} from "taro-ui";
import { getWindowHeight } from "@utils/style";
import successIcon from "@assets/success-icon.png";
import "./apply-success.scss";

class ApplySuccess extends Component {
  config = {
    navigationBarTitleText: "报名成功",
  };

  state = {
    id: "",
  };

  componentDidMount() {
    const params = this.$router.params;
    if (params.id) {
      this.setState({
        id: params.id,
      });
    }
  }

  notice = () => {
    wx.requestSubscribeMessage({
      tmplIds: [
        "ltd0x1AtVHBlIiuF5S46Ed2osQCITRIJM98Y0uUbnnk",
        "IRbJ73aUzQGQt18XxrmkJZC0kWbcWqAEIXvNZ5lxwHg",
      ],
      success: (rep) => {
        if (
          rep["ltd0x1AtVHBlIiuF5S46Ed2osQCITRIJM98Y0uUbnnk"] === "accept" ||
          rep["IRbJ73aUzQGQt18XxrmkJZC0kWbcWqAEIXvNZ5lxwHg"] === "accept"
        ) {
          Taro.showToast({
            title: "订阅成功",
            icon: "success",
          });
        } else {
          Taro.showToast({
            title: "订阅失败",
            icon: "error",
          });
        }
      },
      fail: () => {
        Taro.showToast({
          title: "订阅失败",
          icon: "error",
        });
      },
    });
  };

  render() {
    return (
      <View className="apply-success">
        <ScrollView
          scrollY
          className="apply-success__wrap"
          style={{ height: getWindowHeight() }}
        >
          <View className="successArea">
            <View className="imageArea">
              <Image className="successIcon" src={successIcon} />
            </View>
            <View className="title">报名成功</View>
            <View className="tip">
              <View>1.组队成功待随机分配完序号后，将向您发送序号;</View>
              <View>2.商家在组队成功后将发起直播开卡</View>
            </View>
          </View>
          <View className="orderTip">
            <AtList hasBorder={false}>
              <AtListItem
                title="订阅提醒"
                extraText="立即订阅"
                hasBorder={false}
                onClick={this.notice.bind(this)}
              />
            </AtList>
          </View>
          <View className="tipArea">
            <View>注意事项：</View>
            <View>
              为保证能及时获取最新未读消息和活动信息提醒，请点击按钮订阅提醒，建议勾选总是保持以上选择并允许
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default ApplySuccess;
