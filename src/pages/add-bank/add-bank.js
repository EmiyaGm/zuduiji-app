import Taro, { Component } from "@tarojs/taro";
import { View, Picker } from "@tarojs/components";
import { AtForm, AtInput, AtButton, AtList, AtListItem } from "taro-ui";
import { connect } from "@tarojs/redux";
import * as actions from "@actions/user";
import fetch from "@utils/request";
import { API_WALLET_BANKBIND } from "@constants/api";
import { city } from "@utils/city";
import "./add-bank.scss";

@connect((state) => state.user, { ...actions })
class AddBank extends Component {
  config = {
    navigationBarTitleText: "添加银行卡",
  };

  state = {
    holder: "",
    no: "",
    idCard: "",
    phone: "",
    selectValue: [],
    pickerValue: [],
    cities: [],
    provinces: [],
    selector: [],
    selectorChecked: "",
    bankCode: "",
  };

  componentWillMount() {
    if (city) {
      const provinces = [];
      const cities = [];
      city.map((item) => {
        provinces.push(item);
        if (item.cities) {
          item.cities.map((i) => {
            cities.push(i);
          });
        }
      });
      this.setState({
        cities,
        provinces,
      });
    }
    if (this.props.bankNames) {
      const bankNames = [];
      this.props.bankNames.map((item) => {
        bankNames.push(item.name);
      });
      this.setState({
        selector: bankNames,
      });
    }
  }

  componentDidMount() {}

  handleChange = (key, value) => {
    this.setState({
      [key]: value,
    });
  };

  onSubmit(event) {
    const { holder, no, idCard, phone, bankCode, pickerValue } = this.state;
    if (
      !holder ||
      !no ||
      !idCard ||
      !phone ||
      pickerValue.length === 0 ||
      !bankCode
    ) {
      Taro.showToast({
        title: "请填写必填项",
        icon: "none",
      });
      return;
    }
    const sendValues = {
      holder,
      no: no.split(" ").join(""),
      idCard,
      phone,
      provCode: pickerValue[0],
      areaCode: pickerValue[1],
      bankCode,
    };
    fetch({
      url: API_WALLET_BANKBIND,
      payload: [sendValues],
      method: "POST",
      showToast: false,
      autoLogin: false,
    }).then((res) => {
      if (res) {
        Taro.navigateTo({
          url: `/pages/bank-auth/bank-auth?sendValues=${JSON.stringify(
            sendValues,
          )}`,
        });
      } else {
        Taro.showToast({
          title: "提交失败",
          icon: "error",
        });
      }
    });
  }

  handleBankChange(value) {
    const no = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    this.setState({
      no,
    });
  }

  onChange = (e) => {
    const self = this;
    let provinceCode = "";
    let cityCode = "";
    self.state.provinces.map((item) => {
      if (e.detail.value[0].indexOf(item.title) !== -1) {
        provinceCode = item.value;
      }
    });
    self.state.cities.map((item) => {
      if (e.detail.value[1].indexOf(item.title) !== -1) {
        cityCode = item.value;
      }
    });
    console.log([provinceCode, cityCode]);
    this.setState({
      selectValue: e.detail.value,
      pickerValue: [provinceCode, cityCode],
    });
  };

  onBankChange = (e) => {
    this.setState({
      selectorChecked: this.state.selector[e.detail.value],
      bankCode: this.props.bankNames[e.detail.value].id,
    });
  };

  render() {
    return (
      <View className="add-bank">
        <View className="title">添加银行卡</View>
        <View className="titleTip">请绑定持卡人本人的银行卡</View>
        <AtForm onSubmit={this.onSubmit.bind(this)}>
          <AtInput
            name="holder"
            title="持卡人"
            type="text"
            placeholder="持卡人"
            required
            value={this.state.holder}
            onChange={this.handleChange.bind(this, "holder")}
          />
          <AtInput
            name="idCard"
            title="身份证"
            type="idcard"
            placeholder="身份证"
            required
            value={this.state.idCard}
            onChange={this.handleChange.bind(this, "idCard")}
          />
          <AtInput
            name="no"
            border={false}
            title="卡号"
            type="idcard"
            placeholder="卡号"
            value={this.state.no}
            required
            onChange={this.handleBankChange.bind(this)}
          />
          <Picker
            mode="selector"
            range={this.state.selector}
            onChange={this.onBankChange}
          >
            <View class="picker">
              <Text style="color: red">*</Text>
              银行名称：
              {this.state.selectorChecked
                ? this.state.selectorChecked
                : "请选择"}
            </View>
          </Picker>
          <AtInput
            name="phone"
            title="预留手机号"
            type="phone"
            placeholder="预留手机号"
            required
            value={this.state.phone}
            onChange={this.handleChange.bind(this, "phone")}
          />
          <Picker
            mode="region"
            onChange={this.onChange}
            value={this.state.selectValue}
          >
            <View class="picker">
              <Text style="color: red">*</Text>
              开户行省市区：
              {this.state.selectValue.length > 0
                ? `${this.state.selectValue[0]}，${this.state.selectValue[1]}
              ，${this.state.selectValue[2]}`
                : "请选择"}
            </View>
          </Picker>
          <AtButton formType="submit" type="primary">
            提交
          </AtButton>
        </AtForm>
      </View>
    );
  }
}

export default AddBank;
