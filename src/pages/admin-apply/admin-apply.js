import Taro, { Component } from "@tarojs/taro";
import { View, Text, ScrollView, Picker, Input } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtActivityIndicator, AtTabs, AtTabsPane } from "taro-ui";
import { getWindowHeight } from "@utils/style";
import fetch from "@utils/request";
import { API_BUSINESS_REVIEW, API_BUSINESS_LIST } from "@constants/api";
import ApplyItem from "./apply-item";
import "./admin-apply.scss";

let i = 1;
class AdminApply extends Component {
  config = {
    navigationBarTitleText: "商家审核",
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
      { title: "未审核", type: "never" },
      { title: "审核通过", type: "pass" },
      { title: "审核拒绝", type: "fail" },
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
      url: API_BUSINESS_LIST,
      payload: [
        this.state.tabList[this.state.current].type,
        [],
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
        self.setState({
          showActivity: false,
        });
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
      <View className="admin-apply">
        <AtTabs
          current={this.state.current}
          tabList={this.state.tabList}
          onClick={this.handleClick.bind(this)}
          scroll
        >
          {this.state.tabList.map((item, index) => {
            return (
              <AtTabsPane current={this.state.current} index={index}>
                <View className="applyList">
                  {dataList.map((apply, index2) => {
                    return (
                      <ApplyItem applyData={apply} key={`${apply.business.id + index2}`} />
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

export default AdminApply;
