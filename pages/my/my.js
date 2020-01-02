const app = getApp()

// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    itemArr:[
      {name: '收藏夹'},
      {name: '关注'}
    ],
    gridArr: [
      {name: '设置'},
      {name:'帮助中心'},
      {name: '关于'}
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo){
      this.setData({
        userInfo: app.globalData.userInfo
      })
    }
  },
  onTabItemTap(item) {
    // tab 点击时执行
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  gotoPersonal:function(){
    wx:wx.navigateTo({
      url: './personal/personal',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
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