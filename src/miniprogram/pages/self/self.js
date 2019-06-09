//index.js
const app = getApp()

Page({
  data: {
    isFilled:false,
    user: {},
    historyList:[
      {
        name:"牛肉面",
        price:35,
        status:true
      },
      {
        name: "鸡肉饭",
        price: 35,
        status: true
      },
      {
        name: "猪肉汤",
        price: 35,
        status: true
      }
    ]
  },

  onLoad: function () {
    var that = this;
    that.setData({
      user: app.globalData.user
    })
  },

  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },

  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  rateGood: function() {
    var that = this;
    that.setData({
      isFilled:true
    })
    wx.showToast({
      title: '评价成功！',
    })
  },

  rateBad: function () {
    var that = this;
    that.setData({
      isFilled: true
    })
    wx.showToast({
      title: '评价成功！',
    })
  }

  
})