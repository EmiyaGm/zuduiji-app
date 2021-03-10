import Taro, { Component } from "@tarojs/taro";
import { View, Text, ScrollView, Picker, Input } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import {
  AtForm,
  AtInput,
  AtButton,
  AtImagePicker,
  AtList,
  AtListItem,
  AtTextarea,
} from "taro-ui";
import * as actions from "@actions/user";
import upload from "@utils/upload";
import fetch from "@utils/request";
import { API_ACTIVITY_ADD } from "@constants/api";
import moment from "moment";
import { getWindowHeight } from "@utils/style";
import "./publish.scss";

@connect((state) => state.user, { ...actions })
class Publish extends Component {
  config = {
    navigationBarTitleText: "发布组队",
  };

  state = {
    name: "",
    files: [],
    introduce: "",
    groupRule: [
      { name: "随机分组", data: "random_group" },
      { name: "随机编号", data: "random_num" },
      { name: "随机序号", data: "random_list" },
    ],
    selectorChecked: "随机分组",
    groupRuleChecked: "random_group",
    num: "",
    price: "",
    fare: "",
    images: [],
    numsFile: "",
    numsFileName: "",
    dateSel: "",
    timeSel: "",
    numMin: "",
    numMax: "",
  };

  componentDidShow() {}

  handleChange = (key, value) => {
    this.setState({
      [key]: value,
    });
  };

  onTimeChange = (e) => {
    this.setState({
      timeSel: e.detail.value,
    });
  };
  onDateChange = (e) => {
    console.log(e);
    this.setState({
      dateSel: e.detail.value,
    });
  };

  onSubmit = () => {
    const self = this;
    const { userInfo, loginInfo } = this.props;
    if (!loginInfo.token) {
      Taro.showToast({
        title: "请先登录",
        icon: "none",
      });
      return;
    } else if (loginInfo.account.role === "USER") {
      Taro.showToast({
        title: "只有商家才可以发布组队信息",
        icon: "none",
      });
      return;
    }
    if (
      !this.state.name ||
      !this.state.introduce ||
      !this.state.num ||
      !this.state.price
    ) {
      Taro.showToast({
        title: "请输入活动相关信息",
        icon: "none",
      });
      return;
    }
    if (!/^\d+(\.\d{1,2})?$/.test(this.state.price)) {
      Taro.showToast({
        title: "组队价格最多保留两位小数",
        icon: "none",
      });
      return;
    }
    if (this.state.images.length === 0 || this.state.images.length >= 9) {
      Taro.showToast({
        title: "请上传正确数量的封面图",
        icon: "none",
      });
      return;
    }
    if (!this.state.dateSel || !this.state.timeSel) {
      Taro.showToast({
        title: "请选择开卡时间",
        icon: "none",
      });
      return;
    }
    if (!this.state.numsFileName) {
      Taro.showToast({
        title: "请选择上传序号总表",
        icon: "none",
      });
      return;
    }
    if (this.state.groupRuleChecked === "random_num") {
      if (!this.state.numMin || !this.state.numMax) {
        Taro.showToast({
          title: "请填写最大最小编号",
          icon: "none",
        });
        return;
      }
    } else if (this.state.groupRuleChecked === "random_list") {
      if (!this.state.numMax) {
        Taro.showToast({
          title: "请填写最大编号",
          icon: "none",
        });
        return;
      }
    }
    const sendValues = {
      name: this.state.name,
      introduce: this.state.introduce,
      num: this.state.num,
      price: this.state.price * 100,
      images: this.state.images,
      groupRule: this.state.groupRuleChecked,
      fare: this.state.fare * 100,
      openTime:
        moment(this.state.dateSel + " " + this.state.timeSel).valueOf() / 1000,
      numsFile: this.state.numsFile,
      numMax: this.state.numMax,
      numMin: this.state.numMin,
    };
    fetch({
      url: API_ACTIVITY_ADD,
      payload: [sendValues],
      method: "POST",
      showToast: false,
      autoLogin: false,
    }).then((res) => {
      if (res) {
        if (res.id) {
          Taro.showToast({
            title: "发布成功",
            icon: "none",
          });
          self.onReset();
        }
        console.log(res);
      }
    });
  };
  onReset = () => {
    this.setState({
      name: "",
      files: [],
      introduce: "",
      selectorChecked: "随机分组",
      groupRuleChecked: "random_group",
      num: "",
      price: "",
      fare: 0,
      images: [],
      numsFile: "",
      numsFileName: "",
      dateSel: "",
      timeSel: "",
      numMax: "",
      numMin: "",
    });
  };
  onChange = (files, operationType, index) => {
    const self = this;
    if (operationType === "add") {
      Taro.showLoading({
        title: "上传中",
      });
      upload(files[files.length - 1].url)
        .then((res) => {
          Taro.hideLoading();
          if (res.data) {
            const result = JSON.parse(res.data);
            if (result && result.length === 2) {
              self.setState({ images: [...self.state.images, result[1]] });
            }
          }
        })
        .catch(() => {
          Taro.hideLoading();
        });
    } else {
      const { images } = this.state;
      const newImages = [...images];
      newImages.splice(index, 1);
      self.setState({
        images: newImages,
      });
    }
    this.setState({
      files,
    });
  };
  onFail(mes) {
    console.log(mes);
  }
  onImageClick(index, file) {
    console.log(index, file);
  }

  onSelectorChange = (e) => {
    this.setState({
      selectorChecked: this.state.groupRule[e.detail.value].name,
      groupRuleChecked: this.state.groupRule[e.detail.value].data,
      numMax: "",
      numMin: "",
    });
  };

  chooseMessageFile = (e) => {
    const self = this;
    Taro.chooseMessageFile({
      count: 1,
      type: "file",
      success: function(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = "";
        if (res.tempFiles && Array.isArray(res.tempFiles)) {
          if (res.tempFiles[0].name.indexOf(".pdf") === -1) {
            Taro.showToast({
              title: "上传文件格式错误，请上传pdf文件",
              icon: "none",
            });
            return;
          } else {
            tempFilePaths = res.tempFiles[0].path;
          }
        }
        Taro.showLoading({
          title: "上传中",
        });
        upload(tempFilePaths)
          .then((rep) => {
            Taro.hideLoading();
            if (rep.data) {
              const result = JSON.parse(rep.data);
              if (result && result.length === 2) {
                if (result[1]) {
                  self.setState({
                    numsFile: result[1],
                    numsFileName: res.tempFiles[0].name,
                  });
                } else {
                  Taro.showToast({
                    title: `上传失败 ${result[0]}`,
                    icon: "none",
                  });
                }
              }
            }
          })
          .catch((err) => {
            Taro.hideLoading();
            Taro.showToast({
              title: "上传失败",
              icon: "none",
            });
          });
      },
    });
  };

  render() {
    return (
      <View className="publish">
        <AtForm
          onSubmit={this.onSubmit.bind(this)}
          onReset={this.onReset.bind(this)}
          className="publishForm"
        >
          <View className="formItem">
            <View className="formTitle">
              <Text>活动信息</Text>
            </View>
            <AtInput
              name="name"
              title=""
              type="text"
              placeholder="请输入活动名称"
              value={this.state.name}
              onChange={this.handleChange.bind(this, "name")}
            />
            <Text>请上传封面，最多9张</Text>
            <AtImagePicker
              files={this.state.files}
              onChange={this.onChange.bind(this)}
              count={9}
              length={3}
            />
            <AtTextarea
              count={false}
              value={this.state.introduce}
              onChange={this.handleChange.bind(this, "introduce")}
              placeholder="请输入卡片介绍"
            />
          </View>
          <View className="formItem">
            <View className="formTitle">
              <Text>组队规则</Text>
            </View>
            <View>
              <Picker
                mode="selector"
                range={this.state.groupRule}
                onChange={this.onSelectorChange}
                rangeKey="name"
              >
                <AtList>
                  <AtListItem
                    title="分配规则"
                    extraText={this.state.selectorChecked}
                  />
                </AtList>
              </Picker>
            </View>
            {this.state.selectorChecked === "随机编号" && (
              <View>
                <AtInput
                  name="numMin"
                  title="最小编号"
                  type="number"
                  placeholder="最小编号"
                  value={this.state.numMin}
                  onChange={this.handleChange.bind(this, "numMin")}
                />
                <AtInput
                  name="numMax"
                  title="最大编号"
                  type="number"
                  placeholder="最大编号"
                  value={this.state.numMax}
                  onChange={this.handleChange.bind(this, "numMax")}
                />
              </View>
            )}
            {this.state.selectorChecked === "随机序号" && (
              <AtInput
                name="numMax"
                title="最大编号"
                type="number"
                placeholder="最大编号"
                value={this.state.numMax}
                onChange={this.handleChange.bind(this, "numMax")}
              />
            )}
            <AtInput
              name="num"
              title="组队数量"
              type="number"
              placeholder="1-9999"
              value={this.state.num}
              onChange={this.handleChange.bind(this, "num")}
            />
            <AtList>
              <AtListItem
                title="序号总表"
                onClick={this.chooseMessageFile.bind(this)}
                extraText={
                  this.state.numsFileName ? this.state.numsFileName : "上传"
                }
                arrow="right"
              />
            </AtList>
          </View>
          <View className="formItem">
            <View className="formTitle">
              <Text>价格设置</Text>
            </View>
            <AtInput
              name="price"
              title="组队价格"
              type="digit"
              placeholder="￥保留小数点后两位"
              value={this.state.price}
              onChange={this.handleChange.bind(this, "price")}
            />
            <AtInput
              name="fare"
              title="邮费"
              type="number"
              placeholder="输入0即免运费"
              value={this.state.fare}
              onChange={this.handleChange.bind(this, "fare")}
            />
          </View>
          <View className="formItem">
            <View className="formTitle">
              <Text>开卡设置</Text>
            </View>
            <Text>开卡时间</Text>
            <View className="page-section">
              <View>
                <Picker mode="date" onChange={this.onDateChange}>
                  <AtList>
                    <AtListItem
                      title="请选择日期"
                      extraText={this.state.dateSel}
                    />
                  </AtList>
                </Picker>
              </View>
            </View>
            <View className="page-section">
              <View>
                <Picker mode="time" onChange={this.onTimeChange}>
                  <AtList>
                    <AtListItem
                      title="请选择时间"
                      extraText={this.state.timeSel}
                    />
                  </AtList>
                </Picker>
              </View>
            </View>
          </View>

          <AtButton formType="submit" type="primary">
            提交
          </AtButton>
          <View className="publish__empty" />
          <AtButton formType="reset">重置</AtButton>
        </AtForm>
      </View>
    );
  }
}

export default Publish;
