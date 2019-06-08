//index.js
const app = getApp()
const db = wx.cloud.database();

//const userSearcher = db.collection('user');
Page({
  data: {
    user: {},
    isCard: true,
    logged: false,
    takeSession: false,
    requestResult: '',
    swiperList: [{
      id: 0,
      type: 'image',
      url: 'https://wx2.sinaimg.cn/mw690/006tozhpgy1g03uqzlrfyj31dc0ww1g2.jpg'
      }, {
        id: 1,
        type: 'image',
        url: 'https://wx2.sinaimg.cn/mw690/006tozhpgy1g03ur2znb5j31dc0wwdw0.jpg'
      }],
    orderList: []

  },

  onLoad: function() {
    this.onGetOpenid()
    this.upload();
  },

  upload: function () {
    console.log("Running Upload")
    console.log("openid inside Upload:" + app.globalData.openid)
    //var Time = util.formatTime(new Date());
    db.collection('user').doc(app.globalData.openid).get({//建立或者更新数据库信息
      success: function (res) {
        console.log("Found Match")
        app.globalData.user = res.data.user;
        console.log("Completed!")
        var that = this;
        that.setData({
          orderList: app.globalData.orderList,
          user: app.globalData.user
        })
        // res.data 包含该记录的数据
        wx.showModal({
          title: 'Status',
          content: 'Login Complete!',
        });
      },
      fail: function () {
        console.log("No Match")
        wx.getUserInfo({
          success: function (res){
            var userInfo = res.userInfo;
            var user = { info: userInfo, orderID:[]};
            app.globalData.user = user;
            db.collection('user').add({
              data: {
                _id:openid,
                user: app.globalData.user
              }
            })
            that.setData({
              orderList: app.globalData.orderList,
              user: app.globalData.user
            })            
            console.log(app.globalData.user)
            wx.showModal({
              title: 'Status',
              content: 'Your profile has been created!',
            });
          },
          fail: function (res) {
          }
        })
        // 获取用户信息
      }
    })
  },

  toFood: function(e){
    var id = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.name;
    var link = '../food/food?foodID=' + id;
    console.log(link);
    wx.navigateTo({
      url: link,
    })
  },

  toSelf: function(){
    wx.navigateTo({
      url: '../self/self',
    })
  },

  onGetOpenid: function () {
    console.log("Getting Openid......")
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        //console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        //console.log(res.result.openid)
        console.log("Got openID! openID: " + app.globalData.openid);
      },
      fail: err => {
        //console.error('[云函数] [login] 调用失败', err)
        wx.showModal({
          title: '警告',
          content: '出了点问题',
        })
      }
    })
  },

})