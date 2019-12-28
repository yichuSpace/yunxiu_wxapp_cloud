// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const rp = require('request-promise')

const URL = 'http://musicapi.xiecheng.live/personalized' //资源地址
const songSheetListCollection = db.collection('songSheetList') //数据集合

const MAX_LIMIT = 100 //请求数据的最大数量值

exports.main = async(event, context) => {
  const countResult = await songSheetListCollection.count()
  const total = countResult.total //获取总数
  console.log('当前总数', total)
  //请求次数
  const batchTimes = Math.ceil(total / MAX_LIMIT)
  const tasks = [] //返回请求列表
  for (let i = 0; i < batchTimes; i++) {
    let promise = songSheetListCollection.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }

  // 原来的数据
  let list = {
    data: []
  }
  if (tasks.length > 0) {
    list = (await Promise.all(tasks)).reduce((acc, cur) => {
      return {
        data: acc.data.concat(cur.data)
      }
    })
  }

  // 最新请求的数据列表
  const songSheetList = await rp(URL).then((res) => {
    return JSON.parse(res).result
  })

  const newData = []

  // 旧数据与新数据去重
  songSheetList.forEach(item => {
    let flag = true
    for (let j = 0, len2 = list.data.length; j < len2; j++) {
      if (item.id === list.data[j].id) {
        flag = false
        break
      }
    }
    if (flag) {
      newData.push(item)
    }
  })
  // 将数据列表添加到数据集合
  if (newData.length > 0) {
    for (const item of newData){
      await songSheetListCollection.add({
        data: {
          ...item,
          createTime: db.serverDate(),
        }
      }).then((res) => {
        console.log('插入成功')
      }).catch((err) => {
        console.error('插入失败')
      })
    }
    return {
      type: 'success',
      data: newData.length,
      msg:'数据更新成功'
    }
  } else {
    return {
      type: 'success',
      data: newData.length,
      msg: '暂无数据更新'
    }
  }
}