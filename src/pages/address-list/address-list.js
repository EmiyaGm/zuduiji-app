import Taro, { Component } from "@tarojs/taro";
import { View, Text, ScrollView, Picker, Input } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtActivityIndicator, AtButton } from "taro-ui";
import { getWindowHeight } from "@utils/style";
import fetch from "@utils/request";
import { API_ADDRESS_LIST } from "@constants/api";
import "./address-list.scss";
import AddressItem from "./address-item";

let i = 1;
class AddressList extends Component {
  config = {
    navigationBarTitleText: "地址管理",
  };

  state = {
    page: 0,
    pagesize: 10,
    showActivity: false,
    dataList: [],
  };

  componentShow() {
    this.onLoad();
  }

  onLoad = () => {
    const self = this;
    fetch({
      url: API_ADDRESS_LIST,
      payload: [],
      method: "POST",
      showToast: false,
      autoLogin: false,
    }).then((res) => {
      if (res) {
        self.setState({
          dataList: [res],
        });
      } else {
        Taro.showToast({
          title: "暂无数据",
          icon: "none",
        });
      }
    });
  };

  onRefresh() {
    i = 1;
    this.setState({
      dataList: [],
      page: 0,
    }, () => {
      this.onLoad();
    });
  }

  addAddress = () => {
    Taro.navigateTo({
      url: "/pages/edit-address/edit-address",
    });
  };

  render() {
    return (
      <View className="address-list">
        <ScrollView
          scrollY
          className="address-list__wrap"
          style={{ height: getWindowHeight() }}
        >
          <View className="addressList">
            {this.state.dataList.map((item, index) => {
              return <AddressItem key={`${item.id}`} addressData={item} />;
            })}
          </View>
          {this.state.dataList.length === 0 && (
            <AtButton type="primary" onClick={this.addAddress.bind(this)}>
              新增地址
            </AtButton>
          )}
          {this.state.showActivity && (
            <View
              style={{
                display: "flex",
                justifyContent: "center",
                paddingTop: "10px",
                paddingBottom: "10px",
              }}
            >
              <AtActivityIndicator></AtActivityIndicator>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
}

export default AddressList;
