<template>
    <div id="xinYaIndex">
      <div id="title" v-title data-title="首页"></div>
      <div id="xinYaIndexBox" style="top:0rem;">
         <div class="top">
            <div id="imgBoxTab" style="top:0.375rem;">
              <img src="../images/date.png" id="date" @touchend="searchDateBoxTrue()">
              <div  id="saoyisao" @click="saoyisao()">
                <input type="file"  accept="image/*"  @change="jiexi($event)" v-if="!apicloud">
              </div>
              <p @touchend="xunjia()">询价</p>
              <div class="clearBoth"></div>
            </div>

            <div class="topLeft">
              <div class="topleftInputBox">
                <input type="text" @touchend="keywordblur()"   placeholder="请输入订单号、货品名称" v-model="keyWord"/>
                <img src="../images/huatong-2.png"  @click="yuyin = true">
              </div>
            </div>
            <div class="topRight">
              <div class="topRightF">
                <p>{{todayOrder | toThousands}}<br><span><span v-html="serchorderType == 0 ? '今天' : serchorderType == 1 ? '昨日' : serchorderType == 3 ? '最近3天' : serchorderType == 7 ? '最近7天' : serchorderType == 30 ? '最近30天' : serchorderType == 60 ? '最近60天' : ''"></span>订单量</span></p>
              </div>
              <div class="topRightF">
                <p>￥{{todayPrice | toThousands}}<br><span><span v-html="serchorderType == 0 ? '今天' : serchorderType == 1 ? '昨日' : serchorderType == 3 ? '最近3天' : serchorderType == 7 ? '最近7天' : serchorderType == 30 ? '最近30天' : serchorderType == 60 ? '最近60天' : ''"></span>运输费用</span></p>
              </div>
              <div class="clearBoth"></div>
            </div>
         </div>
         <div class="center">
           <ul>
             <li v-for="(item,index) in iconList" @touchend="lookTrackList(index)">

               <p :style="{ color : index== 3 ? '#FF4500' : '#404060'}">{{item.number | toThousands}}</p>
                 {{item.name}}
             </li>
           </ul>
         </div>
      </div>
      <footComponent :idx='0'></footComponent>
      <transition name="slide-fade">
        <div id="searchDateBox" v-if="searchDateBox">
          <div id="searchDate">
            <p>选择时间</p>
            <img src="../images/closed2.png" class="searchClosed"  @touchend="searchDateBox = false">
            <ul>
              <li v-for="(item,index) in searchList">
                <h1>{{item.name}}</h1>
                <div class="circle" @touchend="circleChooese(index)"><div class="circleTrue" v-if="item.check"></div></div>
                <div class="clearBoth"></div>
              </li>
            </ul>
            <button @touchend="searchDateGo()">确定</button>
          </div>
        </div>
        <div id="yuyinBox" v-if="yuyin" @click.stop="yuyinFlase($event)">
          <div id="yuyin"  @touchstart="liTouchstart()" @touchmove="liTouchmove()"  @touchend="liTouchend()">
            <p>按住识别</p>
          </div>
        </div>
      </transition>
    </div>
</template>

<script>
  import {androidIos} from "../js/app";
  import {bomb} from "../js/zujian";
  import bridge from '../js/bridge';
  import "../js/swipeslider";
  import reqrcode from  '../js/reqrcode';
    export default {
        name: "xin-ya-index",
        data(){
           return{
             time :  (new Date()).getFullYear() + "/" + ((new Date()).getMonth() + 1) + "/" + (new Date()).getDate(),
             todayOrder :  0,
             serchorderType:0,
             todayPrice : 0,
             keyWord:"",
             searchDateBox:false,
             apicloud:false,
             searchList:[{
               name:"今天",
               value:0,
               check:true,
             },{
               name:"昨天",
               value:1,
               check:false,
             },{
               name:"最近3天",
               value:3,
               check:false,
             },{
               name:"最近一周",
               value:7,
               check:false,
             },{
               name:"最近一个月",
               value:30,
               check:false,
             },{
               name:"最近两个月",
               value:60,
               check:false,
             }],
             iconList:[{
                name:"运输中订单",
                number:0,
                icon:require("../images/trackList1.png"),
                marginRight:0,
             },{
               name:"已完成订单",
               number:0,
               icon:require("../images/trackList2.png"),
               marginRight:0,
             },{
               name:"待分配订单",
               number:0,
               icon:require("../images/trackList3.png"),
               marginRight:0,
             },{
               name:"异常订单",
               number:0,
               icon:require("../images/trackList4.png"),
               marginRight:0,
             }],
             iflyRecognition:null,
             yuyin:false
           }
        },
      mounted:function () {
          var _this = this;
          androidIos.judgeIphoneX("top",0);
          androidIos.judgeIphoneX("xinYaIndexBox",1);
          androidIos.judgeIphoneX("imgBoxTab",2);
          sessionStorage.removeItem("NEWORDERTRANTYPE");
          _this.serchorderType = sessionStorage.getItem("searchDate") == undefined ? 0 : sessionStorage.getItem("searchDate");
          _this.keyWord = sessionStorage.getItem("indexKeyword") == undefined ? "" : sessionStorage.getItem("indexKeyword");
          if(sessionStorage.getItem("xinYaIndex") != undefined){
            _this.iconList = JSON.parse(sessionStorage.getItem("xinYaIndex")).iconList;
            _this.todayPrice = JSON.parse(sessionStorage.getItem("xinYaIndex")).todayPrice;
            _this.todayOrder = JSON.parse(sessionStorage.getItem("xinYaIndex")).todayOrder;
            sessionStorage.removeItem("xinYaIndex");
          }
          sessionStorage.removeItem("indexKeyword");
          sessionStorage.removeItem("trackTap");
          sessionStorage.removeItem("settlementTap");
        try{
          _this.iflyRecognition = api.require('iflyRecognition');
          _this.iflyRecognition.createUtility({
            android_appid: '5c04a475'
          }, function(ret, err) {
            if (ret.status) {
              console.log("创建成功");
            } else {
              console.log("创建失败");
            }
          });
        }
        catch (e){
          _this.iflyRecognition = null;
        }
        $.ajax({
          type: "POST",
          url: androidIos.ajaxHttp() + "/getUserInfo",
          data:JSON.stringify({
            userCode:sessionStorage.getItem("token"),
            source:sessionStorage.getItem("source")
          }),
          contentType: "application/json;charset=utf-8",
          dataType: "json",
          timeout: 30000,
          async:false,
          success: function (getUserInfo) {
            if (getUserInfo.success == "1") {
              sessionStorage.setItem("ownerMessage",JSON.stringify({
                licType: getUserInfo.licType,
                name:  getUserInfo.name,
                photo:  getUserInfo.photo,
                status:  getUserInfo.status,
                corpName:  getUserInfo.corpName,
                role:getUserInfo.role
              }));
            }else{
              androidIos.second(getUserInfo.message);
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
          androidIos.bridge(_this);
      },
      methods:{
        liTouchstart:function () {
          var _this = this;
          if(_this.iflyRecognition != null){
            _this.iflyRecognition.record({
              vadbos: 5000,
              vadeos: 5000,
              rate: 16000,
              asrptt: 1,
              audioPath: 'fs://speechRecogniser/speech.pcm'
            }, function(ret, err) {
              if (ret.status) {
                console.log(ret.wordStr);
                _this.keyWord = ret.wordStr;
              } else {
                console.log(err.msg);
              }
            });
          }else{
            _this.yuyin = false;
            androidIos.second("暂不支持语音搜索")
          }
        },
        liTouchmove:function () {
          var _this = this;
          if(_this.iflyRecognition != null){
          }else{
            _this.yuyin = false;
            androidIos.second("暂不支持语音搜索")
          }
        },
        liTouchend:function () {
          var _this = this;
          if(_this.iflyRecognition != null){
            _this.iflyRecognition.stopRecord();
            _this.yuyin = false;
            androidIos.addPageList();
            sessionStorage.setItem("indexKeyword",_this.keyWord);
            _this.$router.push({path:"/orderScreen",query:{keyword:_this.keyWord}});
          }else{
            _this.yuyin = false;
            androidIos.second("暂不支持语音搜索");
          }
        },
        yuyinFlase:function (e) {
          var _this = this;
          if(e.target.id == "yuyinBox"){
            _this.yuyin = false;
          }
        },
        jiexi:function (enevt) {
          var _this = this;
          androidIos.loading("正在扫描");
          var getObjectURL = function (file) {
            var url = null;
            if (window.createObjectURL != undefined) { // basic
              url = window.createObjectURL(file);
            } else if (window.URL != undefined) { // mozilla(firefox)
              url = window.URL.createObjectURL(file);
            } else if (window.webkitURL != undefined) { // webkit or chrome
              url = window.webkitURL.createObjectURL(file);
            }
            return url;
          }
          reqrcode.decode(getObjectURL(enevt.target.files[0]));
          reqrcode.callback = function (imgMsg) {
            enevt.target.value = "";
            var img;
            try {
              img = JSON.parse(imgMsg);
            } catch (e) {
              img = "";
            }
            $("#common-blackBox").remove();
            if(img == ""){
              androidIos.second("扫描二维码失败,请重试!");
            }else{
              if(img.type != 1){
                androidIos.second("请扫描签收二维码!");
              }else{
                androidIos.first("确定签收吗？");
                $(".tanBox-yes").unbind('click').click(function(){
                  $(".tanBox-bigBox").remove();
                  androidIos.addPageList();
                  _this.$router.push({path:'/signIn',query:{pk:img.pk,}});
                });
              }
            }
          }
        },
        circleChooese:function (index) {
          var _this = this;
          for(var i = 0 ; i < _this.searchList.length ; i++){
             _this.searchList[i].check = false;
          }
          _this.searchList[index].check = true;
        },
        xunjia:function () {
          var _this = this;
          androidIos.addPageList();
          _this.$router.push({ path: "/newOrder/inquiry"});
        },
        saoyisao:function () {
          var _this = this;
          try{
            var scanner = api.require('scanner');
            scanner.open(function(ret, err) {
              if (ret && ret.eventType == "success") {
                  var img = ret.msg;
                  androidIos.first("确定签收吗？");
                  $(".tanBox-yes").unbind('click').click(function(){
                    $(".tanBox-bigBox").remove();
                    androidIos.addPageList();
                    _this.$router.push({path:'/signIn',query:{pk:JSON.parse(img).pk,}});
                  });

              } else {
                bomb.first("签收失败");
              }
            });
          }
          catch(e){
            console.log("不支持apicloud");
          }
        },
        searchDateBoxTrue:function () {
          var _this = this;
          for(var i = 0 ; i < _this.searchList.length ; i++){
            if(_this.serchorderType ==_this.searchList[i].value ){
              _this.searchList[i].check = true;
            }else{
              _this.searchList[i].check = false;
            }
          }
          _this.searchDateBox = true;
        },
        searchDateGo:function () {
          var _this = this;
          for(var i = 0 ; i < _this.searchList.length ; i++){
            if(_this.searchList[i].check){
              _this.serchorderType = _this.searchList[i].value;
            }
          }
          _this.searchDateBox = false;
          sessionStorage.setItem("searchDate", _this.serchorderType);
          _this.corner();
        },
        go:function () {
            var _this = this;
            _this.corner();
            try{
              _this.apicloud = true;
              var scanner = api.require('scanner');
            }
            catch(e){
              _this.apicloud = false;
            }
            var INDEXSCROLLTOP = sessionStorage.getItem("INDEXSCROLLTOP");
            if(INDEXSCROLLTOP != null){
              $("#xinYaIndexBox").animate({scrollTop: INDEXSCROLLTOP}, 0);
              sessionStorage.removeItem("INDEXSCROLLTOP");
            }
          },
        keywordUp:function () {
          var _this = this;
          _this.keyWord = _this.keyWord.replace(/[^\a-\z\A-\Z0-9\-]/g,'');
        },
        keywordblur:function () {
          var _this = this;
         androidIos.addPageList();
         sessionStorage.setItem("indexKeyword",_this.keyWord);
         _this.$router.push({path:"/orderScreen",query:{keyword:_this.keyWord}});
        },
        corner:function () {
          var _this = this;
          $.ajax({
            type: "POST",
            url: androidIos.ajaxHttp() + "/order/homeStatistics",
            data:JSON.stringify({
              userCode:sessionStorage.getItem("token"),
              source:sessionStorage.getItem("source"),
              type:_this.serchorderType,
            }),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            timeout: 30000,
            success: function (homeStatistics) {
              if (homeStatistics.success == "1") {
                 _this.todayOrder = homeStatistics.orderTotal * 1;
                 _this.todayPrice = homeStatistics.todayFee*1;
                 sessionStorage.setItem("xinYaIndex",JSON.stringify({
                   todayOrder:_this.todayOrder,
                   todayPrice: _this.todayPrice,
                   iconList:_this.iconList,
                 }))
              }else{
                androidIos.second(homeStatistics.message);
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
            url: androidIos.ajaxHttp() + "/order/getOrderCount",
            data:JSON.stringify({
              userCode:sessionStorage.getItem("token"),
              source:sessionStorage.getItem("source"),
            }),
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            timeout: 30000,
            success: function (carrOrderListHeaderIcon) {
              if (carrOrderListHeaderIcon.success == "1") {
                _this.iconList[0].number = carrOrderListHeaderIcon.onTheWayCount*1;
                _this.iconList[1].number = carrOrderListHeaderIcon.completedCount*1;
                _this.iconList[2].number = carrOrderListHeaderIcon.pendingAllocation*1;
                _this.iconList[3].number = carrOrderListHeaderIcon.abnormalCount*1;
                sessionStorage.setItem("xinYaIndex",JSON.stringify({
                  todayOrder:_this.todayOrder,
                  todayPrice: _this.todayPrice,
                  iconList:_this.iconList,
                }))
              }else{
                androidIos.second(carrOrderListHeaderIcon.message);
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
        },
        lookTrackList:function (type) {
          var _this = this;
          androidIos.addPageList();
          _this.$router.push({path:"/searchTodayOrder",query:{type:type+1}});
        },
        getPageScroll:function() {
          var  yScroll;
          yScroll = document.getElementById("xinYaIndexBox").scrollTop;
          sessionStorage.setItem("INDEXSCROLLTOP",yScroll);
        },
        marginWidth:function () {
          var _this = this;
          var corner = document.getElementsByClassName("Indexcorner");
          for(var i = 0; i< corner.length;i++){
            var width = corner[i].scrollWidth;
            _this.iconList[i].marginRight = - width / (2*(_this.htmlSize())) + 0.05+ "rem";
            corner[i].style.marginRight = - width / (2*(_this.htmlSize())) + 0.05+ "rem";
          }
        },
        htmlSize:function () {
          return document.getElementsByTagName("html")[0].style.fontSize.replace("px","");
        }
      }
    }
</script>

<style scoped>
  #xinYaIndexBox{
    position: absolute;
    top:0rem;
    bottom:1.3rem;
    background: #f6f6f6;
    height: auto;
    width:100%;
    overflow: scroll;
    padding-bottom: 0.2rem;
  }
  .top{
    width:100%;
    padding:0.27rem 0;
    position: relative;
    background: -webkit-linear-gradient( #47b2e8 , #1a6bac); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(#47b2e8, #1a6bac); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(#47b2e8, #1a6bac); /* Firefox 3.6 - 15 */
    background: linear-gradient(#47b2e8 , #1a6bac); /* 标准的语法 */
  }
  #imgBoxTab{
    position: absolute;
    right:0.4rem;
    top:0.375rem;
    padding-right: 0.6rem;
  }
  #imgBoxTab p{
    color:white;
    font-size: 0.347rem;
   position: absolute;
    right:-0.38rem;
    z-index: 10;
    top:-0.8rem;
    padding: 0.8rem 0.38rem;
  }
  .topleftInputBox img{
       position: absolute;
      width:0.3rem;
    right:0.3rem;
    top:50%;
    margin-top: -0.218181818rem;
  }
  #date{
    width:0.53rem;
    margin-right: 0.38rem;
    float:left;
  }
  #saoyisao{
    width:0.48rem;
    height: 0.48rem;
    background-image: url("../images/saoyisao-2.png");
    background-size: 0.48rem;
    background-repeat: no-repeat;
    background-position: 0 0;
    margin-right: 0.38rem;
    position: relative;
    float:left;
  }
  #saoyisao input{
    position: absolute;
    left:0;
    top:0;
    bottom:0;
    width:0.48rem;
    height: 0.48rem;
    opacity: 0;
  }
  .topLeft{
    width:100%;
    padding-top: 1px;
  }
  .topleftInputBox{
    width:4.77rem;
    height:0.8rem;
    padding: 0rem 0.8rem;
    background-color:#2E8CC7 ;
    background-image: url("../images/icon-fadajing.png");
    background-position: 0.2rem 50%;
    background-repeat: no-repeat;
    background-size: 0.375rem;
    border-radius: 0.4rem;
    margin: 0.15rem 0 0.7rem 0.32rem;
    border:1px solid #2E8CC7;
    position: relative;
  }
  input::-webkit-input-placeholder{
    color: #fff;
  }
  input:-moz-placeholder {  /* Mozilla Firefox 4 to 18*/
    color:#fff;
  }
  input::-moz-placeholder {  /* Mozilla Firefox 19+*/
    　　color:#fff;
  }
  input:-ms-input-placeholder { /* Internet Explorer 10+*/
    　　color:#fff;
  }
  .topLeft input{
    font-size: 0.375rem;
    color:#fff;
    line-height: 0.375rem;
    text-align: left;
    width:100%;
    background: transparent;
    height: 0.4rem;
    margin-top: 0.2rem;
    display: block;
  }
  .topRight{
    width:100%;
    padding-top: 0.3rem;
  }
  .topRightF:nth-child(1){
    float: left;
    width:48%;
    margin-left: 1%;
  }
  .topRightF:nth-child(2){
    float: left;
    width:48%;
    margin-left: 2%;
  }
  .topRightF p{
    font-size: 0.7rem;
    color:#fff;
    line-height: 0.7rem;
    text-align: center;
    word-wrap:break-word;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .topRightF p span{
    font-size: 0.32rem;
    color:#fff;
    line-height: 1rem;
  }
  .center{
    width:100%;
    margin:0.32rem auto 0 auto ;
    background: white;
  }
  .center .title{
    font-size: 0.375rem;
    line-height: 1.04rem;
    color:#373737;
    width:86%;
    padding: 0 7%;
    border-bottom: 1px solid #dadada;
  }
  .center .title span{
    float: right;
    font-size: 0.32rem;
    line-height: 1.04rem;
    color:#999;
    padding-right:0.35rem ;
    background-image: url("../images/lookMore.png");
    background-size:0.18rem ;
    background-repeat: no-repeat;
    background-position: 100% 50%;
  }
  .center ul {
    width:100%;
    padding: 0.13rem 0 0rem 0;
    overflow: hidden;
  }
  .center ul li{
    width:47.8%;
    float: left;
    text-align: center;
    font-size: 0.34rem;
    margin-left: 1.46666%;
    color:#999;
    background:#F3F5F8 ;
    margin-bottom: 0.13rem;
    padding: 0.267rem 0 ;
  }
  .center ul li p{
     text-align: center;
     font-size: 0.61rem;
     color:#404060;
    line-height: 0.9rem;
  }
  .center ul li p:nth-child(4){
    color : #FF4500 !important;
  }
  .center ul li .iconListImg{
    width:1rem;
    height: 1rem;
    background-repeat: no-repeat;
    background-size: 1rem;
    background-position: 50% 50%;
    margin: 0 auto 0.175rem auto;
    position: relative;
  }
  .iconListImg img{
    width:100%;
  }
  .iconListImg p {
     position: absolute;
  }
  .Indexcorner{
    background: white;
    font-size: 0.3125rem;
    color:#1d68a9;
    position: absolute;
    top:0;
    right:0;
    padding: 0.01rem 0.16rem;
    border-radius: 0.3rem;
    margin-top: -0.2rem;
    margin-right:-0.17667rem ;
    border: 1px solid #1d68a9;
  }
  #searchDateBox{
    position: fixed;
    left:0;
    right:0;
    top:0;
    bottom:0;
    width:auto;
    height: auto;
    background-color: rgba(0,0,0,0.2);
  }
  #searchDate{
    position: absolute;
    width:7.1rem;
    left:50%;
    margin-left: -3.55rem;
    background: white;
    top:15%;
  }
  #searchDate p {
     color:#373737;
     font-size: 0.43rem;
     text-align: center;
     line-height:1.547rem ;
    border-bottom: 1px solid #E9EFF3;
  }
  #searchDate li{
    width:100%;
    border-bottom: 1px solid #E9EFF3;
  }
  #searchDate li h1{
     float: left;
    line-height: 1.17rem;
    color:#373737;
    font-size: 0.4rem;
    margin-left: 0.6rem;
  }
  #searchDate li .circle{
     float: right;
    margin-right:0.54rem ;
    width:0.5rem;
    height: 0.5rem;
    border: 0.0625rem solid #1D68A8;
    border-radius: 50%;
    margin-top: 0.2725rem;
    position: relative;
  }
  #searchDate li .circle .circleTrue{
    width:0.26rem;
    height: 0.26rem;
    background: #1D68A8;
    position: absolute;
    border-radius: 50%;
    left:50%;
    top:50%;
    margin-left: -0.13rem;
    margin-top: -0.13rem;
  }
  #searchDate button{
    width:2.7rem;
    height:0.88rem;
    background: #1D68A8;
    color:white;
    border-radius:0.15rem ;
    margin: 0.6133rem auto;
    display: block;
    font-size: 0.375rem;
  }
  .searchClosed{
    position: absolute;
    width:0.3rem;
    right:0.36rem;
    top:0.36rem;
  }
  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateY(0.13rem);
    opacity: 0;
  }
  #yuyinBox{
    position: fixed;
    top:0;
    bottom:0;
    width:100%;
    height: auto;
    background: rgba(0,0,0,0);
  }
  #yuyin{
    width:2rem;
    height: 2rem;
    background-color:rgba(0,0,0,0.5);
    background-image: url("../images/huatong-2.png");
    background-repeat: no-repeat;
    background-position: 50% 30%;
    border-radius: 0.2rem;
    background-size: 0.5rem;
    position: absolute;
    top:50%;
    margin-top: -1rem;
    left:50%;
    margin-left: -1rem;
  }
  #yuyin p {
    font-size: 0.35rem;
    color:white;
    text-align: center;
    margin-top: 1.3rem;
  }
</style>
