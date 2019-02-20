// pages/components/timeLine/timeLine.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    timeLineData: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    
    timeLineSwitch: function (e) {
      let switchToDate = e.currentTarget.id
      let myEventDetail = {toDate: switchToDate} // detail对象，提供给事件监听函数
      let myEventOption = {} // 触发事件的选项
      this.triggerEvent('timeLineSwitchevent', myEventDetail, myEventOption)
    },

    chooseAnime: function (e) {
      let seasonId = e.currentTarget.id
      let myEventDetail = { seasonId:  seasonId} // detail对象，提供给事件监听函数
      let myEventOption = {} // 触发事件的选项
      this.triggerEvent('chooseAnimeevent', myEventDetail, myEventOption)
    }

  },
})
