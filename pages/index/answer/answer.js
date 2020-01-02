// app实例
const app = getApp()
// 引入默认的地址
const myaxios = require('../../../common/js/request.js')

// pages/index/answer/answer.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    detailId: '',
    answers:[
      {
        avatar: 'https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg',
        nickname: 'Joe',
        answer: '抖音确实很火，也确实沾了一波2019年短视频的热潮，但是在爆火背后隐藏的问题不知道大家可曾想过',
        agree: 1000,
        thanks: 200,
        comment: 138,
        time: '2019-11-20'
      },
      {
        avatar: 'https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg',
        nickname: 'Joe',
        answer: '抖音确实很火，也确实沾了一波2019年短视频的热潮，但是在爆火背后隐藏的问题不知道大家可曾想过',
        agree: 1000,
        thanks: 200,
        comment: 138,
        time: '2019-11-20'
      }, {
        avatar: 'https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg',
        nickname: 'Joe',
        answer: '抖音确实很火，也确实沾了一波2019年短视频的热潮，但是在爆火背后隐藏的问题不知道大家可曾想过',
        agree: 1000,
        thanks: 200,
        comment: 138,
        time: '2019-11-20'
      }
      ]
  },
  getTopic: function(){
    let that = this
    wx.request({
      url: `${myaxios.baseUrl}/topic/${this.data.detailId}`,
      data: {id:this.data.detailId},
      header: {},
      method: 'POst',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        that.setData({
          detail: res.data.data
        })
        
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      detailId: options.id
    })    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getTopic()
    console.log("页面ID"+this.data.detailId)
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