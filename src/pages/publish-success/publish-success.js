import Taro, { Component } from "@tarojs/taro";
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
import "./publish-success.scss";

class PublishSuccess extends Component {
  config = {
    navigationBarTitleText: "报名成功",
  };

  state = {};

  render() {
    return (
      <View className="publish-success">
        <ScrollView
          scrollY
          className="publish-success__wrap"
          style={{ height: getWindowHeight() }}
        >
          <View className="successArea"></View>
          <View className="orderTip"></View>
          <View className="tipArea"></View>
        </ScrollView>
      </View>
    );
  }
}

export default PublishSuccess;
