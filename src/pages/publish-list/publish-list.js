import Taro, { Component } from "@tarojs/taro";
import { View, Text, ScrollView, Picker, Input } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtActivityIndicator } from "taro-ui";
import { getWindowHeight } from "@utils/style";
import fetch from "@utils/request";
import { API_ACTIVITY_USERACTIVITYLIST } from "@constants/api";
import "./publish-list.scss";
import PublishItem from "./publish-item";

let i = 1;
class PublishList extends Component {
  config = {
    navigationBarTitleText: "寻找组队",
    enablePullDownRefresh: true,
    onReachBottomDistance: 50,
    enableShareAppMessage: true,
  };

  onShareAppMessage(res) {
    const shareModel = res.target.dataset.sharemodel;
    return {
      title: shareModel.name,
      path: `/pages/publish-detail/publish-detail?id=${shareModel.id}`,
      imageUrl: shareModel.images ? `${HOST_UPLOAD}${shareModel.images[0]}` : ''
    };
  }

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
    }, () => {
      this.onLoad();
    });
  }

  onLoad = () => {
    const self = this;
    fetch({
      url: API_ACTIVITY_USERACTIVITYLIST,
      payload: [
        {
          start: self.state.page * self.state.pagesize,
          size: self.state.pagesize,
        },
      ],
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
      Taro.stopPullDownRefresh();
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

  render() {
    return (
      <View className="publish-list">
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

export default PublishList;
