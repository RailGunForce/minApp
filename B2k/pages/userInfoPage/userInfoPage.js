// pages/userInfoPage/userInfoPage.js
Page({

  nowPage:1,
  /**
   * 页面的初始数据
   */
  data: {
    mid: "", 
    animeData: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let mid = options.mid;
    let uname = options.uname;
    wx.setNavigationBarTitle({
      title: uname
    })
    this.getAnimeData(options.mid)
  },

  getAnimeData: function (mid) {
    let url = "https://space.bilibili.com/ajax/Bangumi/getList?mid=" + mid + "&page=" + this.nowPage;
    wx.request({
      url: url,
      success: res => {
        console.log(res);
        if (res.data.status) {
          let getAnimeData = res.data.data.result;
          let newData = this.data.animeData.concat(getAnimeData);
          this.nowPage += 1;
          this.setData({
            mid: mid,
            animeData: newData
          })
        }
      },
    })
  },

  jumpToWebView: function (e) {
    let ssid = e.target.id;
    console.log(ssid);
    wx.navigateToMiniProgram({
      appId: 'wx7564fd5313d24844',
      path: 'pages/pgcvideo/pgcvideo?ssid=' + ssid,
      success(res) {
        // 打开成功
      },
      fail(error) {
        console.log(JSON.stringify(error))
      },
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
    this.getAnimeData(this.data.mid);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },


})