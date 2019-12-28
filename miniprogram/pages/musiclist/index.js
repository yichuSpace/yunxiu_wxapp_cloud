Page({
  data: {
    musiclist: [],
    listInfo: {},
  },

  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    
    wx.cloud.callFunction({
      name: 'music',
      data: {
        playlistId: options.playlistId,
        $url: 'musicList'
      }
    }).then(res => {
      const {
        tracks: musiclist,
        coverImgUrl,
        name
      } = res.result.playlist
      this.setData({
        musiclist,
        listInfo: {
          coverImgUrl,
          name,
        }
      })
      this._setMusiclist()
      wx.hideLoading()
    })
  },

  _setMusiclist() {
    wx.setStorageSync('musiclist', this.data.musiclist)
  },
})