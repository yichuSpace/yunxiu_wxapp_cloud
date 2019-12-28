const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    musiclist: Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    playingId: -1
  },
  
  pageLifetimes: {
    show() {
      this.setData({
        playingId: parseInt(app.getPlayMusicId())
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 选择音乐
    onSelect(event) {
      const { musicid, index} = event.currentTarget.dataset
      this.setData({
        playingId: musicid
      })
      wx.navigateTo({
        url: `/pages/playDetail/index?musicId=${musicid}&index=${index}`,
      })
    }
  }
})