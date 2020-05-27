// 引入默认的地址
const myaxios = require('../../../common/js/request.js')
let header = {
  'content-type': 'application/json'
}


// pages/index/answerdetail/answerdetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 评论列表
    commentList: [],
    commentValue: '',
    // 登录用户id
    userid: '',
    // 用户赞同列表
    userAgreeList: [],
    // 用户关注列表
    userFollowList: [],
    // 判断是否为当前自己
    ismyself: false,
    // 回答用户信息
    userinfo: {},
    topic: {},
    rippleStyle: '',
    topicid: '',
    answerid: '',
    answer: {},
    bottemflag: false,
    // 是否赞同
    isagree: false,
    // 是否关注
    isfollow: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("打印参数")
    console.log(options)
    let tid = options.topicid
    let aid = options.answerid
    this.setData({
      topicid: tid,
      answerid: aid
    })
  },
  // 输入评论
  inputComment: function(e){
    this.setData({
      commentValue : e.detail.value
    })
  },
  // 新建评论
  saveComment:function(){
    let reqData = {
      detail:this.data.commentValue,
      userid:this.data.userid,
      answerid: this.data.answerid,
    }
    let that = this
    myaxios.postRequest(`/save/comment`,reqData,header,()=>{},(res)=>{
      console.log("新建评论")
      console.log(res)
      if(res.success){
        wx.showToast({
          title: '发表成功',
        })
        that.setData({
          commentValue: ''
        })
        that.getcommentList()
      }else{
        wx.showToast({
          title: '新建失败，请重试',
        })
      }
    },(err)=>{})
  },
  // 获取评论列表
  getcommentList: function(){
    let that = this
    myaxios.getRequest(`/comment/list/${this.data.answerid}`,{},header,()=>{},(res) => {
      console.log("获取评论列表")
      console.log(res)
      if(res.success){
        for(let item of res.list){
          item.createtime = item.createtime.substring(0,10)
        }
        that.setData({
          commentList : res.list
        })
      }else{
        wx.showToast({
          title: '新建失败请重试',
        })
      }
    },(err) => {})
  },
  // 跳转个人
  gotoPersonal: function(e) {
    console.log("点击")
    wx.navigateTo({
      url: `../../my/personal/personal?userid=${e.currentTarget.dataset.userid}`,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 赞同
  agreeAnswer: function() {
    let that = this
    let reqData = {}
    reqData.userid = wx.getStorageSync('openid')
    reqData.answerid = this.data.answer.id
    console.log("打印关注")
    console.log(this.data.answer)
    myaxios.postRequest(`/agree/answer`, reqData, header, () => {}, (res) => {
      let data = res.data
      if (res.success) {
        wx.showToast({
          title: '已点赞',
        })
        that.setData({
          isagree: true
        })
      }
      console.log(res)
    }, (err) => {})
  },
  // 取消赞同
  cancelAgree: function() {
    let reqData = {}
    let that = this
    reqData.userid = wx.getStorageSync('openid')
    reqData.answerid = this.data.answer.id
    myaxios.postRequest(`/cancel/agree/answer`, reqData, header, () => {}, (res) => {
      let data = res.data
      console.log(res)
      if (res.success) {
        wx.showToast({
          title: '取消成功',
        })
        that.setData({
          isagree: false
        })
      }
    }, (err) => {})
  },
  // 关注
  followAnswer: function() {
    let that = this
    let reqData = {}
    reqData.userid = wx.getStorageSync('openid')
    reqData.answerid = this.data.answer.id
    myaxios.postRequest(`/follow/answer`, reqData, header, () => {}, (res) => {
      let data = res.data
      console.log(res)
      if (res.success) {
        wx.showToast({
          title: '关注成功',
        })
        that.setData({
          isfollow: true
        })
      }
    }, (err) => {})
  },
  // 取消关注
  cancelFollow: function() {
    let that = this
    let reqData = {}
    reqData.userid = wx.getStorageSync('openid')
    reqData.answerid = this.data.answer.id
    myaxios.postRequest(`/cancel/follow/answer`, reqData, header, () => {}, (res) => {
      let data = res.data
      console.log(res)
      if (res.success) {
        wx.showToast({
          title: '取消关注',
        })
        that.setData({
          isfollow: false
        })
      }
    }, (err) => {})
  },
  // 获取赞同列表
  getAgreeList: function() {
    let that = this
    // wx.showModal({
    //   title: '',
    //   content: `answerid${this.data.answer.id}`,
    // })
    let userid = wx.getStorageSync('openid')
    console.log(this.data.answer)
    myaxios.postRequest(`/answer/agree/list/${userid}`, {}, header, () => {}, (res) => {
      that.setData({
        userAgreeList: res.list
      })
      that.getFollowList()

      // 判断是否已经关注
      for (let item of that.data.userAgreeList) {
        if ((item.id == that.data.answer.id)) {
          console.log("agree进来true")
          that.setData({
            isagree: true
          })
          return true
        }
      }
      console.log(that.data.isagree)
    }, (err) => {})
  },
  // 获取关注列表
  getFollowList: function() {
    let that = this
    let userid = wx.getStorageSync('openid')
    myaxios.postRequest(`/answer/follow/list/${userid}`, {}, header, () => {}, (res) => {
      that.setData({
        userFollowList: res.list
      })
      // 判断是否已经关注

      for (let item of that.data.userFollowList) {
        if ((item.id == that.data.answer.id)) {
          console.log("folllow进来true")
          that.setData({
            isfollow: true
          })
          return true
        }
      }

      that.getcommentList()
    }, (err) => {})
  },
  // 处理图片内容
  dealtext: function(details) {
    var texts = ''; //待拼接的内容
    while (details.indexOf('<img') != -1) { //寻找img 循环
      texts += details.substring('0', details.indexOf('<img') + 4); //截取到<img前面的内容
      details = details.substring(details.indexOf('<img') + 4); //<img 后面的内容
      if (details.indexOf('style=') != -1 && details.indexOf('style=') < details.indexOf('>')) {
        texts += details.substring(0, details.indexOf('style="') + 7) + "max-width:100%;height:auto;margin:0 auto;"; //从 <img 后面的内容 截取到style= 加上自己要加的内容
        details = details.substring(details.indexOf('style="') + 7); //style后面的内容拼接
      } else {
        texts += ' style="max-width:100%;height:auto;margin:0 auto;" ';
      }
    }
    texts += details; //最后拼接的内容
    return texts
  },
  // 获取用户详情
  getUserInfo: function(userid) {
    let that = this
    let data = {
      'userid': userid
    }
    wx.request({
      url: `${myaxios.baseUrl}/userinfo/${userid}`,
      data: data,
      header: {},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log("查询用户信息成功")
        console.log(res)
        let user = res.data.data
        that.setData({
          userinfo: user
        })
        that.getAgreeList()
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 跳转个人
  gotoPersonal: function(e) {
    console.log("点击")
    wx.navigateTo({
      url: `../../my/personal/personal?userid=${e.currentTarget.dataset.userid}`,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 获取回答详情
  getAnswer: function() {
    let that = this
    wx.request({
      url: `${myaxios.baseUrl}/answer/${that.data.answerid}`,
      data: '',
      header: {},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log("打印回答详情")
        console.log(res)
        let data = res.data.data
        data.answer = that.dealtext(data.answer)
        that.setData({
          answer: data
        })

        that.getUserInfo(res.data.data.userid)
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 获取话题性详情
  getTopic: function() {
    let that = this
    wx.request({
      url: `${myaxios.baseUrl}/topic/${that.data.topicid}`,
      data: {},
      header: {},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log("查询成功")
        let data = res.data.data
        that.setData({
          topic: data
        })
        that.getAnswer()
        console.log(that.data.topic)
      },
      fail: function(res) {},
      complete: function(res) {},
    })
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
    this.setData({
      userid: wx.getStorageSync('openid')
    })
    console.log(this.data.isagree)
    console.log(this.data.isfollow)
    this.getTopic()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

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
    this.setData({
      bottemflag: true
    })
    console.log("页面触底")
  },
  onPageScroll: function(e) {
    console.log("页面滚动")
    console.log(e)
    this.setData({
      bottemflag: false
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})