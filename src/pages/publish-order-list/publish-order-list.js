import Taro, { Component } from "@tarojs/taro";
import { View, Text, ScrollView, Picker, Input } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtActivityIndicator, AtTabs, AtTabsPane } from "taro-ui";
import { getWindowHeight } from "@utils/style";
import fetch from "@utils/request";
import { API_ACTIVITY_LUCKORDERLIST } from "@constants/api";
import OrderItem from "./order-item";
import "./publish-order-list.scss";

let i = 1;
class PublishOrderList extends Component {
  config = {
    navigationBarTitleText: "队伍订单",
    enablePullDownRefresh: true,
    onReachBottomDistance: 50,
  };

  state = {
    id: "",
    page: 0,
    pagesize: 10,
    showActivity: false,
    dataList: [],
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

  componentDidMount() {
    const params = this.$router.params;
    if (params.id) {
      this.setState(
        {
          id: params.id,
        },
        () => {
          this.onLoad();
        },
      );
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
    });
    this.onLoad();
  }

  onLoad = () => {
    const self = this;
    fetch({
      url: API_ACTIVITY_LUCKORDERLIST,
      payload: [
        self.state.id,
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
      <View className="publish-order-list">
        <ScrollView
          scrollY
          className="publish-order-list__wrap"
          style={{ height: getWindowHeight() }}
        >
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
        </ScrollView>
      </View>
    );
  }
}

export default PublishOrderList;
