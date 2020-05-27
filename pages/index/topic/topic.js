// app实例
const app = getApp()
// 引入默认的地址
const myaxios = require('../../../common/js/request.js')
const utils = require('../../../common/js/util.js')

// pages/index/answer/answer.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isfollow: false,
    rippleStyle: '',
    detail: {},
    detailId: '',
    userid: '',
    reqData: {
      pageNo: 1,
      pageSize: 5,
      id: '',
      abstract: '',
      agree: '',
      createtime: '0000-00-00 00:00:00'
    },
    answers: []
  },
  // 获取用户关注列表
  getUserFollow: function () {
    let that = this
    let userid = wx.getStorageSync('openid')
    wx.request({
      url: `${myaxios.baseUrl}/follow/topic/list/${userid}`,
      data: {},
      header: {},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        console.log("获取用户关注表")
        console.log(res)
        // app.globalData.userInfo.followlist = res.data.list
        let list = res.data.list
        wx.setStorageSync('followlist', JSON.stringify(list))
        console.log(that.data.isfollow)
        that.changeFollow()
        that.getAnswers()
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // 判断是否已经关注
  changeFollow: function() {
    let that = this
    let list = JSON.parse(wx.getStorageSync('followlist'))
    // let list = app.globalData.userInfo.followlist
    console.log("打印用户关注列表")
    console.log(list)
    if (list.length > 0) {
      let obj = list.find(e => {
        return e.id == that.data.detail.id
      })
      if (obj) {
        that.setData({
          isfollow: true
        })
      } else {
        that.setData({
          isfollow: false
        })
      }
    } else {
      that.setData({
        isfollow: false
      })
    }
  },
  // 跳转到回复页面
  gotoReply: function(e){
    wx.navigateTo({
      url: `../../asking/reply/reply?id=${e.currentTarget.dataset.topicid}`,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 话题关注数加一
  followadd: function() {
    let that = this
    wx.request({
      url: `${myaxios.baseUrl}/topic/follow/${this.data.detail.id}`,
      data: this.data.detail,
      header: {},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log("话题关注数增加")
        console.log(res)
        that.getTopic()
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 话题关注数减一
  followsub: function () {
    let that = this
    wx.request({
      url: `${myaxios.baseUrl}/topic/sub/follow/${this.data.detail.id}`,
      data: this.data.detail,
      header: {},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        console.log("话题关注数减少")
        console.log(res)
        that.getTopic()
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // 取消关注
  cancelfollow: function() {
    let that = this
    let data = {}
    data.userid = wx.getStorageSync('openid')
    data.topicid = that.data.detail.id
    console.log("打印取消关注参数")
    console.log(this.data.detail)
    wx.request({
      url: `${myaxios.baseUrl}/cancel/topic`,
      data: data,
      header: {},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log("取消关注")
        console.log(res)
        that.setData({
          isfollow: false
        })
        // 关注数减一
        that.getUserFollow()
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 关注话题
  follow: function() {
    let that = this
    let openid = wx.getStorageSync('openid')
    let data = {
      topicid: that.data.detail.id,
      userid: openid
    }
    wx.request({
      url: `${myaxios.baseUrl}/follow/topic`,
      data: data,
      header: {},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        that.setData({
          isfollow: true
        })
        console.log("关注话题成功")
        console.log(res) 
        that.getUserFollow()
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 获取话题
  getTopic: function() {
    let that = this
    wx.request({
      url: `${myaxios.baseUrl}/topic/${this.data.detailId}`,
      data: {
        id: this.data.detailId
      },
      header: {},
      method: 'POst',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        res.data.data.updatetime = utils.parseTime(res.data.data.updatetime)
        res.data.data.topic = that.dealtext(res.data.data.topic)
        that.setData({
          detail: res.data.data
        })
        that.getUserFollow()
       
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 增加浏览量
  addBrower() {
    console.log(this.data.detail)
    this.data.detail.brower = this.data.detail.brower * 1 + 1
    console.log(this.data.detail)
  },
  // 获取回答列表
  getAnswers: function() {
    let that = this
    let data = {
      pageNo: 1,
      pageSize: 5,
      id: '',
      abstract: '',
      title: '',
      agree: '',
      createtime: '0000-00-00 00:00:00'
    }
    data.topicid = that.data.detailId
    console.log("打印data")
    console.log(data)
    wx.request({
      url: `${myaxios.baseUrl}/answerlist`,
      data: data,
      header: {},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log("执行成功")
        console.log(res)
        let list = res.data.list
        that.setData({
          answers: list
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      detailId: options.id
    })
    console.log("打印topicid")
    console.log(this.data.detailId)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  // 处理图片内容
  dealtext: function (details) {
    var texts = '';//待拼接的内容
    while (details.indexOf('<img') != -1) {//寻找img 循环
      texts += details.substring('0', details.indexOf('<img') + 4);//截取到<img前面的内容
      details = details.substring(details.indexOf('<img') + 4);//<img 后面的内容
      if (details.indexOf('style=') != -1 && details.indexOf('style=') < details.indexOf('>')) {
        texts += details.substring(0, details.indexOf('style="') + 7) + "max-width:100%;height:auto;margin:0 auto;";//从 <img 后面的内容 截取到style= 加上自己要加的内容
        details = details.substring(details.indexOf('style="') + 7); //style后面的内容拼接
      } else {
        texts += ' style="max-width:100%;height:auto;margin:0 auto;" ';
      }
    }
    texts += details;//最后拼接的内容
    return texts
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getTopic()
    console.log("页面ID" + this.data.detailId)
    this.addBrower()
    this.setData({
      userid:wx.getStorageSync('openid')
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },
  // 点击波浪纹
  containerTap: function(res) {
    console.log(res.touches[0]);
    var x = res.touches[0].pageX;
    var y = res.touches[0].pageY + 85;
    this.setData({
      rippleStyle: ''
    });
    this.setData({
      rippleStyle: 'top:' + y + 'px;left:' + x + 'px;-webkit-animation: ripple 0.4s linear;animation:ripple 0.4s linear;'
    });
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  gotoAnswer: function(e) {
    console.log("打印回答")
    console.log(e.currentTarget.dataset.answerid)
    wx.navigateTo({
      url: `../answerdetail/answerdetail?answerid=${e.currentTarget.dataset.answerid}&topicid=${this.data.detailId}`,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})