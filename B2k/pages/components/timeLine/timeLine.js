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
    
    chooseBangumi: function () {

    },

  },

  getShowAnimeData: function (timeLineData) {
    console.log(timeLineData);
    let returnData = {};
    for (let index = 0; index < timeLineData.length; index++) {
      if (timeLineData[index].is_today === 1) {
        returnData = data;
        break;
      }
    }
    console.log(returnData);
    return returnData;
  },
})
