import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, ScrollView } from "@tarojs/components";
import { Loading } from "@components";
import { connect } from "@tarojs/redux";
import * as actions from "@actions/home";
import { AtGrid } from "taro-ui";
import { dispatchCartNum } from "@actions/cart";
import { getWindowHeight } from "@utils/style";
import Banner from "./banner";
import Policy from "./policy";
import searchIcon from "./assets/search.png";
import "./home.scss";

const RECOMMEND_SIZE = 20;

@connect((state) => state.home, { ...actions, dispatchCartNum })
class Home extends Component {
  config = {
    navigationBarTitleText: "组队机",
  };

  state = {
    loaded: false,
  };

  componentDidMount() {
    // NOTE 暂时去掉不适配的内容
    this.props.dispatchHome().then(() => {
      this.setState({ loaded: true })
    })
  }

  handlePrevent = () => {
    // XXX 时间关系，首页只实现底部推荐商品的点击
    Taro.showToast({
      title: "目前只可点击底部推荐商品",
      icon: "none",
    });
  };

  render() {
    if (!this.state.loaded) {
      return <Loading />;
    }

    const { homeInfo, searchCount, recommend, pin } = this.props;
    return (
      <View className="home">
        <View className="home__search">
          <View className="home__search-wrap" onClick={this.handlePrevent}>
            <Image className="home__search-img" src={searchIcon} />
            <Text className="home__search-txt">{"搜索卡片、卡包"}</Text>
          </View>
        </View>
        <ScrollView
          scrollY
          className="home__wrap"
          onScrollToLower={() => {}}
          style={{ height: getWindowHeight() }}
        >
          <View onClick={this.handlePrevent}>
            <Banner list={homeInfo.focus} />
            <AtGrid
              columnNum="2"
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
