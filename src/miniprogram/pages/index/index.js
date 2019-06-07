//index.js
const app = getApp()

Page({
  data: {
    user: {},
    isCard: true,
    logged: false,
    takeSession: false,
    requestResult: '',
    swiperList: [{
      id: 0,
      type: 'image',
      url: 'https://wx2.sinaimg.cn/mw690/006tozhpgy1g03uqzlrfyj31dc0ww1g2.jpg'
      }, {
        id: 1,
        type: 'image',
        url: 'https://wx2.sinaimg.cn/mw690/006tozhpgy1g03ur2znb5j31dc0wwdw0.jpg'
      }],
    orderList: []

  },

  onLoad: function() {
    var that = this;
    // 获取用户信息
    wx.getUserInfo({
      success: function (res) {
        var userInfo = res.userInfo;
        var user = {info:userInfo,orderID:""};
        that.setData({
          user: user
        });
        app.globalData.user = user;
        console.log(app.globalData.user)
      },
      fail: function (res) {
      }
    })
    that.setData({
      orderList: app.globalData.orderList
    })
  },

  toFood: function(e){
    var id = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.name;
    var link = '../food/food?foodID=' + id;
    console.log(link);
    wx.navigateTo({
      url: link,
    })
  },

  toSelf: function(){
    wx.navigateTo({
      url: '../self/self',
    })
  }

})