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
import "./party-success.scss";

class PartySuccess extends component {
  config = {
    navigationBarTitleText: "组队成功",
  };

  state = {};

  render() {
    return (
      <View className="party-success">
        <View className="successArea"></View>
        <View className="orderTip"></View>
        <View className="tipArea"></View>
      </View>
    );
  }
}

export default PartySuccess;
