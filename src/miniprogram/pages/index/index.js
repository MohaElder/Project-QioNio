  //index.js
const app = getApp();
const db = wx.cloud.database();
const _ = db.command;
const util = require('../../utils/util.js');
var openid = "";
var orderList = [];
var count = 1;
var gradeChosen = 'Class of 2020';
var classChosen = 0;
var codeChosen = '';
var validationChosen = '';
Page({
  data: {
    gradeIndex:0,
    gradePicker: ['Class of 2020', 'Class of 2021', 'Class of 2022', 'Class of 2023', 'Class of 2024'],
    userInfo: {},
    card: false,
    swiperList: [],
    orderList: [],
    isAdmin: false,
    isPrisoner: false
  },

  //TODOS: swiperList Go Cloud! Black List function......

  //页面每次打开运行
  onLoad: function() {
    wx.showLoading({
      title: '调制猪排冰淇淋',
    })
    this.getOrderList();
    this.onGetOpenid();
    this.getSwiperPics();
  },

  //获取菜谱
  getOrderList: function() {
    wx.cloud.callFunction({
      name: 'getDB',
      data: {
        dbName: "order"
      }
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
    if(classChosen != ''&& codeChosen != '' && validationChosen == 'kando169' && classChosen > 0 && classChosen < 11){
      var that = this;
      var userInfo = res.detail.userInfo;
      app.globalData.user = userInfo;
      db.collection('user').add({
        data: {
          _id: openid,
          info: userInfo,
          orderID: [],
          isOrdered: false,
          grade: gradeChosen,
          classroom: classChosen,
          code: codeChosen,
          isPrisoner: false,
          isAdmin: false
        }
      });
      app.globalData.user = res.data;
      wx.showToast({
        title: '您已注册！',
      });
      that.sync();
    }
    else{
      wx.showToast({
        title: '别想混过去',
      })
    }
    
  },

  getSwiperPics: function(){
    var that = this;
    wx.cloud.callFunction({
      name: 'getDB',
      data:{
        dbName: "sodexPlaceHolder"
      }
    })
      .then(res => {
        that.setData({
          swiperList:res.result.data,
        })
        wx.hideLoading()
      })
      .catch(console.error);
  },

  //模拟弹出注册页面
  simulateRegister: function () {
    this.setData({
      modalName: "DialogModal1"
    });
  },

  //获取班级
  getClass: function (e) {
    classChosen = e.detail.value;
  },

  //获取学号
  getCode: function (e) {
    codeChosen = e.detail.value;
  },

  //获取校验码
  getValidation: function (e) {
    validationChosen = e.detail.value;
  },

  //获取年级
  PickerChange(e) {
    this.setData({
      gradeIndex: e.detail.value
    })
    gradeChosen = this.data.gradePicker[e.detail.value];
  },

  //从数据库下载用户信息
  sync: function() {
    var that = this;
    db.collection('user').doc(openid).get({ //建立或者更新数据库信息
      success: function(res) {
        app.globalData.user = res.data;
        app.globalData.isOrdered = res.data.isOrdered;
        for (var i = 0; i < orderList.length; i++) {
          orderList[i].rate = (orderList[i].goodRateNum / orderList[i].rateNum * 100).toFixed(2);
          if (orderList[i].rate == 100.00) {
            orderList[i].rate = "100.0";
          }
        };
        var now = new Date();
        if (now.getHours() < 0 || now.getHours() > 100) {
          that.setData({
            orderList: orderList,
            userInfo: res.data.info,
            isOrdered: res.data.isOrdered,
            modalName: null,
            outOfTime: true
          })
          wx.showModal({
            title: '不在服务时间内',
            content:'服务时间是：早上八点到中午十二点，记住了嗷！'
          });
        } else {
          that.setData({
            orderList: orderList,
            userInfo: res.data.info,
            isOrdered: res.data.isOrdered,
            modalName: null
          });
        }
        // res.data 包含该记录的数据
        wx.showToast({
          title: '您已登录！',
        });
        that.isAdmin(res.data);
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
  isAdmin: function(user) {
    var that = this;
    if(user.isAdmin == true){
        that.setData({
          isAdmin: true
        });
      }
      else{
        that.isPrisoner(user);
      }
  },

  //判断是否在黑名单内=>是否显示黑名单界面
  isPrisoner: function(user) {
    var that = this;
    if(user.isPrisoner == true){
      that.setData({
        isPrisoner: true
      })
    }
  },

  showModal: function () {
    this.setData({
      isBlur: true,
      modalName: "language"
    })
  },

  hideModal(value) {
    this.setData({
      modalName: null,
      isBlur: false,
    });
  },

  //显示购买弹窗
  purchase: function(options) {
    var that = this;
    var now = new Date();
    this.setData({
      modalName: "purchase",

    })
    if (this.data.isAdmin == true) {
      /*
      wx.showModal({
        title: '你是管理员？',
        content: '买饭界面调试',
        success: function(res) {
          if (res.confirm) {
            that.updateOrder(options.currentTarget.dataset.index);
          }
        }
      });
      */
    } else if (now.getHours() < 0 || now.getHours() > 100) {
      wx.showModal({
        title: '很难受,你点不了餐了',
        content: '你点餐的时候超过服务时间了，难受吗？',
      })
      this.setData({
        outOfTime: true
      })
    } else {
      wx.showModal({
        title: '看清楚了伙计',
        content: '你确定要订购吗？一天只能买一份饭嗷！',
        success: function(res) {
          if (res.confirm) {
            that.updateOrder(options.currentTarget.dataset.index);
          }
        }
      });
    }

  },

  //更新数据库菜谱（仓库）信息
  updateOrder: function(index) {
    var that = this;
    var orderTemp = orderList[index];

    wx.showLoading({
      title: '正在调制孟婆汤',
    })
    wx.cloud.callFunction({
      name: 'updateDB',
      data: {
        dbName: "order",
        id: orderTemp._id,
        stock: orderTemp.stock - 1
      }
    }).then(res => {
      that.updateUser(orderTemp);
      that.updateCheck(orderTemp);
      that.updateLocal();
      wx.hideLoading();
    }).catch(console.error);
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
        isRated: false
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

  //检测后门触发
  triggerSuperPower: function(e) {
    if (count == 5) {
      this.setData({
        isSuper: true
      })
    }
    if (count == 50) {
      wx.showModal({
        title: 'Error!',
        content: 'FAILED ATEMPT, REJECT',
      })
      this.setData({
        isSuper: false
      })
    }
    if (e.detail.value == "youyishuoyi") {
      this.superPower();
    }
    count += 1;
  },

  //触发后门
  superPower: function() {
    wx.showModal({
      title: 'su-root',
      content: 'Very powerful area',
      success: function(res){
        if(res.confirm){
          wx.navigateTo({
            url: '../superAdmin/superAdmin',
          })
        }
      }
    })
  },

  simulateSuperAdmin: function(){
    wx.navigateTo({
      url: '../superAdmin/superAdmin',
    })
  },

  showCreditList: function(){
    this.setData({
      modalName: "Modal3"
    })
  },

  onPullDownRefresh: function(){
    wx.reLaunch({
      url: '../index/index',
    })
  }

});