import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { API_BUSINESS_REVIEW } from "@constants/api";
import fetch from "@utils/request";
import EditIcon from "@assets/editIcon.png";
import "./index.scss";

export default class AddressItem extends Component {
  static defaultProps = {
    addressData: {},
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

  review = (status, id) => {
    const self = this;
    Taro.showModal({
      title: "用户申请",
      content: status === "pass" ? "确认通过？" : "确认拒绝",
    }).then((res) => {
      if (res.confirm) {
        fetch({
          url: API_BUSINESS_REVIEW,
          payload: [id, status, ""],
          method: "POST",
          showToast: false,
          autoLogin: false,
        }).then((res) => {
          if (res) {
            Taro.showToast({
              title: "操作成功",
              icon: "success",
            });
          } else {
            Taro.showToast({
              title: "操作失败",
              icon: "error",
            });
          }
        });
      }
    });
  };

  goEdit = (id) => {
    Taro.navigateTo({
      url: `/pages/edit-address/edit-address?id=${id}`,
    });
  };

  render() {
    const { addressData } = this.props;
    return (
      <View className="address-item">
        <View className="content">
          <View className="nameArea">
            <View className="name">
              <Text>{addressData.name}</Text>
              <Text className="phone">{addressData.phone}</Text>
            </View>
            <View className="address">{addressData.address}</View>
          </View>
          <View
            className="editIcon"
            onClick={this.goEdit.bind(this, addressData.id)}
          >
            <Image className="editIcon" src={EditIcon} />
          </View>
        </View>
      </View>
    );
  }
}
