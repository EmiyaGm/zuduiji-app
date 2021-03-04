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

class PublishSuccess extends component {
  config = {
    navigationBarTitleText: "报名成功",
  };

  state = {};

  render() {
    return (
      <View className="publish-success">
        <View className="successArea"></View>
        <View className="orderTip"></View>
        <View className="tipArea"></View>
      </View>
    );
  }
}

export default PublishSuccess;
