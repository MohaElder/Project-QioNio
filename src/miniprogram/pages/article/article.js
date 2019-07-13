const db = wx.cloud.database();
var content = '';

Page({
  data: {
    md: '# Hello World!'
  },
  onLoad: function () {
    var that = this;
    db.collection('articles').doc('arti001').get({ //建立或者更新数据库信息
      success: function (res) {
        console.log(res.data);
        that.setData({
          md: res.data.content
        });
        // res.data 包含该记录的数据
      },
      fail: function () {
        console.log("Article Not Found!")
      }
    });
  },

  renderPage: function () {
    var that = this;
    that.setData({
      md: content
    });
  },

  textareaBInput(e) {
    content = e.detail.value;
  },

});