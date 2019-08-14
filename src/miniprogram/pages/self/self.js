//index.js
const app = getApp();
var checkList = [];
var currentOrderID = "";
var currentCheckID = "";
var wxbarcode = require('../../utils/index.js');
var count = 0;
var db = wx.cloud.database();

Page({
  data: {
    isBlur:false,
    isFilled: false,
    user: {},
    checkList: [],
    selectedImageUrl:"https://wx2.sinaimg.cn/mw690/006tozhpgy1g5yyrdsiffj31hc0u0b2f.jpg",
    artworks:[
      "https://wx3.sinaimg.cn/mw690/006tozhpgy1g5yystak22j31hc0u0npu.jpg",
      "https://wx2.sinaimg.cn/mw690/006tozhpgy1g5yyrdsiffj31hc0u0b2f.jpg",
      "https://wx1.sinaimg.cn/mw690/006tozhpgy1g5yyrbdd4xj31hc0u0qv8.jpg",
      "https://wx3.sinaimg.cn/mw690/006tozhpgy1g5yyrb45nxj31hc0u0kjo.jpg",
      "https://wx2.sinaimg.cn/mw690/006tozhpgy1g5yyrcdmbrj31900u01l3.jpg",
      "https://wx1.sinaimg.cn/mw690/006tozhpgy1g5yyrcer6fj31900u0u12.jpg",
      "https://wx3.sinaimg.cn/mw690/006tozhpgy1g5yyrd3bzgj31900u07wo.jpg",
      "https://wx3.sinaimg.cn/mw690/006tozhpgy1g5yyrbfefkj31hc0u0b2d.jpg",
      "https://wx3.sinaimg.cn/mw690/006tozhpgy1g5yyrbfefkj31hc0u0b2d.jpg",
      "https://wx1.sinaimg.cn/mw690/006tozhpgy1g5yyrpiinxj31hc0u0hdw.jpg",
      "https://wx3.sinaimg.cn/mw690/006tozhpgy1g5zemy7f31j31900u0kjq.jpg",
      "https://wx3.sinaimg.cn/mw690/006tozhpgy1g5zemy7f31j31900u0kjq.jpg",
      "https://wx2.sinaimg.cn/mw690/006tozhpgy1g5zemxa2i1j31900u0qv8.jpg",
      "https://wx1.sinaimg.cn/mw690/006tozhpgy1g5zemx6ihrj31hc0u0npg.jpg",
      "https://wx2.sinaimg.cn/mw690/006tozhpgy1g5zemxnz0sj31900u0hdx.jpg",
      "https://wx1.sinaimg.cn/mw690/006tozhpgy1g5zemwt6lzj31900u0qv7.jpg",
      "https://wx4.sinaimg.cn/mw690/006tozhpgy1g5zemzle6tj31900u0qva.jpg",
      "https://wx1.sinaimg.cn/mw690/006tozhpgy1g5zemzfz59j31hc0u01l2.jpg",
      "https://wx1.sinaimg.cn/mw690/006tozhpgy1g5zemzzmsgj31900u01l4.jpg",
      "https://wx1.sinaimg.cn/mw690/006tozhpgy1g5zenmgujyj31900u0e87.jpg",
      "https://wx1.sinaimg.cn/mw690/006tozhpgy1g5zenix786j31hc0u0x6s.jpg",
      "https://wx4.sinaimg.cn/mw690/006tozhpgy1g5zenk9ufqj31900u04qv.jpg",
      "https://wx2.sinaimg.cn/mw690/006tozhpgy1g5zenkxzhsj31900u0b2g.jpg",
      "https://wx2.sinaimg.cn/mw690/006tozhpgy1g5zenkxzhsj31900u0b2g.jpg",
      "https://wx2.sinaimg.cn/mw690/006tozhpgy1g5zennl54vj31900u0kju.jpg",
      "https://wx3.sinaimg.cn/mw690/006tozhpgy1g5zenl22ehj31hc0u01l2.jpg",
      "https://wx3.sinaimg.cn/mw690/006tozhpgy1g5zenkcwwzj31900u07wn.jpg",
      "https://wx2.sinaimg.cn/mw690/006tozhpgy1g5zenjrix7j31900u0e86.jpg"
    ]
  },

  //每次页面打开运行
  onLoad: function () {
    wx.showLoading({
      title: '正在打发土地爷',
    });
    checkList = [];
    var that = this;
    wx.cloud.callFunction({
      name: 'getDB',
      data: {
        dbName: "check"
      }
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
        wx.hideLoading();
      })
      .catch(console.error);
  },

  //显示弹窗
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target,
      isBlur:true
    });
    currentCheckID = e.currentTarget.dataset.checkid;
    currentOrderID = e.currentTarget.dataset.orderid;
  },

  //隐藏弹窗
  hideModal(e) {
    wxbarcode.qrcode('qrcode', 'FreedomIsNotFree', 0, 0);
    this.setData({
      modalName: null,
      isBlur:false
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
      isBlur:true,
      modalName: "Modal2"
    });
  },

  onPullDownRefresh: function () {
    wx.reLaunch({
      url: '../self/self',
    })
  },

  onShow: function(){
    this.setBackgroundImage();
  },

  setBackgroundImage: function(){
    var artworks = this.data.artworks;
    this.setData({
      selectedImageUrl: artworks[Math.floor((Math.random() * artworks.length))]
    })
  },

  roll: function(){
    count += 1;
    if(count ==3){
      count = 0;
      this.setBackgroundImage();
    }
  }


});