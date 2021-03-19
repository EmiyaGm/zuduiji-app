import Taro, { Component } from "@tarojs/taro";
import { View, Text, ScrollView, Picker, Input } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import {
  AtActivityIndicator,
  AtButton,
  AtTabs,
  AtTabsPane,
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtModalAction,
  AtInput,
} from "taro-ui";
import { getWindowHeight } from "@utils/style";
import fetch from "@utils/request";
import {
  API_WALLET_BALANCE,
  API_WALLET_LIST,
  API_WALLET_APPLY,
} from "@constants/api";
import WithdrawItem from "./withdraw-item";
import * as actions from "@actions/user";
import "./my-wallet.scss";

let i = 1;
@connect((state) => state.user, { ...actions })
class MyWallet extends Component {
  config = {
    navigationBarTitleText: "我的钱包",
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
      { title: "未审核", type: "wait_review" },
      { title: "审核通过", type: "pass" },
      { title: "审核拒绝", type: "fail" },
    ],
    balanceData: {},
    amount: 0,
    isApplyShow: false,
  };

  componentDidMount() {
    this.getBalance();
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

  getBalance() {
    const self = this;
    fetch({
      url: API_WALLET_BALANCE,
      payload: [],
      method: "POST",
      showToast: false,
      autoLogin: false,
    }).then((res) => {
      if (res) {
        self.setState({
          balanceData: res,
        });
      }
    });
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
      url: API_WALLET_LIST,
      payload: [
        {
          start: self.state.page * self.state.pagesize,
          size: self.state.pagesize,
          status: this.state.tabList[this.state.current].type,
          userId: self.props.loginInfo.account.id,
          type: this.state.tabList[this.state.current].type ? 'withdraw' : ''
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

  changeAmount = (value) => {
    this.setState({
      amount: value,
    });
  };

  applyShow = (isShow) => {
    this.setState({
      isApplyShow: isShow,
    });
  };

  walletApply = () => {
    const self = this;
    if (self.state.amount) {
      fetch({
        url: API_WALLET_APPLY,
        payload: [self.state.amount * 100],
        method: "POST",
        showToast: false,
        autoLogin: false,
      }).then((res) => {
        if (res) {
          Taro.showToast({
            title: "申请成功",
            icon: "success",
          });
        } else {
          Taro.showToast({
            title: "申请失败",
            icon: "error",
          });
        }
        self.applyShow(false);
      });
    } else {
      Taro.showToast({
        title: "请先填写提现金额",
      });
    }
  };

  render() {
    const { dataList, balanceData, isApplyShow } = this.state;
    return (
      <View className="my-wallet">
        <View className="balanceArea">
          <View className="total">
            <View>总资产</View>
            <View>{balanceData.total ? balanceData.total / 100 : 0}</View>
          </View>
          <View className="balance">
            <View>可用资产</View>
            <View>{balanceData.balance ? balanceData.balance / 100 : 0}</View>
          </View>
          <View className="frozen">
            <View>冻结资产</View>
            <View>{balanceData.frozen ? balanceData.frozen / 100 : 0}</View>
          </View>
        </View>
        <View className="applyArea">
          <AtButton type="primary" onClick={this.applyShow.bind(this, true)}>
            申请提现
          </AtButton>
          <AtModal isOpened={isApplyShow}>
            <AtModalHeader>请输入提现金额</AtModalHeader>
            <AtModalContent>
              {isApplyShow && (
                <AtInput
                  name="logistics"
                  title="金额"
                  type="digit"
                  placeholder="金额"
                  value={this.state.amount}
                  onChange={this.changeAmount.bind(this)}
                />
              )}
            </AtModalContent>
            <AtModalAction>
              <Button onClick={this.applyShow.bind(this, false)}>取消</Button>
              <Button onClick={this.walletApply.bind(this)}>确定</Button>
            </AtModalAction>
          </AtModal>
        </View>
        <AtTabs
          current={this.state.current}
          tabList={this.state.tabList}
          onClick={this.handleClick.bind(this)}
          scroll
        >
          {this.state.tabList.map((item, index) => {
            return (
              <AtTabsPane current={this.state.current} index={index}>
                <View className="withdrawList">
                  {dataList.map((withdraw, index2) => {
                    return (
                      <WithdrawItem
                        withdrawData={withdraw}
                        key={`${withdraw.userId + index2}`}
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

export default MyWallet;
