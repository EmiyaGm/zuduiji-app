import "@tarojs/async-await";
import Taro, { Component } from "@tarojs/taro";
import { Provider } from "@tarojs/redux";

import Index from "./pages/index";

import configStore from "./store";

import "./app.scss";

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const store = configStore();

class App extends Component {
  config = {
    pages: [
      "pages/home/home",
      "pages/cate/cate",
      "pages/cate-sub/cate-sub",
      "pages/cart/cart",
      "pages/user/user",
      "pages/user-login/user-login",
      "pages/item/item",
      "pages/webview/webview",
      "pages/publish/publish",
      "pages/my-publish/my-publish",
      "pages/publish-detail/publish-detail",
      "pages/order-confirm/order-confirm",
      "pages/apply-success/apply-success",
      "pages/my-order/my-order",
      "pages/order-detail/order-detail",
      "pages/admin-publish/admin-publish",
      "pages/admin-user/admin-user",
      "pages/admin-apply/admin-apply",
      "pages/publish-order-list/publish-order-list",
      "pages/publish-list/publish-list",
    ],
    window: {
      backgroundTextStyle: "light",
      navigationBarBackgroundColor: "#fff",
      navigationBarTitleText: "组队机",
      navigationBarTextStyle: "black",
    },
    tabBar: {
      color: "#666",
      selectedColor: "#b4282d",
      backgroundColor: "#fafafa",
      borderStyle: "black",
      list: [
        {
          pagePath: "pages/home/home",
          iconPath: "./assets/tab-bar/home.png",
          selectedIconPath: "./assets/tab-bar/home-active.png",
          text: "首页",
        },
        {
          pagePath: "pages/publish/publish",
          iconPath: "./assets/tab-bar/cart.png",
          selectedIconPath: "./assets/tab-bar/cart-active.png",
          text: "发布",
        },
        {
          pagePath: "pages/user/user",
          iconPath: "./assets/tab-bar/user.png",
          selectedIconPath: "./assets/tab-bar/user-active.png",
          text: "个人",
        },
      ],
    },
  };

  componentDidMount() {}

  componentDidShow() {}

  componentDidHide() {}

  componentCatchError() {}

  componentDidCatchError() {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    );
  }
}

Taro.render(<App />, document.getElementById("app"));
