const app = getApp()
const myaxios = require("../../../common/js/request.js")
const utils = require("../../../common/js/util.js")
let header = { 'content-type': 'application/json' }


// pages/my/personal/personal.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selected: 1,
    // 获取用户已经关注的用户列表
    followUserList: [],
    // 用户是否已经关注
    isfollow:false,
    // 用户自身id
    myuserid: '',
    // 当前页面用户id
    userid: '',
    userInfo: {},
    topiclist: [],
    answerlist: [
      {
        title: '阅读书籍可以提高各方面素质，但是人总是读一本忘记一本',
        answer: '谢邀，非常理解题主的疑惑，我刚毕业的时候也面临这样的困惑，让我在那几年里鲜少阅读，现在想起来，觉得比较可惜',
        agree: 100,
        thanks: 50,
        comment: 30,
        createtime: '2020-4-4'
      },
      {
        title: '阅读书籍可以提高各方面素质，但是人总是读一本忘记一本',
        answer: '谢邀，非常理解题主的疑惑，我刚毕业的时候也面临这样的困惑，让我在那几年里鲜少阅读，现在想起来，觉得比较可惜',
        agree: 100,
        thanks: 50,
        comment: 30,
        createtime: '2020-4-4'
      },
      {
        title: '阅读书籍可以提高各方面素质，但是人总是读一本忘记一本',
        answer: '谢邀，非常理解题主的疑惑，我刚毕业的时候也面临这样的困惑，让我在那几年里鲜少阅读，现在想起来，觉得比较可惜',
        agree: 100,
        thanks: 50,
        comment: 30,
        createtime: '2020-4-4'
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let userid=options.userid
    this.setData({
      userid:userid
    })
    console.log(this.data.userid)
  },
  // 获取用户关注用户并判断该用户是否已经关注
  getUserlist: function(){
    
    let that = this
    let userid = wx.getStorageSync('openid')
    myaxios.postRequest(`/follow/user/list/${userid}`, {}, header, (start) => { }, (res) => {
      console.log("获取用户关注用户")
      console.log(res)
      let list = res.list
      that.setData({
        followUserList: list
      })
      
      if(list.length>0){
        let obj = list.find(e => {
          return e.userid == that.data.userid
        })
        console.log("打印当前用户id")
        console.log(obj)
        if (obj) {
          console.log("用户已经关注")
          console.log(obj)
          that.setData({
            isfollow: true
          })
        } else {
          that.setData({
            isfollow: false
          })
        }
      }else{
        
      }
    
      
    }, (err) => { })
  },
  // 收藏用户
  followUser: function(){
    let that = this
    let data = {}
    data.userid = wx.getStorageSync('openid')
    data.followeduserid = this.data.userid
    myaxios.postRequest(`/follow/user`,data,header,(start)=>{},(res)=>{
      console.log("关注用户")
      console.log(res)
      that.getUserinfo()
    },(err)=>{})
  },
  // 取消收藏用户
  cancelUser: function () {
    let that = this
    let data = {}
    data.userid = wx.getStorageSync('openid')
    data.followeduserid = this.data.userid
    myaxios.postRequest(`/cancel/user`, data, header, (start) => { }, (res) => {
      console.log("取消关注用户")
      console.log(res)
      that.getUserinfo()
    }, (err) => { })
  },
  // 获取用户信息
  getUserinfo: function(){
    let that = this
    myaxios.postRequest(`/userinfo/${this.data.userid}`,{},header,(start) =>{},(data)=>{
      console.log("获取用户信息")
      console.log(data)
      let user = data.data
      let topiclist = data.data.topiclist
      that.setData({
        userInfo:user,
        topiclist: topiclist
      })
      that.getUserlist()
    },(err)=>{})
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if (app.globalData.userInfo) {
      // this.setData({
      //   userInfo: app.globalData.userInfo
      // })
    }
  },
  // 跳转到话题信息
  gotoTopic: function(e){
    wx.navigateTo({
      url: `../../index/topic/topic?id=${e.currentTarget.dataset.id}`,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let userid = wx.getStorageSync('openid')
    console.log(userid)
    
    this.setData({
      myuserid: userid
    })
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