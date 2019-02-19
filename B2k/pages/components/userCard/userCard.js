Component({
  properties:{
    userInfo: {
      type: Object,
      value: {},
    },
    leftbtnName: {
      type: String,
      value: "",
    },
  },
  methods: {
    rightBtnTap: function () {
      let userInfo = this.properties.userInfo;
      let params = 'mid=' + userInfo.mid + '&uname=' + userInfo.uname + '&upic=' + userInfo.upic
      var myEventDetail = {
        'btnName': this.properties.leftbtnName, 
        'mid': userInfo.mid,
        'params': params
      } 
      var myEventOption = {} 
      this.triggerEvent('rightBtnTapevent', myEventDetail, myEventOption)
    },
    cardTap: function () {
      let userInfo = this.properties.userInfo;
      let params = 'mid=' + userInfo.mid + '&uname=' + userInfo.uname + '&upic=' + userInfo.upic
      var myEventDetail = { 'params': params} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('cardTapevent', myEventDetail, myEventOption)
    }
  }
  

})