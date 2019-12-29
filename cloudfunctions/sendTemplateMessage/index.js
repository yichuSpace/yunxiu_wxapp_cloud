// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const {
    OPENID
  } = cloud.getWXContext()
console.log(event)
  const result = await cloud.openapi.templateMessage.send({
    touser: OPENID,
    page: `/pages/blogComment/index?blogId=${event.blogId}`,
    data: {
      keyword1: {
        value: '评价完成'
      },
      keyword2: {
        value: event.content
      }
    },
    templateId: 'jwNB9jFgOIaAHyw19vznxU3XOdqNS46sr5PcK1SrQ00',
    formId: event.formId
  })
  return result
}