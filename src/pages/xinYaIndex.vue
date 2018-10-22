<template>
    <div id="xinYaIndex">
      <div id="title" v-title data-title="欣阳物流"></div>
      <div id="xinYaIndexBox">
        <div id="full_feature" class="swipslider">
          <ul class="sw-slides">
            <li class="sw-slide" v-for="(item) in banner">
              <img :src="item.value"  :onerror="errorlogo" >
            </li>
          </ul>
        </div>
        <div id="newOrderBox">
          <div class="neworderLeft">
            <div class="puhuo" @click="gonewOrder(2)">
              <p>普货运输</p>
              <h1>跨市 跨省 全国运输</h1>
              <img src="../images/xyPH.png">
            </div>
          </div>
          <div class="neworderRight">
            <div class="neworderRightTop">
              <div class="lenglian" @click="gonewOrder(1)">
                <p>冷链运输</p>
                <img src="../images/xyLL.png">
              </div>
              <div class="weixianpin" @click="gonewOrder(3)">
                <p>危险品运输</p>
                <img src="../images/xyWXP.png">
              </div>
              <div class="clearBoth"></div>
            </div>
            <div class="neworderRightBottom">
              <div class="jizhuangxiang" @click="gonewOrder(4)">
                <p>集装箱运输</p>
                <img src="../images/xyJZX.png">
                <div class="clearBoth"></div>
              </div>
            </div>
          </div>
          <div class="clearBoth"></div>
        </div>
        <div id="bestCarrier">
          <div class="carrierTitle">
            <p><img src="../images/bestCarrier.png">优秀承运商</p>
            <h1 @click="lookMoreD(0)">更多</h1>
            <div class="clearBoth"></div>
          </div>
          <ul>
            <li v-for="(item,index) in bestCarrier" :style="{float:index % 2 == 1 ? 'right' : 'left'}">
              <img :src="item.carrierImg" :onerror="errorlogo1" >
              <p>{{item.corpName}}</p>
              <div class="pinList">
                <div class="pinListBox" v-if="indexs < 2" v-for="(items,indexs) in item.pinList">{{items}}</div>
                <div class="clearBoth"></div>
              </div>
            </li>
            <div class="clearBoth"></div>
          </ul>
        </div>
        <div id="bestDriver">
          <div class="driverTitle">
            <p><img src="../images/bestDriver.png">优秀司机</p>
            <h1 @click="lookMoreD(1)">更多</h1>
            <div class="clearBoth"></div>
          </div>
          <div id="bestDriverListbox">
            <div id="bestDriverList">
              <ul>
                <li v-for="(item,indexs) in bestDriver" :style="{marginRight:indexs == bestDriver.length - 1 ? '0' : '0.56rem' }">
                  <img :src="item.driverImg"  :onerror="errorlogo1" >
                </li>
              </ul>
            </div>
            <img src="../images/lookMore.png" class="scrollImg" @click="scrollX()">
          </div>
        </div>
      </div>
      <footComponent :idx='0'></footComponent>
    </div>
</template>

<script>
  import {androidIos} from "../js/app";
  import {bomb} from "../js/zujian";
  import bridge from '../js/bridge';
  import "../js/swipeslider";
    export default {
        name: "xin-ya-index",
        data(){
           return{
             banner:[],
             bestCarrier:[],
             bestDriver:[],
             cookie:"",
             indexscroll:"",
             errorlogo: 'this.src="' + require('../images/timg.jpg') + '"',
             errorlogo1: 'this.src="' + require('../images/userImg.png') + '"',
           }
        },
      mounted:function () {
          var _this = this;
          sessionStorage.removeItem("NEWORDERTRANTYPE");
          _this.cookie = androidIos.getcookie("MESSAGEDRIVER");
          androidIos.noviceguidance(1);
          androidIos.bridge(_this);
      },
      methods:{
        go:function () {
            var _this = this;
            var ajax1 =  $.ajax({
              type: "POST",
              url: androidIos.ajaxHttp() + "/settings/getBanner",
              data:JSON.stringify({
                str:"1500",
                userCode:sessionStorage.getItem("token"),
                source:sessionStorage.getItem("source")
              }),
              contentType: "application/json;charset=utf-8",
              dataType: "json",
              timeout: 30000,
              success: function (getBanner) {
                if (getBanner.success == "1") {
                    _this.banner = getBanner.list;
                    _this.$nextTick(function () {
                      $('#full_feature').swipeslider();
                    })
                }else{
                  androidIos.second(getBanner.message);
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
            var ajax2 =  $.ajax({
              type: "POST",
              url: androidIos.ajaxHttp() + "/carrier/getCarrierPage",
              data:JSON.stringify({
                page:1,
                size:6,
                userCode:sessionStorage.getItem("token"),
                source:sessionStorage.getItem("source")
              }),
              contentType: "application/json;charset=utf-8",
              dataType: "json",
              timeout: 30000,
              success: function (getCarrierPage) {
                if (getCarrierPage.success == "1") {
                  for(var i = 0 ; i< getCarrierPage.list.length;i++){
                    getCarrierPage.list[i].pinList = getCarrierPage.list[i].tranType.split(",");
                  }
                  _this.bestCarrier = getCarrierPage.list;
                }else{
                  androidIos.second(getCarrierPage.message);
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
            var ajax3 = $.ajax({
              type: "POST",
              url: androidIos.ajaxHttp() + "/driver/getDriverPage",
              data:JSON.stringify({
                page:1,
                size:6,
                userCode:sessionStorage.getItem("token"),
                source:sessionStorage.getItem("source")
              }),
              contentType: "application/json;charset=utf-8",
              dataType: "json",
              timeout: 30000,
              success: function (getDriverPage) {
                if (getDriverPage.success == "1") {
                  _this.bestDriver = getDriverPage.list;
                  _this.$nextTick(function () {
                    $("#bestDriverList ul").css("width",getDriverPage.list.length*1.68 + (getDriverPage.list.length -1)*0.56+ "rem");
                  })
                }else{
                  androidIos.second(getDriverPage.message);
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
            var ajax4 = "";
            if(sessionStorage.getItem("token") != undefined){
              ajax4 = $.ajax({
                type: "POST",
                url: androidIos.ajaxHttp() + "/order/messageCount",
                data: JSON.stringify({
                  userCode: sessionStorage.getItem("token"),
                  source: sessionStorage.getItem("source")
                }),
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                timeout: 30000,
                success: function (driverBottomIcon) {
                  if (driverBottomIcon.success == "1") {
                    sessionStorage.setItem("messageCount", driverBottomIcon.count * 1);
                  } else {
                    androidIos.second(driverBottomIcon.message);
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
            }

            Promise.all([ajax1, ajax2, ajax3,ajax4]).then(function(values) {
              var INDEXSCROLLTOP = sessionStorage.getItem("INDEXSCROLLTOP");
              if(INDEXSCROLLTOP != null){
                $("#xinYaIndexBox").animate({scrollTop: INDEXSCROLLTOP}, 0);
                sessionStorage.removeItem("INDEXSCROLLTOP");
              }
              var  messageCount = sessionStorage.getItem("messageCount");
              if(messageCount != undefined && messageCount > 0){
                $("#messageLDTX").show();
              }else{
                $("#messageLDTX").hide();
              }
            })
          },
        getPageScroll:function() {
          var  yScroll;
          yScroll = document.getElementById("xinYaIndexBox").scrollTop;
          sessionStorage.setItem("INDEXSCROLLTOP",yScroll);
        },
        gonewOrder:function (type) {
          var _this = this;
          if(_this.cookie != ""){
            var owner = sessionStorage.getItem("ownerMessage");
            if(owner != undefined){
               var status = JSON.parse(owner);
               if(status.status == 1){
                 androidIos.second("正在审核中，请耐心等待！");
               }else if(status.status == 0){
                 androidIos.second("尚未认证，请认证上传资料！");
               }else if(status.status == 3){
                 androidIos.second("资料已驳回，请重新上传资料！");
               }else if(status.status == 4){
                 androidIos.second("账户已禁用！");
               }else if(status.status == 2){
                 androidIos.addPageList();
                 _this.getPageScroll();
                 _this.$router.push({path:"/newOrder",query:{newordertrantype:type}});
               }
            }
          }else if(_this.cookie == ""){
            androidIos.first("尚未登录,请登录！");
            $(".tanBox-yes").unbind('click').click(function(){
              $(".tanBox-bigBox").remove();
              _this.$router.push({path:"/login"});
            });
          }
        },
        goDriver:function (pk) {
          var _this = this;
          if(_this.cookie != ""){
            androidIos.addPageList();
            _this.getPageScroll();
            _this.$router.push({path:"/bestDriverMore",query:{pk:pk}});
          }else if(_this.cookie == ""){
            androidIos.first("尚未登录,请登录！");
            $(".tanBox-yes").unbind('click').click(function(){
              $(".tanBox-bigBox").remove();
              _this.$router.push({path:"/login"});
            });
          }
        },
        goCarrier:function (pk) {
          var _this = this;
          if(_this.cookie != ""){
            androidIos.addPageList();
            _this.getPageScroll();
            _this.$router.push({path:"/bestCarrierMore",query:{pk:pk}});
          }else if(_this.cookie == ""){
            androidIos.first("尚未登录,请登录！");
            $(".tanBox-yes").unbind('click').click(function(){
              $(".tanBox-bigBox").remove();
              _this.$router.push({path:"/login"});
            });
          }
        },
        lookMoreD:function (type) {
          var _this = this;
          if(_this.cookie != ""){
            androidIos.addPageList();
            _this.getPageScroll();
            if(type == 0){
              _this.$router.push({path:"/bestCarrierList"});
            }else if(type == 1){
              _this.$router.push({path:"/bestDriverList"});
            }
          }else if(_this.cookie == ""){
            androidIos.first("尚未登录,请登录！");
            $(".tanBox-yes").unbind('click').click(function(){
              $(".tanBox-bigBox").remove();
              _this.$router.push({path:"/login"});
            });
          }

        },
        scrollX:function () {
            var x = 0
          var time = setInterval(function () {
            if(x > 20){
               clearInterval(time);
            }
            x++;
            var scrollLeft = $("#bestDriverList").scrollLeft();
            var html = $("html").css("fontSize").replace("px","");
            scrollLeft= scrollLeft / html ;
            $("#bestDriverList ").scrollLeft((scrollLeft+ 0.112)*html);
          },10);
        },
      }
    }
</script>

<style scoped>
.swipslider{
  min-height: auto!important;
  height: 4.2rem;
}
.swipslider .sw-bullet{
   bottom:10px!important;
}
  #xinYaIndexBox{
    position: absolute;
    top:1.3rem;
    bottom:1.3rem;
    background: #f6f6f6;
    height: auto;
    width:100%;
    overflow: scroll;
    padding-bottom: 0.2rem;
  }
  #newOrderBox{
    background: white;
    width:94%;
    padding: 0.5rem 3%;
  }
  .neworderLeft{
    float: left;
    width:3.75rem;
  }
.neworderRight{
  float: right;
  width:5.6rem;
}
  .puhuo{
    width:3.75rem;
    background:#F6FAFD ;
    height: 5.3rem;
  }
.puhuo p{
  color:#424242;
  font-size: 0.375rem;
  text-align: center;
  padding-top:1.12rem ;
  line-height: 0.375rem;
  font-weight: bold;
}
.puhuo h1{
  color:#999;
  font-size: 0.32rem;
  text-align: center;
  line-height: 0.5rem;
}
.puhuo img{
    width:3.04rem;
  margin:0.5rem auto 0 auto ;
}
  .lenglian{
    float: left;
    width:2.78rem;
    height:2.64rem ;
    background:#F6FAFD ;
  }
.lenglian p{
  color:#424242;
  font-size: 0.375rem;
  text-align: center;
  padding-top:0.58rem ;
  line-height: 0.375rem;
  font-weight: bold;
}
.lenglian img{
  width:0.8rem;
  margin:0.34rem auto 0 auto ;
}
.weixianpin{
  float: right;
  width:2.78rem;
  height:2.64rem ;
  background:#F6FAFD ;
}
.weixianpin p{
  color:#424242;
  font-size: 0.375rem;
  text-align: center;
  padding-top:0.58rem ;
  line-height: 0.375rem;
  font-weight: bold;
}
.weixianpin img{
  width:0.8rem;
  margin:0.34rem auto 0 auto ;
}
.jizhuangxiang{
  width:5.6rem;
  height:2.64rem ;
  background:#F6FAFD ;
  margin-top: 0.04rem;
}
.jizhuangxiang p{
  color:#424242;
  font-size: 0.375rem;
  line-height: 2.64rem;
  font-weight: bold;
  float: left;
  margin-left: 0.69rem;
}
.jizhuangxiang img{
  width:1.85rem;
  padding-top: 0.426rem;
  margin-left: 0.64rem;
  float: left;
}
  #bestCarrier,#bestDriver{
    width:100%;
    margin-top: 0.36rem;
    background: white;
  }
  .carrierTitle,.driverTitle{
     width:100%;
    padding:0.28rem 0 ;
  }
.carrierTitle p{
  float: left;
  width:2.28rem;
  padding-left:0.7rem ;
  line-height: 0.72rem;
  color:white;
  font-size: 0.375rem;
  border-top-right-radius: 0.36rem;
  border-bottom-right-radius: 0.36rem;
  background: -webkit-linear-gradient(left, #00A7FF , #0080FF); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(right, #00A7FF,  #0080FF); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(right, #00A7FF,  #0080FF); /* Firefox 3.6 - 15 */
  background: linear-gradient(to right, #00A7FF ,  #0080FF); /* 标准的语法 */
  position: relative;
}
.driverTitle p{
  float: left;
  width:2.28rem;
  padding-left:0.7rem ;
  line-height: 0.72rem;
  color:white;
  font-size: 0.375rem;
  border-top-right-radius: 0.36rem;
  border-bottom-right-radius: 0.36rem;
  background: -webkit-linear-gradient(left, #00C5FF , #00A6FF); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(right, #00C5FF,  #00A6FF); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(right, #00C5FF ,#00A6FF); /* Firefox 3.6 - 15 */
  background: linear-gradient(to right, #00C5FF , #00A6FF); /* 标准的语法 */
  position: relative;
 }
.carrierTitle p img,.driverTitle p img{
   position: absolute;
  width:0.387rem;
  left:0.2rem;
  top:0.2rem;
}
.carrierTitle h1,.driverTitle h1{
  float: right;
  width:0.9rem;
  line-height: 0.72rem;
  font-size: 0.32rem;
  color:#999;
  margin-right: 0.387rem;
  background-image: url("../images/lookMore.png");
  background-repeat: no-repeat;
  background-position: 100% 50%;
  background-size: 0.147rem;
}
  #bestCarrier ul{
    width:95.7%;
    margin: 0 auto;
  }
#bestCarrier ul li {
   float: left;
   width:4.74rem;
   background:#F6FAFD ;
   margin-bottom:0.12rem;
}
#bestCarrier ul li img{
  width:3.33rem;
  height: 3.33rem;
  margin: 0.18rem auto;
}
#bestCarrier ul li p {
  text-align: center;
  font-size: 0.32rem;
  color:#424242;
  line-height: 0.32rem;
}
.pinList{
  margin: 0.43rem auto 0.2rem auto;
}
  .pinListBox{
     float: right;
    margin-right:0.1rem ;
    padding: 0.1rem 0.15rem;
    font-size: 0.3125rem;
    color:#2C9CFF;
    border:1px solid #2C9CFF;
    border-radius: 0.3rem;
  }
  #bestDriverListbox{
    width:100%;
    position: relative;
  }
  #bestDriverList{
    width:8.4rem;
    margin: 0.6rem auto 0rem auto;
    padding-bottom: 0.4rem;
    overflow-y: hidden;
    overflow-x: scroll;
    position: relative;
    height: 1.68rem;

  }
#bestDriverList ul{
  width:10rem;
  height:1.68rem ;
  position: absolute;
  top:0;
  left:0;
}
#bestDriverList ul li{
   float: left;
   width:1.68rem;
  margin-right:0.56rem ;
}
#bestDriverList ul li img{
  width:1.68rem;
  height: 1.68rem;
  border-radius: 50%;
  margin: 0 auto;
}
  .scrollImg{
    width: 0.285rem;
    position: absolute;
    right:3%;
    top:0.65rem;
  }
</style>
<style>
  #xinYaIndex .swipslider .sw-bullet{
    bottom:0.2rem!important;
  }
</style>
