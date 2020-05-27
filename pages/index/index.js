//index.js
//获取应用实例
const app = getApp()
const myaxios = require('../../common/js/request.js')
const utiljs = require('../../common/js/util.js')
var heatlist = []
var recommendlist = []

let header = {
  'content-type': 'application/json'
}


let token = wx.getStorageSync('token')


Page({
  data: {
    // 阻止滚动冒泡
    scrollflag: false,
    // 显示搜索内容
    searchflag: false,
    // 控制遮罩层显示
    showmask: 0,
    // 计算遮罩层高度
    maskheight: '',
    // 屏幕高度
    screenheight: 0,
    // 
    searchlist: [],
    rippleStyle: '',
    // 轮播数组
    imgarr: [],
    // 轮播参数
    background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,

    // topic
    topic: {
      abstract: "",
      agree: 0,
      brower: 0,
      comment: 0,
      follow: 0,
      heat: 0,
      id: '',
      title: "",
      topic: "",
      topiccover: "",
      createtime: "",
      updatetime: ""
    },
    // 控制加载推荐
    rflag: false,
    hflag: false,
    recommendData: {
      id: '',
      title: '',
      pageNo: 1,
      pageSize: 10,
    },
    heatData: {
      id: '',
      title: '',
      pageNo: 1,
      pageSize: 10
    },
    stopScroll: true,
    searchReqdata: {
      pageNp: 1,
      pageSize: 50,
      title: ''
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
  // 输入搜索框的时候
  inputSearch: function(e){
    let that = this
    let obj = {
      pageNo: 1,
      pageSize: 50,
      userid: '',
      title: e.detail.value
    }
    myaxios.postRequest('/search/list',obj,header,()=>{},(res)=>{
      if(res.success){
        that.setData({
          searchlist : res.list
        })
        console.log(that.data.searchlist)
      }else{
        wx.showToast({
          title: '查询失败',
        })
      }
    },(err)=>{})
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
  // 点击取消
  cancelSearch:function(){
    this.setData({
      searchflag: false,
      showmask: false,
      scrollflag: false
    })
  },
  openSearch: function () {
    this.setData({
      searchflag: true,
      showmask: true,
      scrollflag: true
    })
    wx.stopPullDownRefresh()
  },
  // 跳转个人
  gotoPersonal: function(e) {
    console.log("点击")
    wx.navigateTo({
      url: `../my/personal/personal?userid=${e.currentTarget.dataset.userid}`,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 获取公告列表
  getNoticesList: function() {
    let that = this
    let reqdata = {
      id: '',
      title: '',
      createtime: '0000-00-00 00:00:00',
      author: '',
      pageNo: 1,
      pageSize: 10,
    }
    wx.request({
      url: `${myaxios.baseUrl}/notice/list`,
      data: reqdata,
      header: {
        'token': token
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log("获取公告列表")
        console.log(res)
        let list = res.data.list
        that.setData({
          imgarr: list
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 点击进入公告页面
  gotoNotice: function(e) {
    wx.navigateTo({
      url: `./noticedetail/noticedetail?id=${e.currentTarget.dataset.id}`,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 点击切换
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
  // 话题浏览
  browerTopic: function(data, id) {
    let that = this
    wx.request({
      url: `${myaxios.baseUrl}/topic/brower/${id}`,
      data: data,
      header: {
        'token': token
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        wx: wx.navigateTo({
          url: `./topic/topic?id=${id}`,
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 获取话题
  getTopic: function(id) {
    let that = this
    wx.request({
      url: `${myaxios.baseUrl}/topic/${id}`,
      data: {
        id: this.data.detailId
      },
      header: {
        'token': token
      },
      method: 'POst',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log("执行成功")
        console.log(res)
        let detail = {
          abstract: res.data.data.abstract,
          agree: res.data.data.agree,
          brower: res.data.data.brower,
          comment: res.data.data.comment,
          follow: res.data.data.follow,
          heat: res.data.data.heat,
          id: res.data.data.id,
          title: res.data.data.title,
          topic: res.data.data.topic,
          topiccover: res.data.data.topiccover,
          createtime: res.data.data.createtime,
          updatetime: res.data.data.updatetime,
          userid: res.data.data.userid,
          type: res.data.data.type
        }
        detail.createtime = utiljs.parseTime(detail.createtime)
        detail.updatetime = utiljs.parseTime(detail.updatetime)
        that.setData({
          topic: detail
        })
        console.log("打印detail")
        console.log(detail)
        that.browerTopic(detail, res.data.data.id)
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 获取设备信息
  saveSysinfo: function() {
    let that = this
    let reqData = {
      type: 0,
      userid: '' || wx.getStorageSync('openid')
    }
    console.log("获取设备信息")
    'iOS Android'
    wx.getSystemInfo({
      success(res) {
        console.log(res.system)
        let systype = res.system
        reqData.type = systype.indexOf('iOS') != -1 ? 1 : 0
      
        that.setData({
          maskheight: 'top:'+320 + 'rpx'
        })
        console.log(that.data.maskheight)
        myaxios.postRequest(`/save/sysinfo`, reqData, () => {}, (res) => {
          console.log("保存设备类型")
          console.log(res)
        }, (error) => {})
      }
    })
  },
  // 下拉刷新
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
    console.log(app)
    recommendlist = []
    heatlist = []
    this.saveSysinfo()
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
    this.getNoticesList()
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
    console.log("指向")
    let that = this
    that.getTopic(e.currentTarget.dataset.id)
  },
  // 获取热榜数据
  getHeatList: function(e) {
    this.data.hflag = true
    console.log("获取热版数据")
    let that = this
    wx: wx.request({
      url: `${myaxios.baseUrl}/topics/heatlist`,
      data: this.data.heatData,
      header: {
        'token': token
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if (res.data.success) {
          wx.stopPullDownRefresh()
          that.data.hflag = false
          let arr = []
          for (let item of res.data.data) {
            if (item.type == 2) {
              arr.push(item)
            }
          }
          // res.data.data
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
      header: {
        'token': token
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if (res.data.success) {
          wx.stopPullDownRefresh()
          that.data.rflag = false
          let arr = []
          for (let item of res.data.data) {
            if (item.type == 2) {
              arr.push(item)
            }
          }
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
  // 微信授权登录
  login: function() {
    let that = this
    wx.login({
      success: function(res) {
        const code = res.code
        wx.request({
          url: `${myaxios.baseUrl}/user/login/${code}`,
          data: that.data.userInfo,
          header: {
            'token': token
          },
          method: 'POST',
          dataType: 'json',
          responseType: 'text',
          success: function(res) {
            if (res.data.success) {
              console.log("微信登录")
              console.log(res)
              let openid = res.data.data.wxbody.openid
              let token = res.data.data.token
              wx.setStorageSync('token', token)
              let session_key = res.data.data.wxbody.session_key
              wx.setStorageSync('openid', openid)
              wx.setStorageSync('session_key', session_key)
              app.globalData.openid = openid
              app.globalData.session_key = session_key
              wx.setStorage({
                key: 'login',
                data: 1,
              })
              that.getUserFollow()
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
  // 获取用户关注列表
  getUserFollow: function() {
    let that = this
    let userid = wx.getStorageSync('openid')
    wx.request({
      url: `${myaxios.baseUrl}/follow/topic/list/${userid}`,
      data: {},
      header: {
        'token': token
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log("获取用户关注表")
        console.log(res)
        // app.globalData.userInfo.followlist = res.data.list
        let list = res.data.list
        wx.setStorageSync('followlist', JSON.stringify(list))
        console.log(app.globalData)
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 获取用户授权
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