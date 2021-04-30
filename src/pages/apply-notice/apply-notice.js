import Taro, { Component } from "@tarojs/taro";
import { View, Text, ScrollView, Picker, Input } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtTextarea, AtButton } from "taro-ui";
import { getWindowHeight } from "@utils/style";
import fetch from "@utils/request";
import { API_ACTIVITY_NOTICE } from "@constants/api";
import "./apply-notice.scss";

class ApplyList extends Component {
  config = {
    navigationBarTitleText: "直播信息",
  };

  state = {
    value: "",
    id: "",
  };

  componentDidShow() {
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

  notice = () => {
    const self = this;
    Taro.showModal({
      title: "发送开奖提醒",
      content: "确认发送开奖提醒？",
    }).then((res) => {
      if (res.confirm) {
        fetch({
          url: API_ACTIVITY_NOTICE,
          payload: [self.state.id, self.state.value, 10],
          method: "POST",
          showToast: false,
          autoLogin: false,
        }).then((res) => {
          if (res) {
            Taro.showToast({
              title: "发送成功",
              icon: "success",
            });
            Taro.navigateBack({ delta: 1 });
          } else {
            Taro.showToast({
              title: "发送失败",
              icon: "error",
            });
          }
        });
      }
    });
  };

  render() {
    return (
      <View className="apply-notice">
        <ScrollView
          scrollY
          className="apply-notice__wrap"
          style={{ height: getWindowHeight() }}
        >
          <View className="editArea">
            <View className="title">组队直播口令</View>
            <View>
              <AtTextarea
                value={this.state.value}
                onChange={this.handleChange.bind(this)}
                maxLength={200}
                placeholder="请输入组队直播口令"
              />
            </View>
            <View className="buttonArea">
              <AtButton type="primary" onClick={this.notice.bind(this)}>
                提交
              </AtButton>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default ApplyList;
