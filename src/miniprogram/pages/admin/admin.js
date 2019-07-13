// miniprogram/pages/admin/admin.js
const app = getApp();
var checkList = [];
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    checkList = [];
    var that = this;
    wx.cloud.callFunction({
        name: 'getCheck'
      })
      .then(res => {
        for (var i = 0; i < res.result.data.length; i++) {
          if (res.result.data[i].userID == app.globalData.openid) {
            checkList.push(res.result.data[i]);
          }
        }
        //app.globalData.checkList = res.result.data;
        that.setData({
          checkList: checkList
        });
      })
      .catch(console.error);
  },

  confirm: function (options) {
    var checkID = options.currentTarget.dataset.checkid;
    var that = this;
    wx.showModal({
      title: 'Info',
      content: '确认完成订单？',
      success: function (res) {
        if (res.confirm) {
          db.collection('check').doc(checkID).get({ //建立或者更新数据库信息
            success: function (res) {
              db.collection('user').doc(res.data.userID).update({
                data: {
                  isOrdered: false
                }
              });
            },
          });
          db.collection('check').doc(checkID).update({
            data: {
              isFinished: true
            }
          });

          for (var i = 0; i < checkList.length; i++) {
            if (checkList[i]._id == checkID) {
              checkList[i].isFinished = true;
            }
            that.setData({
              checkList: checkList
            });
          }

        } else if (res.cancel) {
          wx.showToast({
            title: 'aaa',
          });
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
});