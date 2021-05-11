import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, ScrollView } from "@tarojs/components";
import { Loading } from "@components";
import { connect } from "@tarojs/redux";
import * as actions from "@actions/home";
import { AtGrid } from "taro-ui";
import { dispatchCartNum } from "@actions/cart";
import { getWindowHeight } from "@utils/style";
import searchIcon from "./assets/search.png";
import "./home.scss";

@connect((state) => state.home, { ...actions, dispatchCartNum })
class Home extends Component {
  config = {
    navigationBarTitleText: "组队鸡",
  };

  state = {
    loaded: false,
  };

  componentDidMount() {
    // NOTE 暂时去掉不适配的内容
    this.setState({ loaded: true });
  }

  handlePrevent = () => {
    Taro.showToast({
      title: "暂不可用",
      icon: "none",
    });
  };

  handleGrid = (item, index) => {
    if (index === 0) {
      Taro.navigateTo({
        url: "/pages/publish-list/publish-list",
      });
    } else {
      Taro.showToast({
        title: "暂不可用",
        icon: "none",
      });
    }
  };

  render() {
    if (!this.state.loaded) {
      return <Loading />;
    }

    return (
      <View className="home">
        <View className="home__search">
          <View className="home__search-wrap" onClick={this.handlePrevent}>
            <Image className="home__search-img" src={searchIcon} />
            <Text className="home__search-txt">{"搜索卡片、卡包、活动"}</Text>
          </View>
        </View>
        <ScrollView
          scrollY
          className="home__wrap"
          onScrollToLower={() => {}}
          style={{ height: getWindowHeight() }}
        >
          <View>
            <AtGrid
              columnNum="2"
              onClick={this.handleGrid}
              data={[
                {
                  image:
                    "https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png",
                  value: "在线组队",
                },
                {
                  image:
                    "https://img20.360buyimg.com/jdphoto/s72x72_jfs/t15151/308/1012305375/2300/536ee6ef/5a411466N040a074b.png",
                  value: "卡价查询",
                },
                {
                  image:
                    "https://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png",
                  value: "店家列表",
                },
                {
                  image:
                    "https://img12.360buyimg.com/jdphoto/s72x72_jfs/t10660/330/203667368/1672/801735d7/59c85643N31e68303.png",
                  value: "直播列表",
                },
              ]}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default Home;
