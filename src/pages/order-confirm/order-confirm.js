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
import fetch from "@utils/request";
import { API_ACTIVITY_DETIL } from "@constants/api";
import { getWindowHeight } from "@utils/style";
import "./order-confirm.scss";

class OrderConfirm extends Component {
  config = {
    navigationBarTitleText: "订单确认",
  };

  state = {
    id: "",
    publishtDetail: {},
  };

  componentDidMount() {
    const params = this.$router.params;
    if (params.id) {
      this.setState({
        id: params.id,
      });
      this.getDetail(params.id);
    }
  }

  getDetail(id) {
    const self = this;
    fetch({
      url: API_ACTIVITY_DETIL,
      payload: [id],
      method: "POST",
      showToast: false,
      autoLogin: false,
    }).then((res) => {
      if (res && res.activity) {
        self.setState({
          publishtDetail: res.activity,
        });
      }
    });
  }

  render() {
    return (
      <View className="order-confirm">
        <ScrollView
          scrollY
          className="order-confirm__wrap"
          style={{ height: getWindowHeight() }}
        >
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
        </ScrollView>
      </View>
    );
  }
}

export default OrderConfirm;
