const isH5 = process.env.CLIENT_ENV === 'h5'

const HOST = '"http://zuduiji.simoncode.top"'

// XXX 搭了个 proxy 用于演示 prod 环境的 H5
const HOST_H5 = '"http://jsnewbee.com/taro-yanxuan/api"'
const HOST_M_H5 = '"http://jsnewbee.com/taro-yanxuan/api-m"'

module.exports = {
  env: {
    NODE_ENV: '"production"'
  },
  defineConstants: {
    HOST,
  },
  weapp: {},
  h5: {
    publicPath: '/zuduiji-weapp'
  }
}
