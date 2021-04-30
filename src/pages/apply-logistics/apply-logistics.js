import Taro, { Component } from "@tarojs/taro";
import { View, Text, ScrollView, Picker, Input } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtButton, AtInput, AtList, AtListItem } from "taro-ui";
import { getWindowHeight } from "@utils/style";
import fetch from "@utils/request";
import { API_ACTIVITY_LOGISTICS } from "@constants/api";
import "./apply-logistics.scss";

class ApplyLogistics extends Component {
  config = {
    navigationBarTitleText: "物流信息",
  };

  state = {
    value: "",
    id: "",
    selector: ["顺丰快递", "中通快递", "圆通快递", "韵达快递", "EMS", "其他"],
    selectorChecked: "顺丰快递",
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

  setLogistics = () => {
    const self = this;
    if (self.state.value) {
      fetch({
        url: API_ACTIVITY_LOGISTICS,
        payload: [self.state.id, self.state.value, self.state.selectorChecked],
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
        title: "请输入快递单号",
        icon: "none",
      });
    }
  };

  onChange = (e) => {
    this.setState({
      selectorChecked: this.state.selector[e.detail.value],
    });
  };

  render() {
    return (
      <View className="apply-logistics">
        <ScrollView
          scrollY
          className="apply-logistics__wrap"
          style={{ height: getWindowHeight() }}
        >
          <View className="editArea">
            <View className="title">物流信息</View>
            <View>
              <Picker
                mode="selector"
                range={this.state.selector}
                onChange={this.onChange}
              >
                <AtList>
                  <AtListItem
                    title="快递公司"
                    extraText={this.state.selectorChecked}
                  />
                </AtList>
              </Picker>
              <AtInput
                title="物流单号"
                type="text"
                value={this.state.value}
                onChange={this.handleChange.bind(this)}
                placeholder="请输入物流单号"
              />
            </View>
            <View className="buttonArea">
              <AtButton type="primary" onClick={this.setLogistics.bind(this)}>
                提交
              </AtButton>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default ApplyLogistics;
