//index.js
const app = getApp();
const db = wx.cloud.database();
var openid = "";
var orderList = [];

Page({
  data: {
    userInfo: {},
    card:false,
    logged: false,
    takeSession: false,
    requestResult: '',
    swiperList: [{
      imageURL: "https://wx2.sinaimg.cn/mw690/006tozhpgy1g4yfsu2vcmj30yg0hk7d4.jpg",
      desc: "索迪斯为人民服务"
    }, {
      imageURL: "https://wx4.sinaimg.cn/mw690/006tozhpgy1g4yfsu22g7j30yg0hkgsb.jpg",
      desc: "我也不知道说啥就随便打点字吧"
    }],
    orderList: [],
    isAdmin: false,
    isPrisoner: false
  },

  onLoad: function () {
    wx.showLoading({
      title: '启动核聚变锅炉',
    })
    this.getOrderList();
  },

  toAdmin: function () {
    wx.navigateTo({
      url: '../admin/admin?',
    });
  },

  getOrderList: function () {
    wx.cloud.callFunction({
        name: 'getOrder'
      })
      .then(res => {
        orderList = res.result.data;
        app.globalData.orderList = res.result.data;
      })
      .catch(console.error);

    this.onGetOpenid();
  },

  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        openid = res.result.openid;
        app.globalData.openid = res.result.openid;
        this.upload();
      },
      fail: err => {
        wx.showToast({
          title: '出了点问题',
        });
      }
    });
  },

  register: function (res) {
    var that = this;
    var userInfo = res.detail.userInfo;
    app.globalData.user = userInfo;
    db.collection('user').add({
      data: {
        _id: openid,
        info: userInfo,
        orderID: [],
        isOrdered: false
      }
    });
    that.setData({
      orderList: orderList,
      userInfo: userInfo,
      modalName: null
    });
    app.globalData.user = res.data;
    wx.showToast({
      title: '您已注册！',
    });
  },


  upload: function () {
    var that = this;
    //var Time = util.formatTime(new Date());
    db.collection('user').doc(openid).get({ //建立或者更新数据库信息
      success: function (res) {
        app.globalData.user = res.data;
        app.globalData.isOrdered = res.data.isOrdered;
        that.setData({
          orderList: orderList,
          userInfo: res.data.info
        });
        // res.data 包含该记录的数据
        wx.showToast({
          title: '您已登录！',
        });
        wx.hideLoading();
        that.isAdmin();
      },
      fail: function () {
        that.setData({
          modalName: "DialogModal1"
        });
      }
    });

  },

  toFood: function (e) {
    var id = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.name;
    var link = '../food/food?foodID=' + id;
    wx.navigateTo({
      url: link,
    });
  },

  toSelf: function () {
    wx.navigateTo({
      url: '../self/self',
    });
  },

  toArticle: function () {
    wx.navigateTo({
      url: '../article/article',
    });
  },

  isAdmin: function () {
    var that = this;
    db.collection('admin').doc(openid).get({ //建立或者更新数据库信息
      success: function (res) {
        that.setData({
          isAdmin: true
        });
      },
      fail: function () {
        that.isPrisoner();
      }
    });
  },

  isPrisoner: function () {
    var that = this;
    db.collection('gulagList').doc(openid).get({ //建立或者更新数据库信息
      success: function (res) {
        that.setData({
          isPrisoner: true
        });
      }
    });
  },

  hideModal(e) {
    this.setData({
      modalName: null
    });
  },
});