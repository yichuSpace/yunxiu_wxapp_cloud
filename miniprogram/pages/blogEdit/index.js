const MAX_WORDS_NUM = 140 // 输入文字最大的个数
const MAX_IMG_NUM = 9 // 最大上传图片数量

const db = wx.cloud.database()
let content = '' // 输入的文字内容
let userInfo = {}

Page({
  data: {
    wordsNum: 0, // 输入的文字个数
    footerBottom: 0,
    images: [], //图片数据
    selectPhoto: true, // 是否显示添加图片元素
  },

  onLoad: function() {
    userInfo = wx.getStorageSync('userInfo')
  },
// 监听输入框
  onInput(event) {
    let wordsNum = event.detail.value.length
    if (wordsNum >= MAX_WORDS_NUM) {
      wordsNum = `最大字数为${MAX_WORDS_NUM}`
    }
    this.setData({
      wordsNum
    })
    content = event.detail.value
  },
  // 聚焦
  onFocus(event) {
    // 模拟器获取的键盘高度为0
    this.setData({
      footerBottom: event.detail.height,
    })
  },
  // 离焦
  onBlur() {
    this.setData({
      footerBottom: 0,
    })
  },
// 选择图片
  onChooseImage() {
    let max = MAX_IMG_NUM - this.data.images.length // 还能再选几张图片
    wx.chooseImage({
      count: max,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          images: this.data.images.concat(res.tempFilePaths)
        })
        max = MAX_IMG_NUM - this.data.images.length // 还能再选几张图片
        this.setData({
          selectPhoto: max <= 0 ? false : true
        })
      },
    })
  },
  // 删除图片
  onDelImage(event) {
    this.data.images.splice(event.target.dataset.index, 1)
    this.setData({
      images: this.data.images
    })
    if (this.data.images.length == MAX_IMG_NUM - 1) {
      this.setData({
        selectPhoto: true,
      })
    }
  },
// 查看图片
  onPreviewImage(event) {
    wx.previewImage({
      urls: this.data.images,
      current: event.target.dataset.imgsrc,
    })
  },
  
  // 发布
  send() {
    if (content.trim() === '') {
      wx.showModal({
        title: '请输入内容',
        content: '',
      })
      return
    }

    wx.showLoading({
      title: '发布中',
      mask: true,
    })

    let promiseArr = []
    let fileIds = []
    // 图片上传
    for (let i = 0, len = this.data.images.length; i < len; i++) {
      let p = new Promise((resolve, reject) => {
        let item = this.data.images[i]
        // 文件扩展名
        let suffix = /\.\w+$/.exec(item)[0]
        wx.cloud.uploadFile({
          cloudPath: 'blog/' + Date.now() + '-' + Math.random() * 1000000 + suffix,
          filePath: item,
          success: (res) => {
            console.log(res.fileID)
            fileIds = fileIds.concat(res.fileID)
            resolve()
          },
          fail: (err) => {
            console.error(err)
            reject()
          }
        })
      })
      promiseArr.push(p)
    }
    // 存入到云数据库
    Promise.all(promiseArr).then((res) => {
      db.collection('blog').add({
        data: {
          ...userInfo,
          content,
          img: fileIds,
          createTime: db.serverDate(), // 服务端的时间
        }
      }).then((res) => {
        wx.hideLoading()
        wx.showToast({
          title: '发布成功',
        })

        // 返回blog页面，并且刷新
        wx.navigateBack()
        const pages = getCurrentPages()
        console.log(pages)
        // 取到上一个页面
        if (pages.length >= 2) {
          const prevPage = pages[pages.length - 2]
          prevPage.onPullDownRefresh()
        }
      })
    }).catch((err) => {
      wx.hideLoading()
      wx.showToast({
        title: '发布失败',
      })
    })
  }
})