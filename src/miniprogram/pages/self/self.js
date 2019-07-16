//index.js
const app = getApp();
var checkList = [];
var currentOrderID = "";
var currentCheckID = "";


Page({
  data: {
    isFilled: false,
    user: {},
    checkList: []
  },

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
        //app.globalData.checkList = res.result.data;
        that.setData({
          user: app.globalData.user,
          checkList: checkList
        });
      })
      .catch(console.error);
  },

  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    });
    currentCheckID = e.currentTarget.dataset.checkid;
    currentOrderID = e.currentTarget.dataset.orderid;
  },

  hideModal(e) {
    this.setData({
      modalName: null
    });
  },

  rateGood: function (orderID,checkID) {
    var that = this;
    wx.showLoading({
      title: '正在催促厨房阿姨',
    })
    wx.cloud.callFunction({
      name:'rateCheck',
      data:{
        orderID: currentOrderID,
        checkID: currentCheckID,
        goodNum:1
      },
      success: res => {
        console.log('Yay!')
        wx.hideLoading();
        wx.showToast({
          title: '评价成功！',
        });
      },
      fail: err => {
        wx.showToast({
          title: '出了点问题',
        });
      }
    })
  },

  rateBad: function () {
    var that = this;
    that.setData({
      isFilled: true
    });
    wx.showToast({
      title: '评价成功！',
    });
  }


});