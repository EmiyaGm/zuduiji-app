import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtAvatar, AtIcon } from "taro-ui";
import defaultAvatar from "@assets/default-avatar.png";
import "./index.scss";

export default class ApplyItem extends Component {
  static defaultProps = {
    applyData: {
      account: {},
      business: {},
      address: {},
    },
  };

  state = {
    hideButton: false,
  };

  getStatus(status) {
    switch (status) {
      case "never":
        return "未审核";
      case "pass":
        return "审核通过";
      case "fail":
        return "审核拒绝";
      default:
        return "";
    }
  }

  goDetail = (id) => {
    Taro.navigateTo({
      url: `/pages/admin-apply-detail/admin-apply-detail?id=${id}`,
    });
  };

  render() {
    const { applyData } = this.props;
    return (
      <View
        className="apply-item"
        onClick={this.goDetail.bind(this, applyData.account.id)}
      >
        <View className="headContent">
          <View className="nameArea">
            <View className="avatar">
              <AtAvatar image={applyData.account ? applyData.account.avatarUrl : defaultAvatar}></AtAvatar>
            </View>
            <View className="name">{applyData.account.nickName}</View>
          </View>
          <View className="bottomArea">
            <View style="color: #597EF7">
              {
                applyData.business.status === 'never' ? '等待审核' : ''
              }
            </View>
            <View>
              <AtIcon value='chevron-right' color='#909090' size="12"></AtIcon>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
