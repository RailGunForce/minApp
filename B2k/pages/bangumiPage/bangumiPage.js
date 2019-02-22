// pages/bangumiPage/bangumiPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    media_info: {},
    isShare: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let seasonId = options.seasonId;
    this.getBangumiInfo(seasonId);
    let pageLength = getCurrentPages().length;
    if (pageLength === 1) {
      this.setData({isShare: true})
    }
  },

  getBangumiInfo: function (seasonId) {
    let url = "https://www.bilibili.com/bangumi/play/ss" + seasonId;
    let _this = this;
    wx.request({
      url: url,
      success: res => {
        let x = res.data.lastIndexOf('www.bilibili.com/bangumi/media/');
        let y = res.data.substring(x+31,x.length);
        let z = y.indexOf("/")
        let media_id = res.data.substring(x+31,x+31+z);
        let media_url = "https://www.bilibili.com/bangumi/media/" + media_id;
        wx.request({
          url: media_url,
          success: res => {
            res.data.replace(/<script>window.__initial_state__=(.*);\(function/ig, ($0, $1) => {          
              let media_info = JSON.parse($1).mediaInfo;
              _this.setData({media_info})
            })
          },
        })
      },
    })
  },


  jumpToB: function (e) {
    let seasonId = this.data.media_info.param.season_id;
    //path: 'pages/pgcvideo/pgcvideo?ssid=' + seasonId,
    let path = 'pages/pgcvideo/pgcvideo?ssid=' + seasonId;
    if (e.currentTarget.id !== '') {
      path = 'pages/pgcvideo/pgcvideo?epid=' + e.currentTarget.id;
    }
    wx.navigateToMiniProgram({
      appId: 'wx7564fd5313d24844',
      path: path,
      success(res) {
        // 打开成功
      },
      fail(error) {
        console.log(JSON.stringify(error))
      },
    })
  },

  backHome: function () {
    wx.reLaunch({
      url: '../main/main'
    }) 
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})