// miniprogram/pages/superAdmin/superAdmin.js
const db = wx.cloud.database();
var foodName = '';
var foodPrice = 0;
var foodStock = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedImage:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  showNewFood: function(){
    this.setData({
      modalName: "DialogModal1"
    })
  },

  hideModal: function(){
    this.setData({
      modalName: null
    })
  },

  ChooseImage() {
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        this.setData({
          selectedImage: res.tempFilePaths
        })
      }
    });
  },

  ViewImage(e) {
    wx.previewImage({
      url: this.data.selectedImage,
      current: this.data.selectedImage
    });
  },

  DelImg(e) {
    wx.showModal({
      title: '召唤师',
      content: '确定要删除这段回忆吗？',
      cancelText: '再看看',
      confirmText: '再见',
      success: res => {
          this.setData({
            selectedImage: ''
          })
        }
    })
  },

  getName: function(e){
    foodName = e.detail.value;
  },
  
  getStock: function (e) {
    foodStock = e.detail.value;
  },

  getPrice: function (e) {
    foodPrice = e.detail.value;
  },

  addFood: function(){  
    var that = this;
    wx.showLoading({
      title: '正在新建菜品',
    })
    var imageID = "momage";
    for (var i = 0; i < 6; i++) {
      imageID += Number.parseInt(Math.random() * 10);
    }
    wx.cloud.uploadFile({
      cloudPath: 'foodPics/' + imageID,
      filePath: this.data.selectedImage[0], // 文件路径
      success: res => {
        // get resource ID
        console.log(res.fileID)
        db.collection('order').add({
          data: {
            name: foodName,
            price: foodPrice,
            stock: foodStock,
            imageURL:res.fileID,
            goodRateNum: 0,
            rateNum: 0
          },
          success: function(res){
            wx.hideLoading();
            that.hideModal();
            wx.showToast({
              title: '已上传',
            })
          }
        });
      },
      fail: err => {
        // handle error
      }
    })
  }
  
})