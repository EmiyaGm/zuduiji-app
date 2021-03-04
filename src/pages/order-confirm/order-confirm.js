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
import "./order-confirm.scss";

class OrderConfirm extends component {
  config = {
    navigationBarTitleText: "订单确认",
  };

  state = {};

  render() {
    return (
      <View className="order-confirm">
        <View className="addressArea"></View>
        <View className="goodsArea">
          <View className="price"></View>
          <View className="name"></View>
        </View>
        <View className="infoArea">
          <AtList>
            <AtListItem title="数量" extraText="详细信息" />
            <AtListItem title="邮费" extraText="详细信息" />
            <AtListItem title="留言" extraText="详细信息" />
            <AtListItem title="合计" extraText="详细信息" />
          </AtList>
        </View>
        <View className="descArea"></View>
      </View>
    );
  }
}

export default OrderConfirm;
