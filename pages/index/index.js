//index.js
//获取应用实例
const app = getApp()
const myaxios = require('../../common/js/request.js')
var heatlist = []
var recommendlist = []

Page({
  data: {
    boxs: [
      {
        name: '美景'
      },
      {
        name: '资讯'
      },
      {
        name: '热闻'
      }, {
        name: '资讯'
      }
    ],
    imgarr: [{
        title: '贺院最新资讯',
        url: 'https://wx.qlogo.cn/mmopen/vi_32/BSyHb7s62nQ4I3icHerZ036Opic42K8WyCibmvyVJanW3VVfDX978thoCnyOclRVuFTctibvvNBSVEuUjUtNr4ickibg/132'
      },
      {
        title: '贺院美景展示',
        url: 'https://wx.qlogo.cn/mmopen/vi_32/BSyHb7s62nQ4I3icHerZ036Opic42K8WyCibmvyVJanW3VVfDX978thoCnyOclRVuFTctibvvNBSVEuUjUtNr4ickibg/132'
      },
      {
        title: '新生入学须知',
        url: 'https://wx.qlogo.cn/mmopen/vi_32/BSyHb7s62nQ4I3icHerZ036Opic42K8WyCibmvyVJanW3VVfDX978thoCnyOclRVuFTctibvvNBSVEuUjUtNr4ickibg/132'
      }
    ],
    // 轮播参数
    background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,


    // 控制加载推荐
    rflag: false,
    hflag: false,
    recommendData: {
      pageNo: 1,
      pageSize: 10
    },
    heatData: {
      pageNo: 1,
      pageSize: 10
    },
    type: 1,
    title: [{
        name: "推荐"
      },
      {
        name: "热榜"
      }
    ],
    selectedColor: "#FF9900",
    current: 0,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    recommend: [],
    textarr: []
  },
  //事件处理函数
  bindViewTap: function() {
    // wx.navigateTo({
    //   url: '../logs/logs'
    // })
    wx.navigateTo({
      url: '../demo/demo'
    })
  },
  lower: function(e) {
    console.log(e)
  },
  changeType: function(e) {
    let heatData = {
      pageNo: 1,
      pageSize: 10
    }
    recommendlist = []
    heatlist = []
    this.setData({
      textarr: [],
      recommend: [],
      heatData: heatData,
      recommendData: heatData,
      type: e.currentTarget.dataset.type
    })
    console.log("打印")
    console.log(this.data.heatData.pageNo)
    if (this.data.type == 2) {
      this.getHeatList()
    } else {
      this.getTopics()
    }
    console.log(this.data.type)
  },
  onPullDownRefresh: function() {
    if (this.data.type == 2) {
      this.data.heatData.pageNo = 1
      heatlist = []
      let heatData = {
        pageNo: 1,
        pageSize: 10
      }
      this.setData({
        heatData: heatData
      })
      this.getHeatList()
    } else {
      let heatData = {
        pageNo: 1,
        pageSize: 10
      }
      this.setData({
        heatData: heatData
      })
      recommendlist = []
      this.data.recommendData.pageNo = 1
      this.getTopics()
    }
  },
  onHide: function(e) {
    recommendlist = []
    heatlist = []
    let heatData = {
      pageNo: 1,
      pageSize: 10
    }
    this.setData({
      heatData: heatData,
      recommendData: heatData,
      recommend: [],
      textarr: [],
    })
  },
  onShow: function(e) {
    recommendlist = []
    heatlist = []
    let heatData = {
      pageNo: 1,
      pageSize: 10
    }
    this.setData({
      heatData: heatData,
      recommendData: heatData,
      recommend: [],
      textarr: [],
    })
    if (this.data.type == 2) {
      this.getHeatList()
    } else {
      this.getTopics()
    }
  },
  onReachBottom: function(e) {
    if (this.data.type == 2) {
      if (this.data.hflag == true) {
        return false
      } else {
        this.data.heatData.pageNo += 1
        this.getHeatList()
      }
    } else {
      if (this.data.rflag == true) {
        return false
      } else {
        this.data.recommendData.pageNo += 1
        this.getTopics()
      }
    }
  },
  gotoAnswer: function(e) {
    wx: wx.navigateTo({
      url: `./answer/answer?id=${e.currentTarget.dataset.id}`,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 获取热榜数据
  getHeatList: function(e) {
    this.data.hflag = true
    console.log("获取热版数据")
    let that = this
    wx: wx.request({
      url: `${myaxios.baseUrl}/topics/heatlist`,
      data: this.data.heatData,
      header: {},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if (res.data.success) {
          wx.stopPullDownRefresh()
          that.data.hflag = false
          let arr = res.data.data
          for (let item of arr) {
            heatlist.push(item)
          }
          that.setData({
            textarr: heatlist
          })
          console.log(that.data.textarr)
        } else {
          wx.showToast({
            title: '加载失败,请稍后重试',
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 获取推荐数据
  getTopics: function(e) {
    this.data.rflag = true
    console.log("获取推荐数据")
    let that = this
    wx: wx.request({
      url: `${myaxios.baseUrl}/topics`,
      data: this.data.recommendData,
      header: {},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if (res.data.success) {
          wx.stopPullDownRefresh()
          that.data.rflag = false
          let arr = res.data.data
          for (let item of arr) {
            recommendlist.push(item)
          }
          that.setData({
            recommend: recommendlist
          })

          console.log(that.data.recommend)
        } else {
          wx.showToast({
            title: '加载失败,请稍后重试',
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  login: function() {
    let that = this
    wx.login({
      success: function(res) {
        const code = res.code
        wx.request({
          url: `${myaxios.baseUrl}/login/${code}`,
          data: that.data.userInfo,
          header: {},
          method: 'POST',
          dataType: 'json',
          responseType: 'text',
          success: function(res) {
            if (res.data.success) {
              console.log("微信登录")
              console.log(res)
              app.globalData.openid = res.data.data.openid
              app.globalData.session_key = res.data.data.session_key
              console.log(app.globalData.openid)
              console.log(app.globalData.session_key)
            } else {
              wx.showToast({
                title: '加载失败，请刷新'
              })
            }
          },
          fail: function(res) {},
          complete: function(res) {},
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  onLoad: function() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  getUserInfo: function(e) {
    console.log(e)
    if (this.data.userInfo != {} && this.data.userInfo != null) {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      this.login()
    } else {
      return false
    }
  }
})