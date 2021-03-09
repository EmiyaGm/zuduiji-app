import Taro, { Component } from "@tarojs/taro";
import { View, Text, ScrollView, Picker, Input } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtForm, AtInput, AtButton } from "taro-ui";
import { getWindowHeight } from "@utils/style";
import fetch from "@utils/request";
import { API_ADDRESS_ADDRESS, API_ADDRESS_LIST } from "@constants/api";
import "./edit-address.scss";

class EditAddress extends Component {
  config = {
    navigationBarTitleText: "编辑地址",
  };

  state = {
    id: "",
    name: "",
    phone: "",
    address: "",
  };

  componentDidMount() {
    const params = this.$router.params;
    if (params.id) {
      this.setState(
        {
          id: params.id,
        },
        () => {
          this.getAddress();
        },
      );
    }
  }

  getAddress = () => {
    const self = this;
    fetch({
      url: API_ADDRESS_LIST,
      payload: [],
      method: "POST",
      showToast: false,
      autoLogin: false,
    }).then((res) => {
      if (res) {
        self.setState({
          name: res.name,
          phone: res.phone,
          address: res.address,
        });
      } else {
        Taro.showToast({
          title: "暂无数据",
          icon: "none",
        });
      }
    });
  };

  handleChange = (key, value) => {
    this.setState({
      [key]: value,
    });
  };

  onSubmit(event) {
    const { name, phone, address } = this.state;
    if (name && phone && address) {
      let sendValues = {
        name,
        phone,
        address,
      };
      if (this.state.id) {
        sendValues = {
          ...sendValues,
          id: this.state.id,
        };
      }
      fetch({
        url: API_ADDRESS_ADDRESS,
        payload: [sendValues],
        method: "POST",
        showToast: false,
        autoLogin: false,
      }).then((res) => {
        if (res) {
          Taro.showToast({
            title: "提交成功",
            icon: "none",
          });
          Taro.navigateBack({ delta: 1 });
        } else {
          Taro.showToast({
            title: "提交失败",
            icon: "error",
          });
        }
      });
    } else {
      Taro.showToast({
        title: "请输入地址信息内容",
        icon: "none",
      });
    }
  }
  onReset(event) {
    this.setState({
      name: "",
      phone: "",
      address: "",
      detail: "",
    });
  }

  render() {
    return (
      <View className="address-list">
        <ScrollView
          scrollY
          className="address-list__wrap"
          style={{ height: getWindowHeight() }}
        >
          <AtForm
            onSubmit={this.onSubmit.bind(this)}
            onReset={this.onReset.bind(this)}
          >
            <AtInput
              name="name"
              title="联系人"
              type="text"
              placeholder="输入联系人"
              value={this.state.name}
              onChange={this.handleChange.bind(this, "name")}
            />
            <AtInput
              name="phone"
              title="手机号码"
              type="number"
              placeholder="输入手机号码"
              value={this.state.phone}
              onChange={this.handleChange.bind(this, "phone")}
            />
            <AtInput
              name="address"
              title="配送地址"
              type="text"
              placeholder="输入配送地址"
              value={this.state.address}
              onChange={this.handleChange.bind(this, "address")}
            />
            <AtButton formType="submit" className="submitButton">提交</AtButton>
            <AtButton formType="reset">重置</AtButton>
          </AtForm>
        </ScrollView>
      </View>
    );
  }
}

export default EditAddress;
