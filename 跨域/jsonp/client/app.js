const express = require('express')

// 创建服务器
const app = express()

// 当服务区 收到get 请求 '/' 时， 指向回调处理函数
app.get('/', function (req, res) {
  res.send('this is client')
})

// 在 express 中 开放资源 就是一个 api 的事
app.use('/static/', express.static('./static/'))
// http://localhost:3000/static/loading.gif 即可访问图片

// 建立监听端口 相当于 server.listen
app.listen(4000, function () {
  console.log('app is running at http://localhost:4000')
})