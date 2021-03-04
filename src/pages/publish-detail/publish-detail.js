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
import "./publish-detail.scss";

class PublishDetail extends component {
  config = {
    navigationBarTitleText: "组队详情",
  };

  state = {};

  render() {
    return (
      <View className="publish-detail">
        <View className="imagesArea"></View>
        <View className="priceArea">
          <View className="price"></View>
          <View className="name"></View>
        </View>
        <View className="infoArea">
          <AtList>
            <AtListItem title="组队进度" extraText="详细信息" />
            <AtListItem title="分配规则" extraText="详细信息" />
            <AtListItem title="开卡时间" extraText="详细信息" />
            <AtListItem title="序号总表" extraText="详细信息" />
          </AtList>
        </View>
        <View className="descArea"></View>
      </View>
    );
  }
}

export default PublishDetail;

