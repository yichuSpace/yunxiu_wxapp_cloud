// pages/blog/blog.js
// 搜索的关键字
let keyword = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 控制底部弹出层是否显示
    modalShow: false,
    blogList: [],
  },
  // 发布功能
  onPublish() {
    // 判断用户是否授权
    wx.getSetting({
      success: (res) => {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: (res) => {
              this.onLoginSuccess({
                detail: res.userInfo
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
  onLoginSuccess(event) {
    console.log(event)
    const detail = event.detail
    wx.navigateTo({
      url: `../blogEdit/index?nickName=${detail.nickName}&avatarUrl=${detail.avatarUrl}`,
    })
  },
  onLoginFail() {
    wx.showModal({
      title: '授权用户才能发布',
      content: '',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this._loadBlogList()
  },

  // 搜索
  onSearch(event) {
    this.setData({
      blogList: []
    })
    keyword = event.detail.keyword
    this._loadBlogList(0)
  },

  _loadBlogList(start = 0) {
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
        blogList: this.data.blogList.concat(res.result.data)
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
    this.setData({
      blogList: []
    })
    this._loadBlogList(0)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this._loadBlogList(this.data.blogList.length)
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