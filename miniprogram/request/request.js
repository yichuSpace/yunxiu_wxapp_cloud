import {
  HTTP
} from '../utils/http.js';

class API extends HTTP {
  constructor() {
    super()
  }

  /**
   * API接口
   * apiName  api接口名称
   * sendData 参数
   * success 成功返回
   * */
  apiPost(apiName, sendData, success) {
    let params = {
      url: apiName,
      success: success,
      method: 'POST',
      data: JSON.stringify(sendData)
    }
    return this.request(params)
  }

  /**
   * API接口
   * apiName  api接口名称
   * sendData 参数
   * success 成功返回
   * */
  apiGet(apiName, sendData, success) {
    let params = {
      url: apiName,
      success: success,
      method: 'Get',
      data: JSON.stringify(sendData)
    }
    return this.request(params)
  }
}

export {
  API
}