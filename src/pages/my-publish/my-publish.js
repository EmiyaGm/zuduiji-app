import Taro, { Component } from "@tarojs/taro";
import { View, Text, ScrollView, Picker, Input } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtActivityIndicator } from "taro-ui";
import { getWindowHeight } from "@utils/style";
import fetch from "@utils/request";
import { API_MY_ACTIVITY } from "@constants/api";
import "./my-publish.scss";
import PublishItem from "./publish-item";

let i = 1;
class MyPublish extends Component {
  config = {
    navigationBarTitleText: "我发起的组队",
    enablePullDownRefresh: true,
    onReachBottomDistance: 50,
  };

  state = {
    page: 0,
    pagesize: 10,
    showActivity: false,
    dataList: [],
  };

  componentDidMount() {
    this.onLoad();
  }

  // 监听下拉刷新
  onPullDownRefresh() {
    this.onRefresh();
  }
  // 监听上拉触底
  onReachBottom() {
    i++;
    this.setState({
      showActivity: true,
    });
    this.onLoad();
  }

  onLoad = () => {
    const self = this;
    fetch({
      url: API_MY_ACTIVITY,
      payload: [self.state.page * self.state.pagesize, self.state.pagesize],
      method: "POST",
      showToast: false,
      autoLogin: false,
    }).then((res) => {
      if (res) {
        if (Array.isArray(res) && res.length > 0) {
          self.setState({
            dataList: [...self.state.dataList, ...res],
            page: self.state.page + 1,
          });
        } else {
          self.setState({
            showActivity: false,
          });
        }
      }
    });
  };

  onRefresh() {
    i = 1;
    this.setState({
      dataList: [],
      page: 0,
    });
    this.onLoad();
  }

  render() {
    return (
      <View className="my-publish">
        <View className="publishList">
          {this.state.dataList.map((item, index) => {
            return <PublishItem key={`${item.id}`} publishData={item} />;
          })}
        </View>
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
      </View>
    );
  }
}

export default MyPublish;
