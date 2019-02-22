// pages/searchUserPage/searchUserPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: "", // setUser / addUser
    userData: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let type = options.type;
    let title = type === "setUser" ? "灵魂注入" : "捕捉B站大佬";
    wx.setNavigationBarTitle({
      title: title
    });
    this.setData({type: type})
  },

  doSearch: function (res) {
    let searchText = res.detail.value;
    let url = "https://search.bilibili.com/upuser?keyword=" + searchText;
    if (searchText === '') {
      this.setData({ userData: [] });
    } else {
      wx.request({
        url: url,
        success: res => {
          res.data.replace(/<script>window.__initial_state__=(.*);\(function/ig, ($0, $1) => {
            let userData = JSON.parse($1).userData;
            let showData = this.getDataBeAddRes(userData);
            if (showData) {
              this.setData({ userData: showData });
            } else {
              this.setData({ userData: [] });
            }
          })
        },
      })
    }
    
  },

  getDataBeAddRes: function (userData) {
    let addIdArr = global.addIdArr;
    let userId = global.userId;
    let returnData = [];
    if (addIdArr.length > 0) {
      for (let user of userData) {
        let midStr = user.mid + '';
        if (((addIdArr.indexOf(midStr) !== -1) || midStr === userId)) {
          user.isAdd = true;
        } else {
          user.isAdd = false;
        }
        returnData.push(user);
      }
      return returnData;
    } else {
      return userData;
    }
    
  },

  myEventListener: function (e) {
    let eventType = e.type;
    if (eventType === 'cardTapevent') {
      let params = e.detail.params;
      wx.navigateTo({
        url: '../userInfoPage/userInfoPage?' + params
      })
    }
    if (eventType === 'rightBtnTapevent') {
      let btnName = e.detail.btnName;
      let mid = e.detail.mid;
      let params = e.detail.params;
      if (btnName === '注入灵魂') {
        this.setUser(params);
      }
      if (btnName === '捕捉') {
        this.addIdArr(params, mid);
      }
    }
  },

  setUser: function (params) {
    wx.setStorage({
      key: 'userInfo',
      data: params,
      complete() {
        wx.showToast({
          title: '已注入灵魂',
          icon: 'success',
          duration: 1000
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          });
        }, 1000)
      }
    })
  },

  addIdArr: function (params, mid) {
    let _this = this;
    wx.getStorage({
      key: "addUser",
      success(res) {
        let userArr = JSON.parse(res.data);
        let newArr = [params].concat(userArr);
        wx.setStorage({
          key: 'addUser',
          data: JSON.stringify(newArr),
          complete() {
            wx.showToast({
              title: '捕捉成功',
              icon: 'success',
              duration: 1000
            })
            _this.afterAddUser(mid);
          }
        })
      },
      fail(err) {
        // addUser 未保存过时将走 fail
        wx.setStorage({
          key: 'addUser',
          data: JSON.stringify([params]),
          complete() {
            wx.showToast({
              title: '捕捉成功',
              icon: 'success',
              duration: 1000
            })
            _this.afterAddUser(mid);
          }
        })
      }
    })
  },

  afterAddUser: function (mid) {
    let getAddIdArr= global.addIdArr;
    let midStr = mid + '';
    getAddIdArr.push(midStr);
    global.addIdArr = getAddIdArr;
    let getShowSearchData = this.data.userData;
    let showData = this.getDataBeAddRes(getShowSearchData);
    if (showData) {
      this.setData({ userData: showData });
    } else {
      this.setData({ userData: [] });
    }
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