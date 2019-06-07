// miniprogram/pages/food/food.js

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isOrdered: false,
    isCard: true,
    swiperList: [{
      id: 0,
      type: 'image',
      url: 'https://wx2.sinaimg.cn/mw690/006tozhpgy1g03uqzlrfyj31dc0ww1g2.jpg'
    }, {
      id: 1,
      type: 'image',
      url: 'https://wx2.sinaimg.cn/mw690/006tozhpgy1g03ur2znb5j31dc0wwdw0.jpg'
    }],
    order: {
      foodID: "",
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
          var orderTemp = that.data.order;
          orderTemp.stock -= 1;
          that.setData({
            order: orderTemp,
            isOrdered: true
          })
          app.globalData.user.orderID = that.data.order.foodID;
          console.log(app.globalData.user.orderID);
          wx.showModal({
            title: '订购成功！',
            content: '前往订单页查看订单详情',
            success: function(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../self/self',
                })
              }
            }
          })
        } else if (res.cancel) {}
      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options.foodID);
    var that = this;
    var orderList = app.globalData.orderList;
    console.log(orderList);
    for (var i = 0; i < orderList.length; i++) {
      if (orderList[i].foodID == options.foodID) {
        that.setData({
          order: orderList[i]
        })
        i = orderList.length;
      }
    }
    if (app.globalData.user.orderID != "") {
      that.setData({
        isOrdered: true
      })
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