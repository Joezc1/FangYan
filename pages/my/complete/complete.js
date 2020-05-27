const myaxios = require("../../../common/js/request.js")
let header = {
  'content-type': 'application/json'
}

// pages/my/complete/complete.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['1', '2'],
    index: 0,
    gradeIndex: 0,
    grade: ['大一', '大二', '大三', '大四'],
    sex: ['男', '女'],
    userinfo: {}
  },
  parseTime: function(time, cFormat) {
    if (arguments.length === 0) {
      return null
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
      date = time
    } else {
      if (('' + time).length === 10) time = parseInt(time) * 1000
      date = new Date(time)
    }
    const formatObj = {
      y: date.getFullYear(),
      m: date.getMonth() + 1,
      d: date.getDate(),
      h: date.getHours(),
      i: date.getMinutes(),
      s: date.getSeconds(),
      a: date.getDay()
    }
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
      let value = formatObj[key]
      if (key === 'a') {
        .0.return['一', '二', '三', '四', '五', '六', '日'][value - 1]
      }
      if (result.length > 0 && value < 10) {
        value = '0' + value
      }
      return value || 0
    })
    return time_str
  },
  // 输入昵称
  changeNickname: function(e) {
    let obj = this.data.userinfo
    obj.nickname = e.detail.value
    this.setData({
      userinfo: obj
    })
  },
  // 选择年级
  bindPickerGrade: function(e) {
    let obj = this.data.userinfo
    obj.grade = e.detail.value * 1 + 1
    this.setData({
      gradeIndex:e.detail.value*1,
      userinfo: obj
    })
  },
  // 选择性别
  bindPickerSex: function(e) {
    let obj = this.data.userinfo
    obj.sex = e.detail.value * 1
    this.setData({
      userinfo: obj
    })
  },
  // 选择生日
  bindDateChange: function(e) {
    let obj = this.data.userinfo
    obj.birthday = e.detail.value
    this.setData({
      userinfo: obj
    })
  },
  // 获取用户个人信息
  getUserinfo: function() {
    let userid = wx.getStorageSync('openid')
    let that = this
    myaxios.postRequest(`/userinfo/${userid}`, {}, header, (start) => {}, (data) => {
      console.log("获取用户信息")
      console.log(data)
      let user = data.data
      user.birthday = that.parseTime(user.birthday)
      that.setData({
        userinfo: user,
        gradeIndex: user.grade * 1 - 1
      })
      console.log(that.data.userinfo)
    }, (err) => {})
  },

  // 修改用户信息
  saveUserinfo: function() {
    let that = this
    let reqData = this.data.userinfo
    reqData.iscomplete = 1
    console.log(this.data.userinfo)
    myaxios.postRequest(`/save/user`, reqData, header, (start) => { }, (res) => {
      console.log("修改用户信息")
      console.log(res)
      if(res.success){
        wx.showToast({
          title: '修改成功',
        })
        wx.navigateBack({})
      }

    }, (err) => { })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getUserinfo()
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})