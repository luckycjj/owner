<template>
  <div id="messageRecord" style="top:1.3rem">
    <div id="title" v-title data-title="短信记录"></div>
    <div id="mescroll" class="mescroll" style="top:0rem;">
      <ul id="dataList" class="data-list">
        <li v-for="(item,index) in pdlist" style="overflow: hidden">
          <div class="moveDiv" style="position: relative">
            <div style="width:10rem;">
              <div class="firstBox" :style="{paddingBottom : item.show ?'0.1rem' : '0.56rem' }">
                <img :src="item.driverImage"  :onerror = "errorlogo" class="photo">
                <div class="messageBody">
                  <p>{{item.carno}}</p>
                  <h1>{{item.sendTime | selectTime}}</h1>
                  <div class="clearBoth"></div>
                  <h6  class="messageBodyH6" :class="item.show && !item.look ? 'overflowHidden' : ''">{{item.content}}</h6>
                  <img src="../../images/lookMore4.png" :class="item.look ? 'xuanzhuan' : ''" @click="lookMoreMessage(index)" v-if="item.show" class="lookMore">
                </div>
                <div class="clearBoth"></div>
              </div>
              <div class="clearBoth"></div>
            </div>
            <div class="thirdBox" @click="cleanMessage(index)">
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
  export default {
    name: "messageRecord",
    data(){
      return{
        pdlist:[],
        number:0,
        size:0,
        errorlogo: 'this.src="' + require('../../images/userImg.png') + '"',
        mescroll:null,
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
              tip:"暂无记录~"
            },
            page: {
              num: 0, //当前页码,默认0,回调之前会加1,即callback(page)会从1开始
              size: 10, //每页数据的数量
            }
          },
          down: {
            offset: 2.1 * $("html").css("font-size").replace("px", ""),
          }
        });
        document.getElementById("cleanMessageAll").onclick = function () {
          androidIos.first("确定清空短信记录吗?");
          $(".tanBox-yes").unbind('click').click(function(){
            $.ajax({
              type: "POST",
              url: androidIos.ajaxHttp() + "/driver/delAllSMS",
              data:JSON.stringify({
                userCode:sessionStorage.getItem("token"),
                source:sessionStorage.getItem("source"),
              }),
              contentType: "application/json;charset=utf-8",
              dataType: "json",
              timeout: 30000,
              success: function (delSMS) {
                if (delSMS.success == "1") {
                   self.$cjj("清空成功");
                  self.pdlist = [];
                   self.mescroll.resetUpScroll();
                }else{
                  androidIos.second(delSMS.message);
                }
              },
              complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
                $(".tanBox-bigBox").remove();
                if (status == 'timeout') { //超时,status还有success,error等值的情况
                  androidIos.second("当前状况下网络状态差，请检查网络！");
                } else if (status == "error") {
                  androidIos.errorwife();
                }
              }
            });
          })
        }
      },
      lookMoreMessage:function (index) {
         var _this = this;
        _this.pdlist[index].look = !_this.pdlist[index].look
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
          self.number = page.num;
          self.size = page.size;
          self.mescroll.endSuccess(curPageData.length);
          self.$nextTick(function () {
              var lines = $(".moveDiv");
              var len = lines.length;
              var lastX, lastXForMobile;
              var pressedObj;
              var lastLeftObj;
              var start;
              for(var i = (page.num - 1)*page.size ; i < page.num * page.size;i++){
                if(i == self.pdlist.length){
                  break;
                }
                var messageBodyH6 = $(".messageBodyH6").eq(i);
                var height = messageBodyH6.height() / document.getElementsByTagName("html")[0].style.fontSize.replace("px","");
               if( height / 0.5 > 4){
                 self.pdlist[i].show = true;
               }else{
                 self.pdlist[i].show = false;
               }
              }
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
      cleanMessage:function (index) {
        var _this = this;
        androidIos.first("确定删除该短信记录吗?");
        $(".tanBox-yes").unbind('click').click(function(){
          $(".tanBox-bigBox").remove();
          $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp() + "/driver/delSMS",
            data:JSON.stringify({
              pk:_this.pdlist[index].pkSms,
              userCode:sessionStorage.getItem("token"),
              source:sessionStorage.getItem("source"),
            }),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            timeout: 30000,
            async:false,
            success: function (delSMS) {
              if (delSMS.success == "1") {
                _this.pdlist.splice(index,1);
                _this.$cjj("删除成功");
              }else{
                androidIos.second(delSMS.message);
              }
            },
            complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
              if (status == 'timeout') { //超时,status还有success,error等值的情况
                androidIos.second("当前状况下网络状态差，请检查网络！");
              } else if (status == "error") {
                androidIos.errorwife();
              }
            }
          });
          $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp() + "/driver/smsRecord",
            data:JSON.stringify({
              page:_this.size*_this.number,
              size:1,
              userCode:sessionStorage.getItem("token"),
              source:sessionStorage.getItem("source"),
            }),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            timeout: 30000,
            success: function (smsRecord) {
              if (smsRecord.success == "1") {
                if(smsRecord.list.length > 0){
                  for(var i = 0;i<smsRecord.list.length;i++){
                    _this.pdlist.push(smsRecord.list[i]);
                  }
                  _this.$nextTick(function () {
                    var lines = $(".moveDiv");
                    var len = lines.length;
                    var lastX, lastXForMobile;
                    var pressedObj;
                    var lastLeftObj;
                    var start;
                    for(var i = (_this.number - 1)*_this.size ; i <_this.number*_this.size;i++){
                      if(i == _this.pdlist.length){
                        break;
                      }
                      var messageBodyH6 = $(".messageBodyH6").eq(i);
                      var height = messageBodyH6.height() / document.getElementsByTagName("html")[0].style.fontSize.replace("px","");
                      if( height / 0.5 > 4){
                        _this.pdlist[i].show = true;
                      }else{
                        _this.pdlist[i].show = false;
                      }
                    }
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
                }
              }else{
                androidIos.second(smsRecord.message);
              }
            },
            complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
              if (status == 'timeout') { //超时,status还有success,error等值的情况
                androidIos.second("当前状况下网络状态差，请检查网络！");
              } else if (status == "error") {
                androidIos.errorwife();
              }
            }
          });
        });
      }
    }
  }
  function getListDataFromNet(pageNum,pageSize,successCallback,errorCallback) {
    //延时一秒,模拟联网
    setTimeout(function () {
      $.ajax({
        type: "POST",
        url: androidIos.ajaxHttp() + "/driver/smsRecord",
        data:JSON.stringify({
          page:pageNum,
          size:pageSize,
          userCode:sessionStorage.getItem("token"),
          source:sessionStorage.getItem("source"),
        }),
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        timeout: 30000,
        success: function (smsRecord) {
          if (smsRecord.success == "1") {
            successCallback&&successCallback(smsRecord.list);
          }else{
            androidIos.second(smsRecord.message);
            successCallback&&successCallback([]);
          }
        },
        complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
          if (status == 'timeout') { //超时,status还有success,error等值的情况
            androidIos.second("当前状况下网络状态差，请检查网络！");
            successCallback&&successCallback([]);
          } else if (status == "error") {
            androidIos.errorwife();
            successCallback&&successCallback([]);
          }
        }
      });
    },500)
  }
</script>

<style >
  @import "../../css/mescroll.css";
  @import "../../css/scroll.css";
</style>
<style scoped>
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
  #messageRecord .firstBox .photo{
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
    line-height: 0.5rem;

  }
  .overflowHidden{
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
  .lookMore{
    width:0.5rem;
    display: block;
    margin: 0 auto;
  }
  .xuanzhuan{
    transform:rotate(180deg);
    -ms-transform:rotate(180deg); 	/* IE 9 */
    -moz-transform:rotate(180deg); 	/* Firefox */
    -webkit-transform:rotate(180deg); /* Safari 和 Chrome */
    -o-transform:rotate(180deg);
  }
  </style>
