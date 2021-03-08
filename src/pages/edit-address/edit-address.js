import Taro, { Component } from "@tarojs/taro";
import { View, Text, ScrollView, Picker, Input } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtForm, AtInput } from "taro-ui";
import { getWindowHeight } from "@utils/style";
import fetch from "@utils/request";
import { API_MY_ACTIVITY } from "@constants/api";
import "./edit-address.scss";

class EditAddress extends Component {
  config = {
    navigationBarTitleText: "编辑地址",
  };

  state = {
    name: "",
    phone: "",
    address: "",
    detail: "",
  };

  handleChange(value) {
    this.setState({
      value,
    });
  }
  onSubmit(event) {}
  onReset(event) {
    this.setState({
      name: "",
      phone: "",
      address: "",
      detail: "",
    });
  }

  componentDidMount() {}

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
              value={this.state.value}
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
              title="所在地区"
              type="text"
              placeholder="输入所在地区"
              value={this.state.address}
              onChange={this.handleChange.bind(this, "address")}
            />
            <AtInput
              name="detail"
              title="详细地址"
              type="text"
              placeholder="输入详细地址"
              value={this.state.detail}
              onChange={this.handleChange.bind(this, "detail")}
            />
            <AtButton formType="submit">提交</AtButton>
            <AtButton formType="reset">重置</AtButton>
          </AtForm>
        </ScrollView>
      </View>
    );
  }
}

export default EditAddress;
