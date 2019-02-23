//index.js
//获取应用实例
const app = getApp();


Page({

  chooseTimeLine: "",

  data: {
    userInfo: {},
    addUserInfo: [],
    showAddUserList: false,
    timeLineData: [],

    animationListData: {},
    animationImgBarData: {},
    animationImgDataArr: [],
    animationCardData: {},
  },
  
  setUserTap: function (e) {
    let params = e.currentTarget.id;
    wx.navigateTo({
      url: '../searchUserPage/searchUserPage?type=' + params
    })
  },

  switchShowAll: function (e) {
    let isShow = this.data.showAddUserList;
    if (isShow) {
      this.hiddenAnimation();
    } else {
      this.showAnimation();
    }
  },

  /*
  1.还是应该在展开动作完成后,把这个头像栏隐藏了,不然会影响展开时的添加删除结果
  2. 展开后,100ms 之后,隐藏头像栏,显示原头像
  3. 收起时,隐藏原头像,显示头像栏,然后进行动画
  */

  showAnimation: function () {
    const sysInfo = wx.getSystemInfoSync()
    let pxfix = sysInfo.screenWidth / 750;
    let imageArr = this.data.addUserInfo;
    const animationOne = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease',
    })
    let tpHeight = 225 + imageArr.length * 140
    animationOne.height(tpHeight + "rpx").step()
    const animationImgBar = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease',
      transformOrigin: '0% 100% 0',
    })
    animationImgBar.rotate(90).translateX(-22 * pxfix).translateY(-8 * pxfix).step()
    let animaArr = [];
    for (let index = 0; index < imageArr.length; index++) {
      let transform = (50 + index * 115) + '% 50% 0';
      const animationImage = wx.createAnimation({
        duration: 400,
        timingFunction: 'ease',
        //transformOrigin: transform,
      })
   
      //let offSetX = index * 92;
      let offSetX = index * 73.5;
      
      // animationImage.scale(1.25).rotate(-90).translateX(offSetX * pxfix).step();
      animationImage.scale(1.25).translateX(offSetX * pxfix).step();
      animaArr.push(animationImage.export())
    }
    this.setData({
      animationListData: animationOne.export(),
      animationImgBarData: animationImgBar,
      animationImgDataArr: animaArr,
      showAddUserList: true
    })
    setTimeout(()=>{
      const animationCard = wx.createAnimation({
        duration: 200,
        timingFunction: 'ease',
      })
      animationCard.opacity(1).step();
      this.setData({
        animationCardData: animationCard.export(),
      })
    },100)
  },

  hiddenAnimation: function () {
    const animationCard = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease',
    })
    animationCard.opacity(0).step();
    this.setData({
      animationCardData: animationCard.export(),
    })
    setTimeout(()=>{
      const animationOne = wx.createAnimation({
        duration: 400,
        timingFunction: 'ease',
      })
      animationOne.height("225rpx").step();
      const animationImgBar = wx.createAnimation({
        duration: 400,
        timingFunction: 'ease',
        transformOrigin: '0% 100% 0',
      })
      animationImgBar.rotate(0).translateX(0).translateY(0).step()
      let imageArr = this.data.addUserInfo;
      let animaArr = [];
      for (let index = 0; index < imageArr.length; index++) {
        let transform = (50 + index * 115) + '% 50% 0';
        const animationImage = wx.createAnimation({
          duration: 400,
          timingFunction: 'ease',
          // transformOrigin: transform,
        })
        animationImage.scale(1).translateX(0).translateY(0).step();
        animaArr.push(animationImage.export())
      }
      this.setData({
        animationListData: animationOne.export(),
        animationImgBarData: animationImgBar,
        animationImgDataArr: animaArr,
        showAddUserList: false
      })
    },100)
  },

  onLoad: function () {
    global.addIdArr = [];
    global.userId = '';
    this.getTimeLineData();

  },

  onShow: function () {
    this.getUserInfo();
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

  timeLineListener: function(e) {
    let eventType = e.type;
    if (eventType === 'timeLineSwitchevent') {
      let switchToDate = e.detail.toDate;
      let timeLineData = this.data.timeLineData;
      let newTimeLineData = [];
      this.chooseTimeLine = switchToDate;
      for (let index = 0; index < timeLineData.length; index ++) {
        let dailyData = timeLineData[index];
        if (dailyData.date === switchToDate) {
          dailyData.is_today = 1;
        } else {
          dailyData.is_today = 0;
        }
        newTimeLineData.push(dailyData);
      }
      this.setData({
        timeLineData: newTimeLineData
      })
      
    }
    if (eventType === 'chooseAnimeevent') {
      let seasonId = e.detail.seasonId;
      wx.navigateTo({
        url: '../bangumiPage/bangumiPage?seasonId=' + seasonId
      })
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
              showAddUserArr.push({ uname, upic, mid, index: showAddUserArr.length})
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
        _this.showAnimation()
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
            showAddUserArr.push({ uname, upic, mid, index })
            addIdArr.push(mid)
          }
        }
        global.addIdArr = addIdArr;
        _this.setData({
          addUserInfo: showAddUserArr
        })
        let isShow = _this.data.showAddUserList;
        if (isShow) {
          _this.showAnimation();
        } else {
          _this.hiddenAnimation();
        }
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
          let showTimeData = this.getShowTimeLineData(res.data.result);
          this.setData({
            timeLineData: showTimeData
          })
        }
      },
    })
  },

  getShowTimeLineData: function(getData) {
    // 原数据是 今天的前六天 + 今天 + 今天的后六天 共13天
    // 这里只用 今天的前三天 + 今天 + 今天的后三天 共7天
    let returnData = getData.slice(3, 10);
    let weekArr = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期天", "星期天"];
    let nowDate = new Date();
    let nowMonth = nowDate.getMonth() + 1;
    let nowDay = nowDate.getDate();
    let nowDateStr = nowMonth + '.' + nowDay;
    for (let index = 0; index < returnData.length; index ++) {
      returnData[index].weekStr = weekArr[(returnData[index].day_of_week - 1)];
      returnData[index].dateStr = returnData[index].date.replace("-", ".");
      if (returnData[index].dateStr === nowDateStr) {
        returnData[index].dateStr = "今天";
      }
    }
    return returnData;
  },

  toAbout: function() {
    wx.navigateTo({
      url: '../aboutPage/aboutPage?uname=' + this.data.userInfo.uname
    })
  }


})

