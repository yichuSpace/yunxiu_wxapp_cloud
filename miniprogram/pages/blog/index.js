let keyword = '' // 搜索的关键字
Page({
  data: {
    modalShow: false, // 控制底部弹出层是否显示
    blogList: [],//列表
  },

  onLoad: function(options) {
    this.loadBlogList()
  },

  // 发布功能
  onPublish() {
    // 判断用户是否授权
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: (res) => {
              wx.setStorageSync('userInfo', res.userInfo)
              wx.navigateTo({
                url: `../blogEdit/index`,
              })
            }
          })
        } else {
          this.setData({
            modalShow: true,
          })
        }
      }
    })
  },
  // 登录失败
  onLoginFail() {
    wx.showModal({
      title: '授权用户才能发布',
      content: '',
    })
  },
  // 搜索
  onSearch(event) {
    this.setData({
      blogList: []
    })
    keyword = event.detail.keyword
    this.loadBlogList(0)
  },

  // 加载列表数据
  loadBlogList(start = 0) {
    wx.showLoading({
      title: '拼命加载中',
    })
    wx.cloud.callFunction({
      name: 'blog',
      data: {
        keyword,
        start,
        count: 10,
        $url: 'list',
      }
    }).then((res) => {
      console.log(res.result.data)
      this.setData({
        blogList: start === 0 ? res.result.data: this.data.blogList.concat(res.result.data)
      })
      wx.hideLoading()
      wx.stopPullDownRefresh()
    })
  },

  // 进入详情
  goComment(event) {
    wx.navigateTo({
      url: '/pages/blogComment/index?blogId=' + event.target.dataset.blogid,
    })
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.loadBlogList(0)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.loadBlogList(this.data.blogList.length)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(event) {
    let blogItem = event.target.dataset.blog
    return {
      title: blogItem.content,
      path: `/pages/blogComment/index?blogId=${blogItem._id}`,
      // imageUrl: ''
    }
  }
})