//index.js
const app = getApp();
var checkList = [];
var currentOrderID = "";
var currentCheckID = "";
var wxbarcode = require('../../utils/index.js');

var db = wx.cloud.database();
Page({
  data: {
    isFilled: false,
    user: {},
    checkList: []
  },

  //每次页面打开运行
  onLoad: function () {
    checkList = [];
    var that = this;
    wx.cloud.callFunction({
        name: 'getCheck'
      })
      .then(res => {
        for (var i = 0; i < res.result.data.length; i++) {
          if (res.result.data[i].user._openid == app.globalData.openid) {
            checkList.push(res.result.data[i]);
          }
        }
        that.setData({
          user: app.globalData.user,
          checkList: checkList
        });
      })
      .catch(console.error);
  },

  //显示弹窗
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    });
    currentCheckID = e.currentTarget.dataset.checkid;
    currentOrderID = e.currentTarget.dataset.orderid;
  },

  //隐藏弹窗
  hideModal(e) {
    wxbarcode.qrcode('qrcode', 'FreedomIsNotFree', 0, 0);
    this.setData({
      modalName: null
    });
  },

  //好评操作
  rateGood: function (orderID,checkID) {
    var that = this;
    wx.showLoading({
      title: '正在烹煮唐僧肉',
    })
    wx.cloud.callFunction({
      name:'rateCheck',
      data:{
        orderID: currentOrderID,
        checkID: currentCheckID,
        goodNum:1
      },
      success: res => {
        wx.hideLoading();
        wx.showToast({
          title: '你可算评价好了',
        });
        that.updateLocal();
        
      },
      fail: err => {
        wx.showToast({
          title: '出大问题',
        });
      }
    })
  },

  //差评操作
  rateBad: function (orderID, checkID) {
    var that = this;
    that.setData({
      isFilled: true
    });
    wx.showLoading({
      title: '正在烹煮唐僧肉',
    })
    wx.cloud.callFunction({
      name: 'rateCheck',
      data: {
        orderID: currentOrderID,
        checkID: currentCheckID,
        goodNum: 0
      },
      success: res => {
        wx.hideLoading();
        wx.showToast({
          title: '你可算评价好了',
        });
        that.updateLocal();
      },
      fail: err => {
        wx.showToast({
          title: '出大问题',
        });
      }
    })
  },

  //更新本地评价状态
  updateLocal: function(){
    var that = this;
    db.collection('check').doc(currentCheckID).update({
      data: {
        isRated: true
      }
    });
    for (var i = 0; i < checkList.length; i++) {
      if (checkList[i]._id == currentCheckID) {
        checkList[i].isRated = true;
      }
    }
    that.setData({
      checkList: checkList
    });
  },

  //显示订单二维码
  showCode: function(options){
    var checkID = options.currentTarget.dataset.checkid;
    wxbarcode.qrcode('qrcode', checkID, 420, 420);
    this.setData({
      modalName: "Modal2"
    });
  },

  onPullDownRefresh: function () {
    wx.reLaunch({
      url: '../self/self',
    })
  }


});