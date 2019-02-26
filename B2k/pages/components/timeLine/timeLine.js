// pages/components/timeLine/timeLine.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    timeLineData: {
      type: Array,
      value: [],
      observer (newData) {
        this.afterDataUpdate(newData);
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    animationHeightData: {},
    animationBarData: {},
    currentTime: 3,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    timeLineSwitch: function (e) {
      let switchToDate = e.currentTarget.id
      this.updateTimeLineData(switchToDate);
    },

    bindchange: function (e) {
      let switchToDate = e.detail.currentItemId;
      this.updateTimeLineData(switchToDate);
    },

    chooseAnime: function (e) {
      let seasonId = e.currentTarget.id
      let myEventDetail = { seasonId:  seasonId} // detail对象，提供给事件监听函数
      let myEventOption = {} // 触发事件的选项
      this.triggerEvent('chooseAnimeevent', myEventDetail, myEventOption)
    },
    
    updateTimeLineData: function (switchToDate) {
      let timeLineData = this.data.timeLineData;
      let newTimeLineData = [];
      let currentIndex;
      for (let index = 0; index < timeLineData.length; index ++) {
        let dailyData = timeLineData[index];
        if (dailyData.date === switchToDate) {
          dailyData.is_today = 1;
          currentIndex = index;
        } else {
          dailyData.is_today = 0;
        }
        newTimeLineData.push(dailyData);
      }

      if (currentIndex !== this.data.currentTime) {
        this.setData({
          timeLineData: newTimeLineData,
        })
      }
    },

    afterDataUpdate: function (newData) {
      let newIndex;
      const sysInfo = wx.getSystemInfoSync()
      let pxfix = sysInfo.screenWidth / 750;
      if (newData.length > 0) {
        for (let index = 0; index < newData.length; index++) {
          let dailyData = newData[index];
          if (dailyData.is_today === 1) {
            newIndex = index;
            break;
          }
        }
        let newHeight = newData[newIndex].height;
        const animationOne = wx.createAnimation({
          duration: 300,
          timingFunction: 'ease',
        })
        const animationTwo = wx.createAnimation({
          duration: 300,
          timingFunction: 'ease',
        })
        animationOne.height(newHeight + "rpx").step();
        let newLeft = (newIndex - 3) * 99;
        animationTwo.translateX(newLeft * pxfix).step();
        this.setData({
          currentTime: newIndex,
          animationHeightData: animationOne.export(),
          animationBarData: animationTwo.export(),
        })
      }
    },
  },
})
