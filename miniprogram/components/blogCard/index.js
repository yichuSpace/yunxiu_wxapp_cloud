import formatTime from '../../utils/formatTime.js'

Component({
  properties: {
    blog: Object
  },

  // 监听
  observers: {
    ['blog.createTime'](val) {
      if (val) {
        this.setData({
          _createTime: formatTime(new Date(val)) //时间格式化
        })
      }
    }
  },

  data: {
    _createTime: ''
  },
  
  methods: {
    // 点击图片
    onPreviewImage(event) {
      const { imgs, imgsrc} = event.target.dataset
      wx.previewImage({
        urls: imgs,
        current: imgsrc,
      })
    },
  }
})