// components/musiclist/musiclist.js
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
    onSelect(event) {
      // 事件源 事件处理函数 事件对象 事件类型
      const { musicid, index} = event.currentTarget.dataset
      this.setData({
        playingId: musicid
      })
      wx.navigateTo({
        url: `../../pages/playDetail/index?musicId=${musicid}&index=${ds.index}`,
      })
    }
  }
})