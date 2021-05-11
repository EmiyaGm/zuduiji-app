import Taro, { Component } from "@tarojs/taro";
import { View, ScrollView } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import * as actions from "@actions/user";
import { AtTextarea, AtButton, AtCheckbox } from "taro-ui";
import { getWindowHeight } from "@utils/style";
import fetch from "@utils/request";
import { API_ACTIVITY_SETLUCKNUMS } from "@constants/api";
import "./apply-nums.scss";

@connect((state) => state.user, { ...actions })
class ApplyNums extends Component {
  config = {
    navigationBarTitleText: "中卡信息",
  };

  state = {
    value: "",
    id: "",
    type: "",
    checkedList: [],
    checkboxOption: [],
  };

  componentDidShow() {
    const params = this.$router.params;
    if (params.id && params.type) {
      const checkboxOption = Object.keys(this.props.nbaTeams).map((item) => {
        return {
          value: this.props.nbaTeams[item].id,
          label: this.props.nbaTeams[item].name,
        };
      });
      this.setState({
        id: params.id,
        type: params.type,
        checkboxOption,
      });
    }
  }

  handleChange(value) {
    this.setState({
      value,
    });
  }

  handleCheckBoxChange(value) {
    this.setState({
      checkedList: value,
      value: value.join("\n"),
    });
  }

  setLuckNums = () => {
    const self = this;
    if (self.state.value) {
      const luckNums = self.state.value.split("\n");
      const sendValues = [];
      luckNums.map((item) => {
        if (item || item === 0) {
          sendValues.push(item);
        }
        return true;
      });
      if (sendValues.length > 0) {
        fetch({
          url: API_ACTIVITY_SETLUCKNUMS,
          payload: [self.state.id, sendValues],
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
          title: "中卡号码不合法",
          icon: "error",
        });
      }
    } else {
      Taro.showToast({
        title: "请填写中卡号码",
        icon: "error",
      });
    }
  };

  render() {
    const { type, checkboxOption, checkedList } = this.state;
    return (
      <View className="apply-nums">
        <ScrollView
          scrollY
          className="apply-nums__wrap"
          style={{ height: getWindowHeight() }}
        >
          <View className="editArea">
            <View className="title">中卡号码</View>
            <View>
              {type === "random_group" && (
                <AtCheckbox
                  options={checkboxOption}
                  selectedList={checkedList}
                  onChange={this.handleCheckBoxChange.bind(this)}
                />
              )}
              {type !== "random_group" && (
                <AtTextarea
                  value={this.state.value}
                  onChange={this.handleChange.bind(this)}
                  maxLength={200}
                  placeholder="请输入开奖号码，并用换行分隔"
                />
              )}
            </View>
            <View className="buttonArea">
              <AtButton type="primary" onClick={this.setLuckNums.bind(this)}>
                提交
              </AtButton>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default ApplyNums;
