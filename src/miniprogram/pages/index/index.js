//index.js
const app = getApp();
const db = wx.cloud.database();
const _ = db.command;
const util = require('../../utils/util.js');
var openid = "";
var orderList = [];

Page({
  data: {
    userInfo: {},
    card: false,
    swiperList: [{
      imageURL: "https://wx2.sinaimg.cn/mw690/006tozhpgy1g4yfsu2vcmj30yg0hk7d4.jpg"
    }, {
      imageURL: "https://wx4.sinaimg.cn/mw690/006tozhpgy1g4yfsu22g7j30yg0hkgsb.jpg"
    }],
    orderList: [],
    isAdmin: false,
    isPrisoner: false
  },

  //页面每次打开运行
  onLoad: function() {
    wx.showLoading({
      title: '调制猪排冰淇淋',
    })
    this.getOrderList();
    this.onGetOpenid();
    wx.hideLoading();
  },

  //获取菜谱
  getOrderList: function() {
    wx.cloud.callFunction({
        name: 'getOrder'
      })
      .then(res => {
        orderList = res.result.data;
        app.globalData.orderList = res.result.data;
      })
      .catch(console.error);
  },

  //获取用户openid
  onGetOpenid: function() {
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        openid = res.result.openid;
        app.globalData.openid = res.result.openid;
        this.sync();
      },
      fail: err => {
        wx.showToast({
          title: '出大问题',
        });
      }
    });
  },

  //用户注册
  register: function(res) {
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

  //从数据库下载用户信息
  sync: function() {
    var that = this;
    //var Time = util.formatTime(new Date());
    db.collection('user').doc(openid).get({ //建立或者更新数据库信息
      success: function(res) {
        app.globalData.user = res.data;
        app.globalData.isOrdered = res.data.isOrdered;
        for(var i = 0; i < orderList.length; i++){
          orderList[i].rate = (orderList[i].goodRateNum / orderList[i].rateNum * 100).toFixed(2);
          if (orderList[i].rate == 100.00) {orderList[i].rate = "100.0";}
        };
        that.setData({
          orderList: orderList,
          userInfo: res.data.info,
          isOrdered: res.data.isOrdered
        });
        // res.data 包含该记录的数据
        wx.showToast({
          title: '您已登录！',
        });
        that.isAdmin();
      },
      fail: function() {
        that.setData({
          modalName: "DialogModal1"
        });
      }
    });

  },

  //跳转至给定参数界面
  navigate: function(options) {
    var pageName = options.currentTarget.dataset.pagename
    var link = "../" + pageName + "/" + pageName;
    wx.navigateTo({
      url: link,
    });
  },

  //判断是否是Admin=>是否显示Admin按钮
  isAdmin: function() {
    var that = this;
    db.collection('admin').doc(openid).get({ //建立或者更新数据库信息
      success: function(res) {
        that.setData({
          isAdmin: true
        });
      },
      fail: function() {
        that.isPrisoner();
      }
    });
  },

  //判断是否在黑名单内=>是否显示黑名单界面
  isPrisoner: function() {
    var that = this;
    db.collection('gulagList').doc(openid).get({ //建立或者更新数据库信息
      success: function(res) {
        that.setData({
          isPrisoner: true
        });
      }
    });
  },

  //隐藏注册弹窗
  hideModal(e) {
    this.setData({
      modalName: null
    });
  },

  //显示购买弹窗
  purchase: function(options) {
    var that = this;
    wx.showModal({
      title: '看清楚了伙计',
      content: '你确定要订购吗？一天只能买一份饭嗷！',
      success: function(res) {
        if (res.confirm) {
          that.updateOrder(options.currentTarget.dataset.index);
        }
      }
    });

  },

  //更新数据库菜谱（仓库）信息
  updateOrder: function(index) {
    var that = this;
    var orderTemp = orderList[index];

    wx.showLoading({
      title: '正在调制孟婆汤',
    })
    wx.cloud.callFunction({
      name: 'updateOrder',
      data: {
        foodID: orderTemp._id,
        stock: orderTemp.stock - 1
      },
      success: res => {
        that.updateUser(orderTemp);
        that.updateCheck(orderTemp);
        that.updateLocal();
        wx.hideLoading();
      },
      fail: err => {
        wx.showToast({
          title: '出大问题',
        });
      }
    });
  },

  //更新数据库用户信息
  updateUser: function(order) {
    var that = this;
    var orderTemp = that.data.order;

    db.collection('user').doc(openid).update({
      data: {
        orderID: _.push(order._id),
        isOrdered: true
      }
    });
    // res.data 包含该记录的数据
  },

  //更新数据库订单信息
  updateCheck: function(order) {
    var that = this;
    var checkID = "moha";
    for (var i = 0; i < 6; i++) {
      checkID += Number.parseInt(Math.random() * 10);
    }
    var time = util.formatTime(new Date());
    db.collection("check").add({
      data: {
        _id: checkID,
        user: app.globalData.user,
        order: order,
        time: time,
        isFinished: false,
        isRated:false
      }
    });
    // res.data 包含该记录的数据
  },

  //刷新本地渲染信息
  updateLocal: function() {
    var that = this;
    that.setData({
      isOrdered: true
    });
    app.globalData.isOrdered = true;
    wx.showModal({
      title: '你买好了！',
      content: '去个人中心看看你的订单不？',
      success: function(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../self/self',
          });
        }
      }
    });
  },
});