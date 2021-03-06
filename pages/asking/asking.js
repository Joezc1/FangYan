const myaxios = require('../../common/js/request.js')
const app = getApp()

Page({
  data: {
    // 用来控制是否自定义标签
    selectType: 1,
    // 行业数组
    tagslist: [
      '硬件开发',
      '数据库管理',
      '前端开发',
      '后端开发',
      '算法设计',
      '软件测试',
      'UI设计',
      '动画设计',
      '运维',
      '农林牧渔',
      '医药卫生',
      '建筑建材',
      '冶金矿产',
      '石油化工',
      '水利水电',
      '交通运输',
      '信息产业',
      '机械机电',
      '轻工食品',
      '服装纺织',
      '专业服务',
      '安全防护',
      '环保绿化',
      '旅游休闲',
      '电子信息',
    ],
    index: 0,
    // 是否打开弹窗
    isOpen:false,
    topiccover: '',
    editorText: '',
    formats: {},
    readOnly: false,
    placeholder: '对问题的补充说明，可以更快获得解答',
    editorHeight: 350,
    keyboardHeight: 0,
    isIOS: false,
    title: '',
    // tagflag控制选择tag弹窗
    tagflag:false,
    // tag标签
    tag: ''
  },
  readOnlyChange() {
    this.setData({
      readOnly: !this.data.readOnly
    })
  },
  onLoad() {
    const platform = wx.getSystemInfoSync().platform
    const isIOS = platform === 'ios'
    this.setData({
      isIOS
    })
    const that = this
    this.updatePosition(0)
    let keyboardHeight = 0
    // 监听键盘高度
    wx.onKeyboardHeightChange(res => {
      if (res.height === keyboardHeight) return
      const duration = res.height > 0 ? res.duration * 1000 : 0
      keyboardHeight = res.height
      // 设置定时器改变更新键盘高度
      setTimeout(() => {
        wx.pageScrollTo({
          scrollTop: 0,
          success() {
            that.updatePosition(keyboardHeight)
            that.editorCtx.scrollIntoView()
          }
        })
      }, duration)
    })
  },
  bindKeyInput: function (e) {
    this.setData({
      tag: e.detail.value
    })
  },
  // 选择结束
  selectOk(){
    this.setData({
      isOpen:false,
      selectType:1
    })
  },
  // 自定义选择
  personalSelect(){
    this.setData({
      selectType:2
    })
  },
  // 绑定标题
  editorTitle(e) {
    console.log(e)
    this.setData({
      title: e.detail.value
    })
  },
  // tags的picker选择器
  bindPickerChange(e){
    let value = this.data.tagslist[e.detail.value]
    this.setData({
      index: e.detail.value,
      tag: value
    })
  },
  // 更新定键盘高度
  updatePosition(keyboardHeight) {
    const toolbarHeight = 50
    const {
      windowHeight,
      platform
    } = wx.getSystemInfoSync()
    let editorHeight = keyboardHeight > 0 ? (windowHeight - keyboardHeight - toolbarHeight) : windowHeight
    this.setData({
      editorHeight,
      keyboardHeight
    })
    console.log("调用监听键盘事件" + this.data.keyboardHeight)
  },
  calNavigationBarAndStatusBar() {
    const systemInfo = wx.getSystemInfoSync()
    const {
      statusBarHeight,
      platform
    } = systemInfo
    const isIOS = platform === 'ios'
    const navigationBarHeight = isIOS ? 44 : 48
    return statusBarHeight + navigationBarHeight
  },
  onEditorReady() {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function(res) {
      that.editorCtx = res.context
    }).exec()
  },
  blur() {
    this.editorCtx.blur()
  },
  format(e) {
    let {
      name,
      value
    } = e.target.dataset
    if (!name) return
    // console.log('format', name, value)
    this.editorCtx.format(name, value)

  },
  // 上传话题封面图片
  uploadImg() {
    let that = this
    console.log("选择图片")
    wx.chooseImage({
      count: 1,
      success(res) {
        const tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: `${myaxios.baseUrl}/upload`, //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'user': 'test'
          },
          success(res) {
            const data = JSON.parse(res.data)
            let cover = data.url
            console.log(data)
            that.setData({
              topiccover: cover
            })
            console.log("打印上传图片")
            console.log(that.data.topiccover)
            //do something
          }
        })
      }
    })
  },
  // 新增一个话题
  newtopic() {
    let that=this
    if (this.data.topiccover.length==0){
      wx.showToast({
        title: '请上传封面',
      })
      return false
    }
    if(this.data.tag.length==0){
      this.setData({
        isOpen:true
      })
      return false
    }
    let reqData = {
      follow: 0,
      comment: 0,
      brower: 0,
      agree: 0,
      heat: 0,
    }
    if (this.data.editorText.length == '' || this.data.editorText.length == null){
      wx.showToast({
        title: '请输入话题详情',
        icon: 'none'
      })
      return false
    }
    reqData.topic = this.data.editorText
    reqData.title = this.data.title
    reqData.userid = wx.getStorageSync('openid')
    reqData.topiccover = this.data.topiccover
    reqData.updatetime = '0000-00-00 00:00:00'
    reqData.tag = this.data.tag
    console.log("新建话题")
    console.log(reqData)
    wx.request({
      url: `${myaxios.baseUrl}/save/topic`,
      data: reqData,
      header: {},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log("新建话题")
        console.log(res)
        that.setData({
          topic: '',
          title: '',
          editorTitle: '',
          topiccover: '',
          tag: '',
          index: 0
        })
        wx.showToast({
          title: '发布成功',
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  onStatusChange(e) {
    const formats = e.detail
    this.setData({
      formats
    })
  },
  openTag(){
    this.setData({
      isOpen:true
    })
  },
  insertDivider() {
    this.editorCtx.insertDivider({
      success: function() {
        console.log('insert divider success')
      }
    })
  },
  clear() {
    this.editorCtx.clear({
      success: function(res) {
        console.log("clear success")
      }
    })
  },
  editorEvent: function(e) {
    this.setData({
      editorText: e.detail.html
    })
    console.log(this.data.editorText)
  },
  removeFormat() {
    this.editorCtx.removeFormat()
  },
  insertDate() {
    const date = new Date()
    const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    this.editorCtx.insertText({
      text: formatDate
    })
  },
  // 富文本框插入图片
  // insertImage() {
  //   const that = this
  //   wx.chooseImage({
  //     count: 1,
  //     success: function(res) {
  //       console.log("打印选择图片")
  //       console.log(res)
  //       that.editorCtx.insertImage({
  //         src: res.tempFilePaths[0],
  //         data: {
  //           id: 'abcd',
  //           role: 'god'
  //         },
  //         width: '80%',
  //         success: function() {
  //           console.log('insert image success')
  //           console.log(that.editorText)
  //         }
  //       })
  //     }
  //   })
  // }
  insertImage() {
    const that = this
    wx.chooseImage({
      count: 1,
      success(res) {
        const tempFilePaths = res.tempFilePaths
        console.log("打印插入图片")
        console.log(res)
        // 上传服务器后
        wx.uploadFile({
          url: `${myaxios.baseUrl}/upload`, //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'user': 'test'
          },
          success(res) {
            const data = JSON.parse(res.data)
            console.log("上传图片后")
            console.log(data)
            that.editorCtx.insertImage({
              src: data.url,
              data: {
                id: 'abcd',
                role: 'god'
              },
              width: '80%',
              success: function() {
                console.log('insert image success')
                console.log(that.editorText)
              }
            })
            //do something
          }
        })
      }
    })
  }
})