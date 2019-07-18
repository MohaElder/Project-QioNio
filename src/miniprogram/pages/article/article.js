const db = wx.cloud.database();
var content = '';

Page({
  data: {
    imageList:[
        "cloud://algorithmapp-f78261.616c-algorithmapp-f78261/sodexInfo/幻灯片1.PNG",
              "cloud://algorithmapp-f78261.616c-algorithmapp-f78261/sodexInfo/幻灯片2.PNG",
              "cloud://algorithmapp-f78261.616c-algorithmapp-f78261/sodexInfo/幻灯片3.PNG",
              "cloud://algorithmapp-f78261.616c-algorithmapp-f78261/sodexInfo/幻灯片4.PNG",
              "cloud://algorithmapp-f78261.616c-algorithmapp-f78261/sodexInfo/幻灯片5.PNG",
              "cloud://algorithmapp-f78261.616c-algorithmapp-f78261/sodexInfo/幻灯片6.PNG",
              "cloud://algorithmapp-f78261.616c-algorithmapp-f78261/sodexInfo/幻灯片7.PNG",
              "cloud://algorithmapp-f78261.616c-algorithmapp-f78261/sodexInfo/幻灯片8.PNG",
              "cloud://algorithmapp-f78261.616c-algorithmapp-f78261/sodexInfo/幻灯片9.PNG",
              "cloud://algorithmapp-f78261.616c-algorithmapp-f78261/sodexInfo/幻灯片10.PNG",
              "cloud://algorithmapp-f78261.616c-algorithmapp-f78261/sodexInfo/幻灯片11.PNG",
              "cloud://algorithmapp-f78261.616c-algorithmapp-f78261/sodexInfo/幻灯片12.PNG",
              "cloud://algorithmapp-f78261.616c-algorithmapp-f78261/sodexInfo/幻灯片13.PNG",
              "cloud://algorithmapp-f78261.616c-algorithmapp-f78261/sodexInfo/幻灯片14.PNG",
              "cloud://algorithmapp-f78261.616c-algorithmapp-f78261/sodexInfo/幻灯片15.PNG",
              "cloud://algorithmapp-f78261.616c-algorithmapp-f78261/sodexInfo/幻灯片16.PNG",

    ],
    md: '# Hello World!'
  },

  //TODOS: 自定义文本编辑器
  
  //页面每次打开运行
  onLoad: function () {
    /*
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
    */
  },

  //渲染Markdown页面
  renderPage: function () {
    var that = this;
    that.setData({
      md: content
    });
  },

  //检测编辑器录入内容
  textareaBInput(e) {
    content = e.detail.value;
  },

});