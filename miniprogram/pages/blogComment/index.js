import formatTime from '../../utils/formatTime'
import { showLoading, hideLoading } from '../../utils/tipsBox';

Page({
  data: {
    blog: {},
    commentList: [],
    blogId: ''
  },

  onLoad: function (options) {
    this.setData({
      blogId: options.blogId
    })
    this.getBlogDetail()
  },

  getBlogDetail() {
    showLoading('加载中')
    wx.cloud.callFunction({
      name: 'blog',
      data: {
        blogId: this.data.blogId,
        $url: 'detail',
      }
    }).then(res => {
      const commentList = res.result.commentList.data.map(item=>{
        item.createTime = formatTime(new Date(item.createTime))
        return item
      })
      this.setData({
        commentList,
        blog: res.result.detail[0],
      })
      hideLoading()
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const blog = this.data.blog
    return {
      title: blog.content,
      path: `/pages/blogComment/index?blogId=${blog._id}`,
    }
  }
})