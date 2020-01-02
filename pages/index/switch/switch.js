// components/switch/switch.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: Array
    },
    selectedColor: {
      type: String
    },
    current:{
      type:Number
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    type: 1
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeType: function (e) {
      debugger
    }
  }
})
