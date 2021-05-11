// NOTE H5 端使用 devServer 实现跨域，需要修改 package.json 的运行命令，加入环境变量
const isH5 = process.env.CLIENT_ENV === "h5";
const HOST = '"https://51panini.com"';
const HOST_UPLOAD = '"https://51panini.com/upload/"';

module.exports = {
  env: {
    NODE_ENV: '"development"',
  },
  defineConstants: {
    HOST,
    HOST_UPLOAD,
  },
  weapp: {},
  h5: {},
};
