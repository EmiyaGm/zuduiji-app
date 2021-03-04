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
import { getWindowHeight } from "@utils/style";
import "./publish.scss";

class Publish extends Component {
  config = {
    navigationBarTitleText: "发布组队",
  };

  state = {
    value: "",
    files: [],
    desc: "",
    selector: ["随机分配", "指定分配"],
    selectorChecked: "随机分配",
    number: "",
    price: "",
    fare: "",
  };

  componentDidShow() {}

  handleChange = (value) => {
    this.setState({
      value,
    });
  };
  onSubmit = () => {
    console.log(this.state.value);
  };
  onReset = () => {
    this.setState({
      value: "",
      files: [],
      desc: "",
    });
  };
  onChange(files) {
    this.setState({
      files,
    });
  }
  onFail(mes) {
    console.log(mes);
  }
  onImageClick(index, file) {
    console.log(index, file);
  }

  onSelectorChange = (e) => {
    this.setState({
      selectorChecked: this.state.selector[e.detail.value],
    });
  };

  chooseMessageFile = (e) => {
    Taro.chooseMessageFile({
      count: 10,
      type: "pdf",
      success: function(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths;
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
              name="value"
              title=""
              type="text"
              placeholder="请输入活动名称"
              value={this.state.value}
              onChange={this.handleChange.bind(this, "value")}
            />
            <AtImagePicker
              files={this.state.files}
              onChange={this.onChange.bind(this)}
              count={9}
              length={3}
            />
            <AtTextarea
              count={false}
              value={this.state.desc}
              onChange={this.handleChange.bind(this, "desc")}
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
                range={this.state.selector}
                onChange={this.onSelectorChange}
              >
                <AtList>
                  <AtListItem
                    title="分配规则"
                    extraText={this.state.selectorChecked}
                  />
                </AtList>
              </Picker>
            </View>
            <AtInput
              name="number"
              title="组队数量"
              type="text"
              placeholder="0-9999"
              value={this.state.number}
              onChange={this.handleChange.bind(this, "number")}
            />
            <AtInput
              name="file"
              title="序号总表"
              editable={false}
              type="text"
              placeholder="上传"
              onClick={this.chooseMessageFile.bind(this)}
            />
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
              value={this.state.number}
              onChange={this.handleChange.bind(this, "price")}
            />
            <AtInput
              name="fare"
              title="邮费"
              type="number"
              placeholder="输入0即免运费"
              value={this.state.number}
              onChange={this.handleChange.bind(this, "fare")}
            />
          </View>
          <View className="formItem">
            <View className="formTitle">
              <Text>开卡设置</Text>
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
