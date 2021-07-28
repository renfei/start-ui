module.exports = {
    transpileDependencies: [
        'vuetify'
    ],
    devServer: {
        proxy: {
            '/v1': {//需要代理的接口
                target: 'http://127.0.0.1:8081', //目标服务器
                changeOrigin: true,//是否跨域
                pathRewrite: {
                    '^/v1': '/'//重定向
                }
            }
        },
    }
}
