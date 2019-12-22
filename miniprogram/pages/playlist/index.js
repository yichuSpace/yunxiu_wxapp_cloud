const MAX_LIMIT = 15
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperImgUrls: [{
        url: 'http://p1.music.126.net/oeH9rlBAj3UNkhOmfog8Hw==/109951164169407335.jpg',
      },
      {
        url: 'http://p1.music.126.net/xhWAaHI-SIYP8ZMzL9NOqg==/109951164167032995.jpg',
      },
      {
        url: 'http://p1.music.126.net/Yo-FjrJTQ9clkDkuUCTtUg==/109951164169441928.jpg',
      }
    ],
    songSheetList: []
  },

  onLoad: function(options) {
    this.getSongSheetList()
  },
  // 获取歌单列表
  getSongSheetList() {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'music',
      data: {
        startNum: this.data.songSheetList.length,
        count: MAX_LIMIT,
        $url: 'getSongSheetList',
      }
    }).then((res) => {
      const {
        data,
        code
      } = res.result
      if (code === 200) {
        this.setData({
          songSheetList: this.data.songSheetList.concat(data)
        })
      }
      wx.stopPullDownRefresh()
      wx.hideLoading()
    })
  },

  // 下拉刷新
  onPullDownRefresh: function() {
    this.setData({
      songSheetList: []
    })
    this.getSongSheetList()
    // this._getSwiper()
  },
  
  // 上拉加载
  onReachBottom: function() {
    this.getSongSheetList()
  },
})