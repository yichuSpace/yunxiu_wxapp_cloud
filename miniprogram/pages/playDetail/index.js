let musiclist = [] //歌单列表
let nowPlayingIndex = 0 // 正在播放歌曲的index
const backgroundAudioManager = wx.getBackgroundAudioManager() // 获取全局唯一的背景音频管理器
const app = getApp()
let time = ''
Page({
  data: {
    picUrl: '',
    isPlaying: false, // false表示不播放，true表示正在播放
    isLyricShow: false, //表示当前歌词是否显示
    lyric: '', //歌词
    isHasAuth: true, //是否有权限
    isSame: false, // 表示是否为同一首歌
  },

  onLoad: function(options) {
    console.log(options)
    nowPlayingIndex = options.index
    musiclist = wx.getStorageSync('musiclist')
    this.loadMusicDetail(options.musicId)
  },

  // 请求歌曲信息
  loadMusicDetail(musicId) {
    let isSame = musicId === app.getPlayMusicId() ? true : false
    let music = musiclist[nowPlayingIndex] //播放音乐
    this.setData({
      picUrl: music.al.picUrl,
      isSame,
      isHasAuth: true
    })
    if (!isSame) {
      backgroundAudioManager.stop()
      wx.showLoading({
        title: '歌曲加载中',
      })
      this.loadMusicInfo(musicId, music) // 加载音乐信息
    } else {
      this.setData({
        isPlaying: true
      })
      this.loadLyric(musicId) // 加载歌词
    }
    app.setPlayMusicId(musicId) //设置当前播放音乐ID
    wx.setNavigationBarTitle({
      title: music.name,
    })
  },
  // 加载音乐信息
  async loadMusicInfo(musicId, music) {
    wx.cloud.callFunction({
      name: 'music',
      data: {
        musicId,
        $url: 'musicUrl',
      }
    }).then(async(res) => {
      const {
        data
      } = res.result

      if (data[0].url == null) {
        this.setData({
          isPlaying: false,
          isHasAuth: false
        })
        await wx.showToast({
          title: '无权限播放',
          icon: 'none',
          duration: 3000,
        })
        time = setTimeout(() => {
          this.onNext()
        }, 3000)
        return
      }
      if (!this.data.isSame) {
        backgroundAudioManager.src = data[0].url
        backgroundAudioManager.title = music.name
        backgroundAudioManager.coverImgUrl = music.al.picUrl
        backgroundAudioManager.singer = music.ar[0].name
        backgroundAudioManager.epname = music.al.name
        this.savePlayHistory() // 保存播放历史
      }

      this.setData({
        isPlaying: true
      })
      wx.hideLoading()
      this.loadLyric(musicId) // 加载歌词
    })
  },
  // 加载歌词
  loadLyric(musicId) {
    wx.cloud.callFunction({
      name: 'music',
      data: {
        musicId,
        $url: 'lyric',
      }
    }).then(res => {
      console.log(res)
      let {
        lrc
      } = res.result
      // console.log('歌词', lrc.lyric)
      let lyric = lrc && lrc.lyric ? lrc.lyric : '暂无歌词'
      this.setData({
        lyric
      })
    })
  },
  // 点击暂停播放按钮
  togglePlaying() {
    this.data.isPlaying ? backgroundAudioManager.pause() : backgroundAudioManager.play() // 是否正在播放
    this.setData({
      isPlaying: !this.data.isPlaying
    })
  },
  // 上一首
  onPrev() {
    console.log(time)
    if (time) {
      clearTimeout(time)
    }
    nowPlayingIndex--
    if (nowPlayingIndex < 0) {
      nowPlayingIndex = musiclist.length - 1
    }
    this.loadMusicDetail(musiclist[nowPlayingIndex].id)
  },
  // 下一首
  onNext() {
    if (time) {
      clearTimeout(time)
    }
    nowPlayingIndex++
    if (nowPlayingIndex === musiclist.length) {
      nowPlayingIndex = 0
    }
    this.loadMusicDetail(musiclist[nowPlayingIndex].id)
  },

  // 切换歌词显示
  onChangeLyricShow() {
    this.setData({
      isLyricShow: !this.data.isLyricShow
    })
  },

  // 进度条时间变化
  timeUpdate(event) {
    this.selectComponent('.lyric').update(event.detail.currentTime)
  },
  // 播放
  onPlay() {
    this.setData({
      isPlaying: true,
    })
  },
  // 暂停
  onPause() {
    this.setData({
      isPlaying: false,
    })
  },

  // 保存播放历史
  savePlayHistory() {
    const music = musiclist[nowPlayingIndex] //  当前正在播放的歌曲
    const openid = app.globalData.openid
    const history = wx.getStorageSync(openid) || [] //播放历史列表
    let bHave = false
    if (history.length > 0) {
      bHave = history.some(item => {
        return item.id === music.id
      })
    }

    if (!bHave) {
      history.unshift(music)
      wx.setStorage({
        key: openid,
        data: history,
      })
    }
  },

})