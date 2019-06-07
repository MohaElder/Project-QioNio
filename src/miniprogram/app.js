//app.js
App({
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    // 获取系统状态栏信息
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })
  },
  globalData: {
    userInfo: {},
    orderList:[
      {
        foodID: "FOOD001",
        name: "Beef Noodle",
        desc: "Very nice noodle",
        price: 35,
        imgURL: "http://pic.baike.soso.com/p/20140507/20140507172501-531527651.jpg",
        stock:10
      },
      {
        foodID: "FOOD002",
        name: "Chicken Rice",
        desc: "Very good rice",
        price: 30,
        imgURL: "http://recipe1.hoto.cn/pic/recipe/l/4b/c8/247883_8df070.jpg",
        stock: 10
      }
    ]
  }
})