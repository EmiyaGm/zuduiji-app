const isH5 = process.env.CLIENT_ENV === 'h5'

const HOST = '"https://51panini.com"'

const HOST_UPLOAD = '"https://51panini.com/upload/"'

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
