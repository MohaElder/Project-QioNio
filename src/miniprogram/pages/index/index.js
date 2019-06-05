//index.js
const app = getApp()

Page({
  data: {
    user: {},
    isCard: true,
    userInfo: {},
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
    orderList: [{
        name: "Beef Noodle",
        desc: "Very nice noodle",
        price: 35,
      imgURL:"http://pic.baike.soso.com/p/20140507/20140507172501-531527651.jpg"
      },
      {
        name: "Chicken Rice",
        desc: "Very good rice",
        price: 30,
        imgURL:"http://recipe1.hoto.cn/pic/recipe/l/4b/c8/247883_8df070.jpg"
      },

     ]

  },

  onLoad: function() {
    var that = this;
    // 获取用户信息
    wx.getUserInfo({
      success: function (res) {
        var userInfo = res.userInfo;
        that.setData({
          user: userInfo
        });
      },
      fail: function (res) {
      }
    })
  },

  toFood: function(){
    wx.navigateTo({
      url: '../food/food',
    })
  },

  toSelf: function(){
    wx.navigateTo({
      url: '../self/self',
    })
  }

})