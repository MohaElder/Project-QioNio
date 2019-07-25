// miniprogram/pages/admin/admin.js
const app = getApp();
var checkList = [];
const db = wx.cloud.database();
var checkID = '';

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
      name: 'getDB',
      data: {
        dbName: "check"
      }
      })
      .then(res => {
        checkList = res.result.data;
        this.renderTime();
      })
      .catch(console.error);
  },

  //扫描订单二维码
  scan: function () {
    var that = this;
    wx.scanCode({
      success(res) {
        checkID = res.result;
        that.confirm();
      }
    })
  },

  getCheckID: function (e){
    checkID = e.detail.value;
  },

  hideModal(e) {
    this.setData({
      modalName: null
    });
  },

  //完成订单，更新数据库相关数据
  confirm: function () {
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
                  wx.showToast({
                    title: '完成订单啦！'
                  })
                  they.setData({
                    modalName:null
                  })
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

  manualConfirm: function(){
    this.setData({
      modalName: "Modal1"
    })
  },

  //判断日期，只显示当日订单
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

  //自动拉黑所有当日未完成（未到达领餐）订单
  endToday: function(){
    wx.showModal({
      title: '警告',
      content: '确定结束今天服务？',
      success: function(res){
        if(res.confirm){
          wx.showModal({
            title: '警告',
            content: '真的确定吗？',
            success: function (res) {
              if (res.confirm) {
                var user = {};
                wx.cloud.callFunction({
                  name: 'goToGulag',
                  success: function (res) {
                    console.log(res)
                    for (var i = 0; i < res.result.data.length; i++) {
                      wx.cloud.callFunction({
                        
                      })
                      db.collection('gulagList').add({
                        data: ({
                          _id: res.result.data[i]._openid,
                          prisonnerID: res.result.data[i]._openid,
                          user: user
                        })
                      })
                    }
                    wx.showModal({
                      title: '警告',
                      content: '已拉黑所有未完成订单用户',
                    })
                  },
                  fail: function (res) {
                    console.log("Failed!");
                  }
                })
              }

            }
          })
        }

      }
    })
  }

  
});