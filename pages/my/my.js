const app = getApp()
const myaxios = require("../../common/js/request.js")
let header = { 'content-type': 'application/json' }


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
    // if (app.globalData.userInfo){
    //   this.setData({
    //     userInfo: app.globalData.userInfo
    //   })
    // }
  },
  onTabItemTap(item) {
    // tab 点击时执行
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  gotoHelp:function(){
    wx.navigateTo({
      url: './help/help',
    })
  },
  gotoAbout:function(){
    wx.navigateTo({
      url: './about/about',
    })
  },
  // 完善个人信息页面
  gotoComplete:function(){
    wx.navigateTo({
      url: './complete/complete',
    })
  },
  // 个人页面
  gotoPersonal:function(){
    let userid = wx.getStorageSync('openid')
    wx:wx.navigateTo({
      url: `./personal/personal?userid=${userid}`,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 获取用户信息
  getUserinfo: function () {
    let userid = wx.getStorageSync('openid')
    let that = this
    myaxios.postRequest(`/userinfo/${userid}`, {}, header, (start) => { }, (data) => {
      console.log("获取用户信息")
      console.log(data)
      let user = data.data
      that.setData({
        userInfo: user,
      })
    }, (err) => { })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getUserinfo()
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