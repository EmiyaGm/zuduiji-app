import Taro, { Component } from "@tarojs/taro";
import { View, Text, ScrollView, Picker, Input } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtActivityIndicator } from "taro-ui";
import { getWindowHeight } from "@utils/style";
import fetch from "@utils/request";
import { API_ACCOUNT_ACCOUNTS } from "@constants/api";
import "./admin-user.scss";

let i = 1;
class AdminUser extends Component {
  config = {
    navigationBarTitleText: "用户管理",
    enablePullDownRefresh: true,
    onReachBottomDistance: 50,
  };

  state = {
    current: 0,
    page: 0,
    pagesize: 10,
    showActivity: false,
    dataList: [],
    tabList: [
      { title: "全部", type: "" },
      { title: "管理员", type: "ADMIN" },
      { title: "用户", type: "USER" },
      { title: "商户", type: "BUSINESS" },
    ],
  };

  componentDidMount() {
    this.onLoad();
  }

  handleClick(value) {
    this.setState(
      {
        current: value,
      },
      () => {
        this.onRefresh();
      },
    );
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
      url: API_ACCOUNT_ACCOUNTS,
      payload: [
        self.state.page * self.state.pagesize,
        self.state.pagesize,
        this.state.tabList[this.state.current].type,
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
    });
    this.onLoad();
  }

  render() {
    const { dataList } = this.state;
    return (
      <View className="admin-publish">
        <AtTabs
          current={this.state.current}
          tabList={this.state.tabList}
          onClick={this.handleClick.bind(this)}
          scroll
        >
          {this.state.tabList.map((item, index) => {
            return (
              <AtTabsPane current={this.state.current} index={index}>
                <View className="userList">
                  {dataList.map((item, index) => {
                    return (
                      <View>123123123123</View>
                    );
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
              </AtTabsPane>
            );
          })}
        </AtTabs>
      </View>
    );
  }
}

export default AdminUser;
