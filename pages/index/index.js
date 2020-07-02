// pages/index/index.js
const QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    region: [],
    now: ''
  },
  changeRegion: function(e){
    this.setData({
      region: e.detail.value
    });
    this.getWeather();
  },
  getWeather: function(){
    var that = this;
    wx.request({
      url: 'https://free-api.heweather.net/s6/weather/now',
      data: {
        location: that.data.region[1],
        key: 'bd7c61f3bbe84b90b8033e4804c3862c'
      },
      success(res){
        that.setData({
          now: res.data.HeWeather6[0].now
        })
      }
    })
  },
  getSetting: function(){
    var that = this;
    wx.getSetting({
      success(res){
        var res = res.authSetting;
        if (!res.hasOwnProperty('scope.userLocation') || !res['scope.userLocation']){
          wx.authorize({
            scope: 'scope.userLocation',
            success () { 
              that.getLocation();
            }
          })
        }else{
          that.getLocation();
        }
      }
    })
  },
  getLocation: function(){
    const demo = new QQMapWX({
      key: '5DVBZ-NWP3P-XPVDU-LNLBZ-HXYF3-PMB7L'
    });
    var that = this;
    wx.getLocation({
      altitude: 'wgs84',
      success(res){
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
        demo.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (res) {
            const info = res.result.address_component;
            that.setData({
              region: [info.province,info.city,info.district]
            })
            that.getWeather();
          },
          fail: function (res) {
            console.log(res);
          },
        })  
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 使用wx.getSetting获取用户授权情况，如果用户未授权，使用wx.showModal弹出授权弹框，用户同意之后调用wx.getLocation获取用户所在位置的经纬度，在服务器域名配置中配置request合法域名，使用获得的经纬度请求所在省市区，再获得天气。
    this.getSetting();
    // this.getWeather();
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