const request = require('request')

exports.main = async (event, context) => new Promise ((resolve, reject) => {
  // 获取7天内的 连载番剧排行 
  let url = 'https://api.bilibili.com/x/web-interface/ranking/region?rid=33&day=7&original=0';

  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body) 
      resolve({
        result: 1,
        value: body,
      })
    } else {
      resolve({
        result: 0,
        value: 'fail request',
      })
    }
  
  })

})