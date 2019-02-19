//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    userInfo: {},
    addUserInfo: [],
    showAddUserList: false,
    timeLineData: [],
  },
  
  setUserTap: function (e) {
    let params = e.currentTarget.id;
    wx.navigateTo({
      url: '../searchUserPage/searchUserPage?type=' + params
    })
  },

  switchShowAll: function (e) {
    this.setData({
      showAddUserList: !this.data.showAddUserList
    })
  },

  onLoad: function () {
    global.addIdArr = [];
    global.userId = '';
  },

  onShow: function () {
    this.getUserInfo();
    this.getTimeLineData();
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
      let deleteMid = e.detail.mid;
      if (btnName === '切换') {
        // 直接进入搜索页面重新设置自己的账号,未设置成功不更改
        wx.navigateTo({
          url: '../searchUserPage/searchUserPage?type=setUser'
        })
      } 
      if (btnName === '释放') {
        let _this = this;
        wx.showModal({
          title: '释放确认',
          content: '才不是因为ta追的番我不喜欢呢',
          success(res) {
            if (res.confirm) {
              _this.updateAddArr(deleteMid);

            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      } 
    }
  },
  
  updateAddArr: function(deleteMid) {
    let _this = this;
    wx.getStorage({
      key: "addUser",
      success(res1) {
        let addUserArr = JSON.parse(res1.data);
        let showAddUserArr = []; // 界面显示
        let addIdArr = []; // 全局的是否添加记录
        let newArr = []; // 保存的数据
        if (addUserArr.length > 0) {
          for (let index = 0; index < addUserArr.length; index++) {
            let addUserInfo = addUserArr[index];
            let addUserInfoArr = addUserInfo.split("&");
            let mid = addUserInfoArr[0].split("=")[1];
            let uname = addUserInfoArr[1].split("=")[1];
            let upic = addUserInfoArr[2].split("=")[1];
            if (mid !== deleteMid) {
              showAddUserArr.push({ uname, upic, mid })
              addIdArr.push(mid)
              newArr.push(addUserInfo)
            }
          }
        }
        global.addIdArr = addIdArr;
        _this.setData({
          addUserInfo: showAddUserArr
        })
        wx.setStorage({
          key: 'addUser',
          data: JSON.stringify(newArr),
        })
      },
    })
  }, 

  getUserInfo: function() {
    let _this = this;
    
    wx.getStorage({
      key: "userInfo",
      success(res) {
        let userInfo = res.data;
        let userInfoArr = userInfo.split("&");
        let mid = userInfoArr[0].split("=")[1];
        let uname = userInfoArr[1].split("=")[1];
        let upic = userInfoArr[2].split("=")[1];
        global.userId = mid;
        _this.setData({
          userInfo: { uname, upic, mid }
        })
      },
    })
    wx.getStorage({
      key: "addUser",
      success(res1) {
        let addUserArr = JSON.parse(res1.data);
        let showAddUserArr = [];
        let addIdArr = [];
        if (addUserArr.length > 0) {
          for (let index = 0; index < addUserArr.length; index++) {
            let addUserInfo = addUserArr[index];
            let addUserInfoArr = addUserInfo.split("&");
            let mid = addUserInfoArr[0].split("=")[1];
            let uname = addUserInfoArr[1].split("=")[1];
            let upic = addUserInfoArr[2].split("=")[1];
            showAddUserArr.push({ uname, upic, mid })
            addIdArr.push(mid)
          }
        }
        global.addIdArr = addIdArr;
        _this.setData({
          addUserInfo: showAddUserArr
        })
      },
    })
  },

  getTimeLineData: function() {
    let url = "https://bangumi.bilibili.com/web_api/timeline_global"
    wx.request({
      url: url,
      success: res => {
        if (res.data.message === "success") {
          // 原数据是 今天的前六天 + 今天 + 今天的后六天 共13天
          // 这里只用 今天的前三天 + 今天 + 今天的后三天 共7天
          let showTimeData = res.data.result.slice(3, 10);
          this.setData({
            timeLineData: showTimeData
          })
        }
      },
    })
  },
})
