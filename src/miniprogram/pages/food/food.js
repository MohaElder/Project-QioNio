// miniprogram/pages/food/food.js
const db = wx.cloud.database();
const _ = db.command;
const app = getApp();
const util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isCard: true,
    swiperList: [{
      id: 0,
      type: 'image',
      url: 'http://bfsi.eletsonline.com/wp-content/uploads/2017/05/sodexo.jpg'
    }, {
      id: 1,
      type: 'image',
        url: 'https://ca.sodexo.com/files/live/sites/sdxcom-ca/files/Homepage/Stop-Hunger.PNG'
    }],
    order: {
      _id: "",
      name: "",
      desc: "",
      price: "",
      imageURL: "",
      stock: 100
    }
  },

  purchase: function() {
    var that = this;
    wx.showModal({
      title: '提醒',
      content: '你确定要订购吗？',
      success: function(res) {
        if (res.confirm) {
          that.updateOrder();
        } 
        else if (res.cancel) {

        }
      }
    })

  },

  updateOrder: function(){
    var that = this;
    var orderTemp = that.data.order;
    db.collection('order').doc(orderTemp._id).get({//建立或者更新数据库信息
      success: function (res) {
        console.log(res.data);
        if(res.data.stock > 0){
          db.collection('order').doc(orderTemp._id).update({
            data: {
              stock: orderTemp.stock - 1,
            }
          })
          that.updateUser();
        }
        else{
          wx.showToast({
            title: 'Out of Stock!',
          });
          
        }

        // res.data 包含该记录的数据
      },
      fail: function () {
        wx.showToast({
          title: 'FoodID not found!',
        })
      }
    })
  },

  updateUser: function(){
    var that = this;
    var orderTemp = that.data.order;
    db.collection('user').doc(app.globalData.openid).get( {//建立或者更新数据库信息
      success: function (res) {
        db.collection('user').doc(app.globalData.openid).update({
          data: {
            orderID: _.push(orderTemp._id),
            isOrdered:true
          }
        })
        that.updateCheck();
        // res.data 包含该记录的数据
      },
      fail: function () {
        wx.showToast({
          title: 'Error, openID not found!',
        })
      }
    })
  },

updateCheck: function(){
  var that = this;
  var checkID = "moha";
  for (var i = 0; i < 6; i++){
    checkID += Number.parseInt(Math.random() * 10) ;
  }
  var time = util.formatTime(new Date());
  db.collection("check").add({
    data: {
      _id: checkID,
      userID: app.globalData.openid,
      order: this.data.order,
      time:time,
      isFinished:false
    }
  })
  that.updateLocal();
        // res.data 包含该记录的数据
},
  updateLocal: function(){
    var that = this;
    var orderTemp = that.data.order;
    orderTemp.stock -= 1;
    that.setData({
      order: orderTemp,
      isOrdered: true
    })
    app.globalData.isOrdered = true;
    wx.showModal({
      title: '订购成功！',
      content: '前往订单页查看订单详情',
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../self/self',
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var orderList = app.globalData.orderList;
    for (var i = 0; i < orderList.length; i++) {
      if (orderList[i]._id == options.foodID) {
        that.setData({
          isOrdered: app.globalData.isOrdered,
          order: orderList[i]
        })
        i = orderList.length;
      }
    }

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})