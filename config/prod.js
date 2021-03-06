const isH5 = process.env.CLIENT_ENV === 'h5'

const HOST = '"http://zuduiji.simoncode.top"'

const HOST_UPLOAD = '"http://zuduiji.simoncode.top/upload/"'

module.exports = {
  env: {
    NODE_ENV: '"production"'
  },
  defineConstants: {
    HOST,
    HOST_UPLOAD,
  },
  weapp: {},
  h5: {
    publicPath: '/zuduiji-weapp'
  }
}
