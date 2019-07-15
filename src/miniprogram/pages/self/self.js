//index.js
const app = getApp();
var checkList = [];

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
  },

  hideModal(e) {
    this.setData({
      modalName: null
    });
  },

  rateGood: function () {
    var that = this;
    that.setData({
      isFilled: true
    });
    wx.showToast({
      title: '评价成功！',
    });
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