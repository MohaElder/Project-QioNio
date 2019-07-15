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
    wx.cloud.callFunction({
        name: 'getCheck'
      })
      .then(res => {
        checkList = res.result.data;
        this.renderTime();
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
        var they = that;
        if (res.confirm) {
          db.collection('check').doc(checkID).get({ //建立或者更新数据库信息
            success: function (res) {
              wx.showLoading();
              wx.cloud.callFunction({
                name: 'finishCheck',
                data: {
                  checkID: checkID,
                  userID: res.data.user._openid
                },
                success: res => {
                  for (var i = 0; i < checkList.length; i++) {
                    if (checkList[i]._id == checkID) {
                      checkList[i].isFinished = true;
                    }
                    they.setData({
                      checkList: checkList
                    });
                  }
                  wx.hideLoading();
                },
                fail: err => {
                  wx.showToast({
                    title: '出了点问题',
                  });
                }
              });
            },
          });



        } else if (res.cancel) {
          wx.showToast({
            title: 'Operation Canceled',
          });
        }
      }
    });
  },

  renderTime: function(){
    var temp = [];
    var that = this;
    for(var i = 0; i < checkList.length; i++){
      var check_date = new Date(checkList[i].time.replace(/-/g, "/"));
      var today_date = new Date();
      var days = today_date.getTime() - check_date.getTime();
      var day = parseInt(days / (1000 * 60 * 60 * 24));
      if(day == 0){
        temp.push(checkList[i]);
      }
    }
    checkList = temp;
    that.setData({
      checkList: temp
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