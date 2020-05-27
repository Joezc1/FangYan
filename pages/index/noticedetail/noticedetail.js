const myaxios = require('../../../common/js/request.js')

const utils = require('../../../common/js/util.js')

// pages/index/noticedetail/noticedetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noticeid: '',
    notice: {}
  },
  // 获取公告
  getNotice: function(){
    let that = this
    let data = {
      id: this.data.noticeid
    }
    wx.request({
      url: `${myaxios.baseUrl}/notice/${this.data.noticeid}`,
      data: data,
      header: {},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log("查询成功")
        console.log(res)
        let obj = res.data.data
        obj.createtime = utils.parseTime(obj.createtime,'{y}-{m}-{d}')
        obj.detail = that.dealtext(obj.detail)
        that.setData({
          notice : obj
        })
        console.log("打印notice")
        console.log(that.data.notice)
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 处理图片内容
  dealtext: function(details) {
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id
    this.setData({
      noticeid : id
    })
    console.log("打印公告id")
    console.log(this.data.noticeid)
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
    this.getNotice()
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