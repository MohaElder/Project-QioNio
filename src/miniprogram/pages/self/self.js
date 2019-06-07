//index.js
const app = getApp()

Page({
  data: {
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

  liked(e) {
    this.setData({
      liked: this.data.liked ? '' : 'liked'
    })
  }

  
})