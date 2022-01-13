// const webpack = require('webpack')
module.exports = {
    devServer:{
        port:8080, // 启动端口
        open:true  // 启动后是否自动打开网页
    },
    publicPath: "./",
    // 关闭线上源码
    productionSourceMap: false,
    chainWebpack: (config) => {
      const svgRule = config.module.rule('svg');
    
      svgRule.uses.clear();
    
      svgRule
        .use('babel-loader')
        .loader('babel-loader')
        .end()
        .use('vue-svg-loader')
        .loader('vue-svg-loader');
    },
    //1. 需先删除默认配置中处理svg
    // chainWebpack: (config) => {
    //   config.module.rules.delete("svg"); 
    // },
    // // 2.配置loader
    // configureWebpack: {
    //   module: {
    //     rules: [
    //       {
    //         test: /\.svg$/,
    //         loader: "vue-svg-loader",
    //       },
    //     ],
    //   },
    // },
    // chainWebpack: config => {
    //   config.plugin('provide').use(webpack.ProvidePlugin, [{
    //     $: 'jquery',
    //     jquery: 'jquery',
    //     jQuery: 'jquery',
    //     'window.jQuery': 'jquery'
    //   }])
    // }
}