const myaxios = require("../../common/js/request.js")
let header = { 'content-type': 'application/json' }

// pages/follow/follow.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topics:[],
    users:[
      {
        name: '周周',
        detail: '大数据',
        avtar: 'https://wx.qlogo.cn/mmopen/vi_32/BSyHb7s62nQ4I3icHerZ036Opic42K8WyCibmvyVJanW3VVfDX978thoCnyOclRVuFTctibvvNBSVEuUjUtNr4ickibg/132',
        type: 0
      },
      {
        name: '周周',
        detail: '大数据',
        avtar: 'https://wx.qlogo.cn/mmopen/vi_32/BSyHb7s62nQ4I3icHerZ036Opic42K8WyCibmvyVJanW3VVfDX978thoCnyOclRVuFTctibvvNBSVEuUjUtNr4ickibg/132',
        type: 1
      },
      {
        name: '周周',
        detail: '大数据',        
        avtar: 'https://wx.qlogo.cn/mmopen/vi_32/BSyHb7s62nQ4I3icHerZ036Opic42K8WyCibmvyVJanW3VVfDX978thoCnyOclRVuFTctibvvNBSVEuUjUtNr4ickibg/132',
        type: 0
      }
    ],
    selectedType: 1,
    items:[
      {
        name:'话题'
      },
      {
        name: '用户'
      }
    ]
  },
  changeType:function(e){
    this.setData({
      selectedType: e.currentTarget.dataset.type
    })
    console.log(e)
    console.log(this.data.selectedType)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  // 获取用户关注用户并判断该用户是否已经关注
  getUserlist: function () {
    let that = this
    let userid = wx.getStorageSync('openid')
    myaxios.postRequest(`/follow/user/list/${userid}`, {}, header, (start) => { }, (res) => {
      console.log("获取用户关注用户")
      console.log(res)
      let list = res.list
      that.setData({
        users: list
      })
    }, (err) => { })
  },
  onLoad: function (options) {

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onTabItemTap(item) {
    // tab 点击时执行
    if(item.index === 2){
      
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let list =JSON.parse(wx.getStorageSync('followlist'))
    this.setData({
      topics: list
    })
    this.getUserlist()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  gotoTopic: function(e){
    wx.navigateTo({
      url: `../index/topic/topic?id=${e.currentTarget.dataset.id}`,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
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