import Taro, { Component } from "@tarojs/taro";
import { View, Text, ScrollView, Picker, Input } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtActivityIndicator, AtTabs, AtTabsPane } from "taro-ui";
import { getWindowHeight } from "@utils/style";
import fetch from "@utils/request";
import { API_MY_ACTIVITY } from "@constants/api";
import "./publish-all-order.scss";
import OrderItem from "./order-item";

let i = 1;
class PublishAllOrder extends Component {
  config = {
    navigationBarTitleText: "组队订单",
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
      { title: "全部活动的订单", type: "" },
      { title: "待组队活动的订单", type: "wait_team" },
      { title: "待开奖活动的订单", type: "wait_open" },
      { title: "已完成活动的订单", type: "complete" },
    ],
  };

  componentDidShow() {
    this.onRefresh();
  }

  componentDidMount() {
    const params = this.$router.params;
    if (params.type) {
      this.state.tabList.map((item, index) => {
        if (item.type === params.type) {
          this.setState({
            current: index,
          });
        }
      });
    }
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
    this.setState(
      {
        showActivity: true,
      },
      () => {
        this.onLoad();
      },
    );
  }

  onLoad = () => {
    const self = this;
    fetch({
      url: API_MY_ACTIVITY,
      payload: [
        self.state.tabList[self.state.current].type,
        self.state.page * self.state.pagesize,
        self.state.pagesize,
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
      Taro.stopPullDownRefresh();
    });
  };

  onRefresh() {
    i = 1;
    this.setState(
      {
        dataList: [],
        page: 0,
      },
      () => {
        this.onLoad();
      },
    );
  }

  render() {
    const { dataList } = this.state;
    return (
      <View className="publish-all-order">
        <AtTabs
          current={this.state.current}
          tabList={this.state.tabList}
          onClick={this.handleClick.bind(this)}
          scroll
        >
          {this.state.tabList.map((item, index) => {
            return (
              <AtTabsPane current={this.state.current} index={index}>
                <View className="orderList">
                  {dataList.map((activity) => {
                    return (
                      <View>
                        {activity.orders.map((order) => {
                          return (
                            <OrderItem
                              key={`${order.order.id}`}
                              orderData={order.order}
                              activityData={activity.activity}
                            />
                          );
                        })}
                      </View>
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

export default PublishAllOrder;
