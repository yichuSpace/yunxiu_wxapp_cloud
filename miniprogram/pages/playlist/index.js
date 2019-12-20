// miniprogram/pages/playlist/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
async open(){
  console.log(23243)
  let res=await this.timeOut()
  console.log(res)
},
  timeOut(){
    return new Promise((resolve,reject)=>{
      setTimeout(()=>{
        console.log(324324)
        resolve({aa:23423432})
      },1000)
    })
  }
})