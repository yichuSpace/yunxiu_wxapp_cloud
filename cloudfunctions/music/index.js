// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const TcbRouter = require('tcb-router')
const rp = require('request-promise')

const BASE_URL = 'http://musicapi.xiecheng.live'

exports.main = async(event, context) => {
  const app = new TcbRouter({
    event
  })
  // 获取歌单列表
  app.router('getSongSheetList', async(ctx, next) => {
    ctx.body = await cloud.database().collection('songSheetList')
      .skip(event.startNum)
      .limit(event.count)
      .orderBy('createTime', 'desc')
      .get()
      .then((res) => {
        if (res.errMsg === 'collection.get:ok'){
          return {
            code:200,
            data:res.data,
            msg:'success'
          }
        }else{
          return {
            code: 500,
            data: [],
            msg: 'err'
          }
        }
      })
  })

// 获取音乐列表
  app.router('musicList', async (ctx, next) => {
    ctx.body = await rp(BASE_URL + '/playlist/detail?id=' + parseInt(event.playlistId))
      .then((res) => {
        return JSON.parse(res)
      })
  })

  app.router('musicUrl', async (ctx, next) => {
    ctx.body = await rp(BASE_URL + `/song/url?id=${event.musicId}`).then((res) => {
      return JSON.parse(res)
    })
  })

  app.router('lyric', async (ctx, next) => {
    ctx.body = await rp(BASE_URL + `/lyric?id=${event.musicId}`).then((res) => {
      return JSON.parse(res)
    })
  })
  
  return app.serve()
}