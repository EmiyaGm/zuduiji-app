import Taro, { Component } from "@tarojs/taro";
import { View, Text, ScrollView, Picker, Input } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtTextarea, AtButton } from "taro-ui";
import { getWindowHeight } from "@utils/style";
import fetch from "@utils/request";
import { API_ACTIVITY_SETLUCKNUMS } from "@constants/api";
import "./apply-nums.scss";

class ApplyNums extends Component {
  config = {
    navigationBarTitleText: "中奖信息",
  };

  state = {
    value: "",
    id: "",
  };

  componentShow() {
    const params = this.$router.params;
    if (params.id) {
      this.setState({
        id: params.id,
      });
    }
  }

  handleChange(value) {
    this.setState({
      value,
    });
  }

  setLuckNums = () => {
    const self = this;
    if (self.state.value) {
      const luckNums = self.state.value.split(",");
      if (luckNums.length > 0) {
        fetch({
          url: API_ACTIVITY_SETLUCKNUMS,
          payload: [self.state.id, luckNums],
          method: "POST",
          showToast: false,
          autoLogin: false,
        }).then((res) => {
          if (res) {
            Taro.showToast({
              title: "设置成功",
              icon: "success",
            });
            Taro.navigateBack({ delta: 1 });
          } else {
            Taro.showToast({
              title: "设置失败",
              icon: "error",
            });
          }
        });
      } else {
        Taro.showToast({
          title: "中奖号码不合法",
          icon: "error",
        });
      }
    } else {
      Taro.showToast({
        title: "请填写中奖号码",
        icon: "error",
      });
    }
  };

  render() {
    return (
      <View className="apply-nums">
        <ScrollView
          scrollY
          className="apply-nums__wrap"
          style={{ height: getWindowHeight() }}
        >
          <View className="title">中奖号码</View>
          <View>
            <AtTextarea
              value={this.state.value}
              onChange={this.handleChange.bind(this)}
              maxLength={200}
              placeholder="请输入开奖号码，并用英文逗号 ',' 做分隔"
            />
          </View>
          <View className="buttonArea">
            <AtButton type="primary" onClick={this.setLuckNums.bind(this)}>
              提交
            </AtButton>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default ApplyNums;
