const myaxios = require('../../../common/js/request.js')
let header = { 'content-type': 'application/json' }


Page({
  data: {
    topicid: '',
    editorText: '',
    formats: {},
    readOnly: false,
    placeholder: '对问题的补充说明，可以更快获得解答（请输入最少10个字）',
    editorHeight: 350,
    keyboardHeight: 0,
    isIOS: false,
  },
  readOnlyChange() {
    this.setData({
      readOnly: !this.data.readOnly
    })
  },
  onLoad(e) {
    this.setData({
      topicid:e.id
    })
    console.log(this.data.topicid)
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
  // 绑定标题
  editorTitle(e) {
    console.log(e)
    this.setData({
      title: e.detail.value
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
    wx.createSelectorQuery().select('#editor').context(function (res) {
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
  onStatusChange(e) {
    const formats = e.detail
    this.setData({
      formats
    })
  },
  insertDivider() {
    this.editorCtx.insertDivider({
      success: function () {
        console.log('insert divider success')
      }
    })
  },
  clear() {
    this.editorCtx.clear({
      success: function (res) {
        console.log("clear success")
      }
    })
  },
  // 创建一个回答
  newReply:function(e){
    let data = {
      answer:this.data.editorText,
      agree: 0,
      thanks: 0,
      comments: 0,
      topicid:this.data.topicid,
      userid:wx.getStorageSync('openid')
    }
    myaxios.postRequest('/save/answer',data,header,(start)=>{},(res)=>{
      console.log('新建一个回答')
      console.log('新建成功')
      wx.showToast({
        title: `${res.msg}`,
      })
    },(err)=>{})
  },
  editorEvent: function (e) {
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
              success: function () {
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