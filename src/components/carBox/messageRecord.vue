<template>
  <div id="messageRecord" style="top:1.3rem">
    <div id="title" v-title data-title="短信记录"></div>
    <div id="mescroll" class="mescroll" style="top:0rem;">
      <ul id="dataList" class="data-list">
        <li v-for="(item,index) in pdlist" style="overflow: hidden">
          <div class="moveDiv" style="position: relative">
            <div style="width:10rem;">
              <div class="firstBox">
                <img :src="item.img">
                <div class="messageBody">
                  <p>{{item.carno}}</p>
                  <h1>{{item.time | selectTime}}</h1>
                  <div class="clearBoth"></div>
                  <h6>{{item.body}}</h6>
                </div>
                <div class="clearBoth"></div>
              </div>
              <div class="clearBoth"></div>
            </div>
            <div class="thirdBox">
              <p>删除</p>
            </div>
            <div class="clearBoth"></div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import MeScroll from '../../js/mescroll'
  import {iscroll} from '../../js/iscroll'
  import {androidIos} from "../../js/app";
  import {bomb} from "../../js/zujian";
  var pd = [{
    img:require("../../images/ALEX.png"),
    carno:"沪DL5659",
    time:"2018-11-07 14:05:01",
    body:"不限高不限高不限高不限高不限高不限高限 不限高不限高不限高不限高不限高不限高限 不限高不限高不限高不限高不限高不限高限 不限高不限高不限高不限高不限高不限高限 不限高不限高不限高不限高不限高不限高限 不限高不限高不限高不限高不限高不限高限 不限高不限高不限高不限高不限高不限高限 不限高不限高不限高不限高不限高不限高限"
  },{
    img:require("../../images/ALEX.png"),
    carno:"沪DL5659",
    time:"2018-11-07 12:05:01",
    body:"不限高不限高不限高不限高不限高不限高限 不限高不限高不限高不限高不限高不限高限 不限高不限高不限高不限高不限高不限高限 不限高不限高不限高不限高不限高不限高限 不限高不限高不限高不限高不限高不限高限 不限高不限高不限高不限高不限高不限高限 不限高不限高不限高不限高不限高不限高限 不限高不限高不限高不限高不限高不限高限"
  },{
    img:require("../../images/settlementAdress.png"),
    carno:"沪DL5659",
    time:"2018-11-06 14:05:01",
    body:"不限高不限高不限高不限高不限高不限高限 不限高不限高不限高不限高不限高不限高限 不限高不限高不限高不限高不限高不限高限 不限高不限高不限高不限高不限高不限高限 不限高不限高不限高不限高不限高不限高限 不限高不限高不限高不限高不限高不限高限 不限高不限高不限高不限高不限高不限高限 不限高不限高不限高不限高不限高不限高限"
  },{
    img:require("../../images/settlementAdress.png"),
    carno:"沪DL5659",
    time:"2018-11-05 14:05:01",
    body:"不限高不限高不限高不限高不限高不限高限 不限高不限高不限高不限高不限高不限高限 不限高不限高不限高不限高不限高不限高限 不限高不限高不限高不限高不限高不限高限 不限高不限高不限高不限高不限高不限高限 不限高不限高不限高不限高不限高不限高限 不限高不限高不限高不限高不限高不限高限 不限高不限高不限高不限高不限高不限高限"
  },{
    img:require("../../images/settlementAdress.png"),
    carno:"沪DL5659",
    time:"2018-11-04 14:05:01",
    body:"不限高不限高不限高不限高不限高不限高限 不限高不限高不限高不限高不限高不限高限 不限高不限高不限高不限高不限高不限高限 不限高不限高不限高不限高不限高不限高限 不限高不限高不限高不限高不限高不限高限 不限高不限高不限高不限高不限高不限高限 不限高不限高不限高不限高不限高不限高限 不限高不限高不限高不限高不限高不限高限"
  },{
    img:require("../../images/settlementAdress.png"),
    carno:"沪DL5659",
    time:"2018-09-07 14:05:01",
    body:"不限高不限高不限高不限高不限高不限高限 不限高不限高不限高不限高不限高不限高限 不限高不限高不限高不限高不限高不限高限 不限高不限高不限高不限高不限高不限高限 不限高不限高不限高不限高不限高不限高限 不限高不限高不限高不限高不限高不限高限 不限高不限高不限高不限高不限高不限高限 不限高不限高不限高不限高不限高不限高限"
  }]
  var thisthatsecond;
  export default {
    name: "messageRecord",
    data(){
      return{
        pdlist:[],
      }
    },
    mounted:function () {
      var _this = this;
      androidIos.judgeIphoneX("messageRecord",2);
      androidIos.bridge(_this);
    },
    methods:{
      go:function () {
        var self = this;
        self.mescroll = new MeScroll("mescroll", { //请至少在vue的mounted生命周期初始化mescroll,以确保您配置的id能够被找到
          up: {
            callback: self.upCallback, //上拉回调
            isBounce: false, //此处禁止ios回弹,解析(务必认真阅读,特别是最后一点): http://www.mescroll.com/qa.html#q10
            empty:{
              warpId:'mescroll',
              icon:require('../../images/nojilu.png'),
              tip:"暂无地址~"
            },
            page: {
              num: 0, //当前页码,默认0,回调之前会加1,即callback(page)会从1开始
              size: 15, //每页数据的数量
            }
          },
          down: {
            offset: 2.1 * $("html").css("font-size").replace("px", ""),
          }
        });
      },
      upCallback: function(page) {
        //联网加载数据
        var self = this;
        getListDataFromNet(page.num, page.size, function(curPageData) {
          //curPageData=[]; //打开本行注释,可演示列表无任何数据empty的配置

          //如果是第一页需手动制空列表 (代替clearId和clearEmptyId的配置)
          if(page.num == 1) self.pdlist = [];
          //更新列表数据
          self.pdlist = self.pdlist.concat(curPageData);
          self.mescroll.endSuccess(curPageData.length);
          self.$nextTick(function () {
              var lines = $(".moveDiv");
              var len = lines.length;
              var lastX, lastXForMobile;
              // 用于记录被按下的对象
              var pressedObj;  // 当前左滑的对象
              var lastLeftObj; // 上一个左滑的对象
              // 用于记录按下的点
              var start;
              // 网在移动端运行时的监听
              for (var i = 0; i < len; ++i) {
                lines[i].addEventListener('touchstart', function(e){
                  lastXForMobile = e.changedTouches[0].pageX;
                  pressedObj = this; // 记录被按下的对象

                  // 记录开始按下时的点
                  var touches = event.touches[0];
                  start = {
                    x: touches.pageX, // 横坐标
                    y: touches.pageY  // 纵坐标
                  };
                });
                lines[i].addEventListener('touchmove',function(e){
                  // 计算划动过程中x和y的变化量
                  var touches = event.touches[0];
                  var delta = {
                    x: touches.pageX - start.x,
                    y: touches.pageY - start.y
                  };
                  if (Math.abs(delta.x) > Math.abs(delta.y)) {
                    event.preventDefault();
                  }
                });
                lines[i].addEventListener('touchend', function(e){
                  if (lastLeftObj && pressedObj != lastLeftObj) { // 点击除当前左滑对象之外的任意其他位置
                    $(lastLeftObj).animate({left:"0"}, 200); // 右滑
                    lastLeftObj = null; // 清空上一个左滑的对象
                  }
                  var diffX = e.changedTouches[0].pageX - lastXForMobile;
                  if (diffX < -50) {
                    $(pressedObj).animate({left:"-2rem"}, 200); // 左滑
                    lastLeftObj && lastLeftObj != pressedObj &&
                    $(lastLeftObj).animate({left:"0"}, 200); // 已经左滑状态的按钮右滑
                    lastLeftObj = pressedObj; // 记录上一个左滑的对象
                  } else if (diffX > 50) {
                    if (pressedObj == lastLeftObj) {
                      $(pressedObj).animate({left:"0"}, 200); // 右滑
                      lastLeftObj = null; // 清空上一个左滑的对象
                    }
                  }
                });
              }
          })

        }, function() {
          //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          self.mescroll.endErr();
        });
      },
    }
  }
  function getListDataFromNet(pageNum,pageSize,successCallback,errorCallback) {
    //延时一秒,模拟联网
    setTimeout(function () {
      var data=pd; // 模拟数据: ../res/pdlist1.js
      var listData=[];//模拟分页数据
      for (var i = (pageNum-1)*pageSize; i < pageNum*pageSize; i++) {
        if(i==data.length) break;
        listData.push(data[i]);
      }
      successCallback&&successCallback(listData);//成功回调
    },500)
  }
</script>

<style >
  @import "../../css/mescroll.css";
  @import "../../css/scroll.css";
  #messageRecord{
    position: absolute;
    width:100%;
    top:1.3rem;
    bottom:0;
    height: auto;
    background:#F5F5F5 ;
  }
  #messageRecord ul{
    width:100%;
    background: white;
    margin-top: 0.2rem;
  }
  #messageRecord li{
    width: 100%;
    border-bottom: 2px solid #dadada;
    position: relative;
  }
  #messageRecord .firstBox{
    width:8.7rem;
    padding: 0.13rem 0.89rem 0.56rem 0.41rem;
    float: left;
  }
  #messageRecord .firstBox img{
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    margin-top: 0.24rem;
    float: left;
  }
#messageRecord .firstBox .messageBody{
  float: left;
  width:7.16rem;
  margin-left: 0.33rem;
}
  #messageRecord .firstBox .messageBody p{
    float: left;
    font-size: 0.4rem;
    color:#373737;
  }
  #messageRecord .firstBox .messageBody h1{
    float: right;
    font-size: 0.347rem;
    color:#999;
  }
  #messageRecord .firstBox .messageBody h6{
    width:98%;
    margin-left: 1%;
    font-size: 0.347rem;
    color:#999;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    display: -webkit-box;
  }
  #messageRecord .mescroll{
    position: absolute;
    top:0rem;
    bottom: 0rem;
    height: auto;
    background-color: rgb(245, 245, 249)!important;
  }
  #messageRecord .thirdBox{
    position:absolute;
    right:-2rem;
    top: 0;
    width:2rem;
    height: 100%;
    background: #1D68A8;
  }
  #messageRecord .thirdBox p{
    color:white;
    font-size: 0.375rem;
    text-align: center;
    position: absolute;
    top:50%;
    margin-top: -0.5rem;
    line-height: 1rem;
    text-align: center;
    width: 100%;
  }
</style>
