import {
  config
} from '../config.js'
import tips from './tips';
class HTTP {
  constructor() {
    this.baseRestUrl = config.api_blink_url
  }

  request({
    url,
    resolve,
    data = {},
    method = 'GET'
  }) {
    return new Promise((resolve, reject) => {
      this._request(url, resolve, reject, data, method)
    })
  }

  _request(url, resolve, reject, data = {}, method = 'GET') {
    let starttime = new Date().getTime();
    let endtime = undefined;
    wx.request({
      url: config.api_blink_url + url,
      method: method,
      data: data,
      header: {
        'content-type': 'application/json;charset=UTF-8'
      },
      success: (res) => {
        endtime = new Date().getTime();
        console.warn('Info : ' + " Url : " + url + " Time : " + (endtime - starttime) / 1000 + "s");
        const code = res.statusCode.toString();
        if (code.startsWith('2')) {

          if (res.data.code == 302) {
            tips.showWarning('提示', '登录失效')
            setTimeout(() => {
              wx.removeStorageSync('userInfo')
              wx.reLaunch({
                url: '/pages/index/index',
              })
            }, 1000)
          } else {
            resolve(res)
          }
        } else {
          const error_code = res.data.error_code;
          console.log(error_code)
          reject()
        }
      },
      fail: (err) => {
        console.log(err)
        console.error('ERR: Args : ' + " Url : " + url + " Time : " + (endtime - starttime) / 1000 + "s");
        wx.redirectTo({
          url: '/pages/linkErr/index?text=服务器开了个小差'
        })
        reject()
      }
    })
  }
}

export {
  HTTP
};