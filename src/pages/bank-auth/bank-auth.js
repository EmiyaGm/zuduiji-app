import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtForm, AtInput, AtButton } from "taro-ui";
import fetch from "@utils/request";
import { API_WALLET_BANKBINDCONFIRM, API_WALLET_BANKBIND } from "@constants/api";
import phoneAuth from "@assets/phone-auth.png";
import "./bank-auth.scss";

class BankAuth extends Component {
  config = {
    navigationBarTitleText: "身份验证",
  };

  state = {
    code: "",
    disabled: false,
    second: 60,
    sendValues: "",
  };

  componentDidMount() {
    const params = this.$router.params;
    if (params.sendValues) {
      this.setState({
        sendValues: params.sendValues,
        disabled: true,
      });
      // 倒计时
      const timer = setInterval(() => {
        if (this.state.second > 0) {
          this.setState({
            second: this.state.second - 1,
          });
        } else {
          this.setState({
            second: 60,
            disabled: false,
          });
          clearInterval(timer);
        }
      }, 1000);
    }
  }

  handleChange(value) {
    this.setState({
      code: value,
    });
  }
  onSubmit(event) {
    if (!this.state.code) {
      Taro.showToast({
        title: "请填写验证码",
        icon: "none",
      });
      return;
    }
    fetch({
      url: API_WALLET_BANKBINDCONFIRM,
      payload: [this.state.code],
      method: "POST",
      showToast: false,
      autoLogin: false,
    }).then((res) => {
      if (res) {
        Taro.showToast({
          title: "绑定成功",
          icon: "success",
        });
        Taro.navigateBack({ delta: 2 });
      } else {
        Taro.showToast({
          title: "绑定失败",
          icon: "error",
        });
      }
    });
  }

  sendCode() {
    if (this.state.disabled) return;
    this.setState({
      disabled: true,
    });
    // 倒计时
    const timer = setInterval(() => {
      if (this.state.second > 0) {
        this.setState({
          second: this.state.second - 1,
        });
      } else {
        this.setState({
          second: 60,
          disabled: false,
        });
        clearInterval(timer);
      }
    }, 1000);
    this.reSend();
  }

  reSend() {
    const { sendValues } = this.state;
    if (!sendValues) {
      Taro.showToast({
        title: "请重新填写银行卡信息",
        icon: "none",
      });
      return;
    }
    fetch({
      url: API_WALLET_BANKBIND,
      payload: [JSON.parse(sendValues)],
      method: "POST",
      showToast: false,
      autoLogin: false,
    }).then((res) => {
      if (res) {
        Taro.showToast({
          title: "发送成功",
          icon: "success",
        });
      } else {
        Taro.showToast({
          title: "发送失败",
          icon: "error",
        });
      }
    });
  }

  showTipText() {
    return this.state.disabled ? `${this.state.second}s后重试` : "发送验证码";
  }

  render() {
    return (
      <View className="bank-auth">
        <View className="imageArea">
          <Image className="titleImage" src={phoneAuth} />
        </View>
        <View className="title">为了您的账号安全，请输入验证码</View>
        <View className="titleTip">
          （验证码发送银行卡绑定手机，请注意查收）
        </View>
        <AtForm onSubmit={this.onSubmit.bind(this)}>
          <AtInput
            name="code"
            border={false}
            type="text"
            clear
            placeholder="请输入验证码"
            value={this.state.code}
            onChange={this.handleChange.bind(this)}
          >
            <View
              style={{
                color: this.state.disabled ? "#FF4949" : "",
                fontSize: "12px",
                width: "90px",
              }}
              onClick={this.sendCode.bind(this)}
            >
              {this.showTipText()}
            </View>
          </AtInput>
          <AtButton formType="submit" type="primary">
            提交
          </AtButton>
        </AtForm>
      </View>
    );
  }
}

export default BankAuth;
