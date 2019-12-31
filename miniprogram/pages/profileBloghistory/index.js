const MAX_LIMIT = 10
const db = wx.cloud.database()
Page({
  data: {
    blogList: []
  },

  onLoad: function(options) {
    this.getListByMiniprogram()
  },

  // 获取列表信息
  getListByMiniprogram() {
    wx.showLoading({
      title: '加载中',
    })
    db.collection('blog').skip(this.data.blogList.length)
      .limit(MAX_LIMIT).orderBy('createTime', 'desc').get().then((res) => {
        console.log(res)
        let _bloglist = res.data
        for (let i = 0, len = _bloglist.length; i < len; i++) {
          _bloglist[i].createTime = _bloglist[i].createTime.toString()
        }

        this.setData({
          blogList: this.data.blogList.concat(_bloglist)
        })
        wx.hideLoading()
      })
  },
  // 进入详情
  goComment(event) {
    wx.navigateTo({
      url: `../blogComment/index?blogId=${event.target.dataset.blogid}`,
    })
  },

  onReachBottom: function() {
    this.getListByMiniprogram()
  },

  onShareAppMessage: function(event) {
    const blog = event.target.dataset.blog
    return {
      title: blog.content,
      path: `/pages/blogComment/index?blogId=${blog._id}`
    }
  }
})