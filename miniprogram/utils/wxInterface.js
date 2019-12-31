//添加finally：因为还有一个参数里面还有一个complete方法。
Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => {
      throw reason
    })
  );
};

//封装异步api
const wxPromisify = fn => {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function (res) {
        resolve(res)
      }
      obj.fail = function (res) {
        reject(res)
      }
      fn(obj)
    })
  }
}

const getLocationPromisified = wxPromisify(wx.getLocation); //获取经纬度
const getUserInfoPromisified = wxPromisify(wx.getUserInfo); //获取用户信息
const login = wxPromisify(wx.login); //获取用户信息
const getSystemInfoPromisified = wxPromisify(wx.getSystemInfo); //获取系统信息
const scanCodePromisified = wxPromisify(wx.scanCode); //扫码
const downloadFile = wxPromisify(wx.downloadFile); //下载
const getSetting = wxPromisify(wx.getSetting); //获取设置信息
const openSetting = wxPromisify(wx.openSetting); //打开设置页面

module.exports = {
  getLocationPromisified,
  getSystemInfoPromisified,
  getUserInfoPromisified,
  scanCodePromisified,
  downloadFile,
  login,
  getSetting,
  openSetting
}