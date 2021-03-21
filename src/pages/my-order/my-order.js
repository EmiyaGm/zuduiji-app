import Taro, { Component } from "@tarojs/taro";
import { View, Text, ScrollView, Picker, Input } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtActivityIndicator, AtTabs, AtTabsPane } from "taro-ui";
import { getWindowHeight } from "@utils/style";
import fetch from "@utils/request";
import { API_ACTIVITY_ORDERLIST } from "@constants/api";
import OrderItem from "./order-item";
import "./my-order.scss";

let i = 1;
class MyOrder extends Component {
  config = {
    navigationBarTitleText: "我参与的",
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
      { title: "待支付", type: "wait_pay" },
      { title: "待开奖", type: "wait_open" },
      { title: "待发货", type: "bingo" },
      { title: "已完成", type: "unbingo" },
      { title: "已关闭", type: "cancel" },
    ],
  };

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

  componentDidShow() {
    const params = this.$router.params;
    if (params.type) {
      this.state.tabList.map((item, index) => {
        if (item.type === params.type) {
          this.setState(
            {
              current: index,
            },
            () => {
              this.onRefresh();
            },
          );
        }
      });
    } else {
      this.onRefresh();
    }
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
      url: API_ACTIVITY_ORDERLIST,
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
      <View className="my-order">
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
                  {dataList.map((order, index) => {
                    return (
                      <OrderItem
                        key={`${order.orders[0].order.id}`}
                        orderData={order.orders[0].order}
                        activityData={order.activity}
                      />
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

export default MyOrder;
