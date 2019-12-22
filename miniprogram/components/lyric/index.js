let lyricHeight = 0  //歌词高度
Component({

  properties: {
    isLyricShow: {
      type: Boolean,
      value: false,
    },
    lyric: String,
  },

  observers: {
    lyric(lrc) {
      if (lrc == '暂无歌词') {
        this.setData({
          lrcList: [{
            lrc,
            time: 0,
          }],
          nowLyricIndex: -1
        })
      } else {
        this._parseLyric(lrc)
      }
    },
  },

  data: {
    lrcList: [],
    nowLyricIndex: 0, // 当前选中的歌词的索引
    scrollTop: 0, // 滚动条滚动的高度
  },

  lifetimes: {
    ready() {
      wx.getSystemInfo({
        success(res) {
          lyricHeight = res.screenWidth / 750 * 64
        },
      })
    },
  },

  methods: {
    // 滚动歌词
    update(currentTime) {
      let lrcList = this.data.lrcList
      if (lrcList.length === 0) return
      if (currentTime > lrcList[lrcList.length - 1].time) {
        if (this.data.nowLyricIndex !== -1) {
          this.setData({
            nowLyricIndex: -1,
            scrollTop: lrcList.length * lyricHeight
          })
        }
      }
      for (let i = 0, len = lrcList.length; i < len; i++) {
        if (currentTime <= lrcList[i].time) {
          this.setData({
            nowLyricIndex: i - 1,
            scrollTop: (i - 1) * lyricHeight
          })
          break
        }
      }
    },
    // 解析歌词
    _parseLyric(sLyric) {
      let line = sLyric.split('\n') //将歌词转成数组
      let lrcList = []
      line.forEach(elem => {
        let time = elem.match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g)
        if (time != null) {
          let lrc = elem.split(time)[1]//歌词
          let timeReg = time[0].match(/(\d{2,}):(\d{2})(?:\.(\d{2,3}))?/)
          // 把时间转换为秒
          let time2Seconds = parseInt(timeReg[1]) * 60 + parseInt(timeReg[2]) + parseInt(timeReg[3]) / 1000
          lrcList.push({
            lrc,
            time: time2Seconds,
          })
        }
      })
      this.setData({
        lrcList
      })
    }
  }
})