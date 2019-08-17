// miniprogram/pages/superAdmin/superAdmin.js
const db = wx.cloud.database();
var foodName = '';
var foodPrice = 0;
var foodStock = 0;
var chosenText = '';
var currentOrderID = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedImage: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var checkList = [];
    var userList = [];
    var orderList = [];
    var swiperList = [];
    var sayingsList = [];
    var axiomsList = [];
    wx.showLoading({
      title: '准备所有信息',
    })
    //TODO: Make it much more elegant
    wx.cloud.callFunction({
        name: 'getDB',
        data: {
          dbName: "check"
        }
      })
      .then(res => {
        checkList = res.result.data;
        wx.cloud.callFunction({
            name: 'getDB',
            data: {
              dbName: "user"
            }
          })
          .then(res => {
            userList = res.result.data;
            wx.cloud.callFunction({
                name: 'getDB',
                data: {
                  dbName: "order"
                }
              })
              .then(res => {
                orderList = res.result.data;
                wx.cloud.callFunction({
                    name: 'getDB',
                    data: {
                      dbName: "sodexPlaceHolder"
                    }
                  })
                  .then(res => {
                    swiperList = res.result.data;
                    wx.cloud.callFunction({
                        name: 'getDB',
                        data: {
                          dbName: "sayings"
                        }
                      })
                      .then(res => {
                        sayingsList = res.result.data;
                        wx.cloud.callFunction({
                            name: 'getDB',
                            data: {
                              dbName: "axioms"
                            }
                          })
                          .then(res => {
                            axiomsList = res.result.data;
                            that.setData({
                              checkList: checkList,
                              userList: userList,
                              orderList: orderList,
                              swiperList: swiperList,
                              sayingsList: sayingsList,
                              axiomsList: axiomsList
                            })
                            wx.hideLoading();
                          })
                      })
                  })
              })
              .catch(console.error);
          })
          .catch(console.error);
      })
      .catch(console.error);

  },

  showModal: function(options) {
    currentOrderID = options.currentTarget.dataset.id;
    this.setData({
      modalName: options.currentTarget.dataset.modalname
    })
  },

  hideModal: function() {
    this.setData({
      modalName: null
    })
  },

  deleteAxiom: function(options) {
    wx.cloud.callFunction({
      name: 'deleteDB',
      data: {
        dbName: 'axioms',
        id: options.currentTarget.dataset.id
      }
    }).catch(console.error);
    wx.showToast({
      title: '删除成功！',
    })
  },

  goToAxiom: function(options) {
    wx.showLoading({
      title: '正在移入精选',
    })
    for (var i = 0; i < this.data.sayingsList.length; i++) {
      if (this.data.sayingsList[i]._id == options.currentTarget.dataset.id) {
        db.collection('axioms').add({
          data: {
            text: this.data.sayingsList[i].text
          },
          success: function(res) {
            wx.hideLoading();
            wx.showToast({
              title: '已移入精选',
            })
            wx.cloud.callFunction({
              name: 'deleteDB',
              data: {
                dbName: 'sayings',
                id: options.currentTarget.dataset.id
              }
            }).catch(console.error);
          }
        })
      }
    }

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
      title: 'warning',
      content: 'Delete Pic?',
      cancelText: 'Cancel',
      confirmText: 'Confirm',
      success: res => {
        this.setData({
          selectedImage: ''
        })
      }
    })
  },

  getName: function(e) {
    foodName = e.detail.value;
  },

  getStock: function(e) {
    foodStock = e.detail.value;
  },

  getPrice: function(e) {
    foodPrice = e.detail.value;
  },

  getText: function(e) {
    chosenText = e.detail.value;
  },

  addFood: function() {
    var that = this;
    wx.showLoading({
      title: '正在新建菜品',
    })
    var imageID = "momage";
    for (var i = 0; i < 6; i++) {
      imageID += Number.parseInt(Math.random() * 10);
    }
    imageID += ".png";
    var foodID = "mofood";
    for (var i = 0; i < 6; i++) {
      foodID += Number.parseInt(Math.random() * 10);
    }
    this.uploadFood(imageID, foodID);
  },

  uploadFood: function(imageID, foodID) {
    wx.cloud.uploadFile({
      cloudPath: 'foodPics/' + imageID,
      filePath: this.data.selectedImage[0], // 文件路径
      success: res => {
        // get resource ID
        db.collection('order').add({
          data: {
            _id: foodID,
            name: foodName,
            price: foodPrice,
            stock: foodStock,
            imageURL: res.fileID,
            goodRateNum: 0,
            rateNum: 0
          },
          success: function(res) {
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
  },

  addCover: function() {
    var that = this;
    wx.showLoading({
      title: '正在上传图片',
    })
    var imageID = "momage";
    for (var i = 0; i < 6; i++) {
      imageID += Number.parseInt(Math.random() * 10);
    }
    imageID += ".png";
    wx.cloud.uploadFile({
      cloudPath: 'sodexPlaceHolder/' + imageID,
      filePath: this.data.selectedImage[0], // 文件路径
      success: res => {
        // get resource ID
        db.collection('sodexPlaceHolder').add({
          data: {
            url: res.fileID
          },
          success: function(res) {
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
  },

  addAlarm: function() {
    var that = this;
    db.collection('emergencyMessages').add({
      data: {
        content: chosenText
      },
      success: function(res) {
        wx.cloud.callFunction({
          name: 'getDB',
          data: {
            dbName: "user"
          }
        })
          .then(res => {
            for(var i = 0; i< res.result.data.length; i++){
              wx.cloud.callFunction({
                name: 'updateDB',
                data: {
                  dbName: "user",
                  id:res.result.data[i]._id,
                  isAlarmed: false
                }
              })
            }
          }).then(res => {
            wx.hideLoading();
            wx.showToast({
              title: '全局通知已推送',
            })
            that.setData({
              modalName: null
            })
          })
      }
    })
  },

  // ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },

  // ListTouch计算方向
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    })
  },

  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection == 'left') {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },

  toGulag: function(options) {
    wx.cloud.callFunction({
      name: 'updateDB',
      data: {
        dbName: "user",
        id: options.currentTarget.dataset.id,
        isAdmin: false,
        isPrisoner: true
      }
    }).then(res => {
      wx.showToast({
        title: 'Gulagged!',
      })
      wx.reLaunch({
        url: '../superAdmin/superAdmin',
      })
    }).catch(console.error);

  },

  deleteUser: function(options) {
    wx.cloud.callFunction({
      name: 'deleteDB',
      data: {
        dbName: 'user',
        id: options.currentTarget.dataset.id
      }
    }).then(res => {
      wx.showToast({
        title: 'Deleted!',
      })
      wx.reLaunch({
        url: '../superAdmin/superAdmin',
      })
    }).catch(console.error);
  },

  promoteUser: function(options) {
    wx.cloud.callFunction({
      name: 'updateDB',
      data: {
        dbName: "user",
        id: options.currentTarget.dataset.id,
        isAdmin: true,
        isPrisoner: false
      }
    }).then(res => {
      wx.showToast({
        title: 'Promoted!',
      })
      wx.reLaunch({
        url: '../superAdmin/superAdmin',
      })
    }).catch(console.error);
  },

  deleteCheck: function(options) {
    wx.cloud.callFunction({
      name: 'deleteDB',
      data: {
        dbName: 'check',
        id: options.currentTarget.dataset.id
      }
    }).then(res => {
      wx.showToast({
        title: 'Deleted!',
      })
      wx.reLaunch({
        url: '../superAdmin/superAdmin',
      })
    }).catch(console.error);
  },

  changeStock: function() {
    wx.cloud.callFunction({
      name: 'updateDB',
      data: {
        dbName: "order",
        id: currentOrderID,
        stock: foodStock
      }
    }).then(res => {
      wx.showToast({
        title: 'Changed!',
      })
      wx.reLaunch({
        url: '../superAdmin/superAdmin',
      })
    }).catch(console.error);
  },

  deleteOrder: function(options) {
    wx.cloud.callFunction({
      name: 'deleteDB',
      data: {
        dbName: 'order',
        id: options.currentTarget.dataset.id
      }
    }).then(res => {
      wx.showToast({
        title: 'Deleted!',
      })
      wx.reLaunch({
        url: '../superAdmin/superAdmin',
      })
    }).catch(console.error);
  },

  deleteCover: function(options) {
    wx.cloud.callFunction({
      name: 'deleteDB',
      data: {
        dbName: 'sodexPlaceHolder',
        id: options.currentTarget.dataset.id
      }
    }).then(res => {
      wx.showToast({
        title: 'Deleted!',
      })
      wx.reLaunch({
        url: '../superAdmin/superAdmin',
      })
    }).catch(console.error);
  },

  goBack: function() {
    wx.navigateTo({
      url: '../index/index',
    })
  },

  onPullDownRefresh: function() {
    wx.reLaunch({
      url: '../superAdmin/superAdmin',
    })
  }

})