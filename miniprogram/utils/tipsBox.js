const showBusy = function(title = '加载中') {
  return wx.showToast({
    title,
    icon: "loading",
    duration: 2e3
  })
}

const showSuccess = function(title = '成功', s) {
  return wx.showToast({
    title,
    icon: "success",
    duration: 2e3,
    success: function() {
      typeof s === "function" && s()
    }
  })
}

const showWaiting = function(o, s) {
  return wx.showToast({
    title: o,
    icon: 'none',
    duration: 2e3,
    success: function() {
      "function" == typeof s && s()
    }
  })
}

const showModels = function(o, n, s) {
  wx.hideToast(), wx.showModal({
    title: o,
    content: n,
    success: function(o) {
      o.confirm && "function" == typeof s && s()
    }
  })
}
const showModel = function(o, n, s) {
  wx.hideToast(), wx.showModal({
    title: o,
    content: n,
    showCancel: !1,
    success: function(o) {
      o.confirm && "function" == typeof s && s()
    }
  })
}

const showLoading = function(o) {
  return wx.showLoading({
    title: o,
    icon: "loading",
    mask: !0,
    duration: 1e4
  })
}

const hideLoading = function() {
  wx.hideLoading()
}

const showWarning = function(o, n) {
  wx.hideToast(), wx.showModal({
    title: o,
    content: n,
    showCancel: !1
  })
}

const showConfirm = function(o, n, s) {
  wx.hideToast(), wx.showModal({
    title: o,
    content: n,
    success: function(o) {
      o.confirm && "function" == typeof s && s()
    }
  })
};

module.exports = {
  showBusy, //加载框
  showSuccess, //成功
  showModel,
  showLoading,
  hideLoading,
  showWarning,
  showConfirm,
  showWaiting,
  showModels
};