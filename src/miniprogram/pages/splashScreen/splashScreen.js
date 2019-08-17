import lottie from 'lottie-miniapp';

const canvasContext = wx.createCanvasContext('test-canvas');
// 请求lottie的路径。注意开启downloadFile域名并且返回格式是json
const animationPath = 'https://assets7.lottiefiles.com/packages/lf20_dBbqyA.json';

var db = wx.cloud.database();

canvasContext.canvas = {
  width: 150,
  height: 150
};

// miniprogram/pages/splashScreen/splashScreen.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    emergencyPic:""

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.cloud.callFunction({
      name: 'getDB',
      data: {
        dbName: "emergency"
      }
    })
      .then(res => {
        console.log(res);
        that.setData({
          emergencyPic: res.result.data[0].imageUrl
        });
        wx.hideLoading();
      })
      .catch(console.error);

    // 如果同时指定 animationData 和 path， 优先取 animationData
    lottie.loadAnimation({
      renderer: 'canvas', // 只支持canvas
      loop: true,
      autoplay: true,
      path: animationPath,
      rendererSettings: {
        context: canvasContext,
        clearCanvas: true
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
})