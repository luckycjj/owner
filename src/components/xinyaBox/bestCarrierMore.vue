<template>
  <div id="bestCarrierMore">
    <div id="title" v-title data-title="承运商详情"></div>
    <div id="bestCarrierMoreBox">
      <img :src="httpurl + photo" :onerror="errorlogo" @click="lookImg($event,httpurl + photo)">
      <div class="message">
        <p>{{name}}</p>
        <div id="star_grade" class="star_grade"></div>
        <h2>{{tranType}}</h2>
        <h1 v-html="year < 1 ? '入住时间：不到1年' : '入住时间：' +Math.floor(year) + '年'"></h1>
        <div class="clearBoth"></div>
      </div>
      <div class="clearBoth"></div>
    </div>
    <div id="companyMessage">
      <h6>社会型用代码：{{creditCode}}</h6>
      <h6>地址：{{address}}</h6>
      <h6 style="margin-bottom: 0;">入驻时间：{{time}}</h6>
    </div>
  </div>
</template>

<script>
  import {androidIos} from "../../js/app";
  import bridge from '../../js/bridge';
  import {bomb} from "../../js/zujian";
  import  "../../js/markingSystem";
  import PinchZoom from "../../js/pinchzoom";
  export default {
    name: "best-carrier-more",
    data(){
      return{
        photo:"",
        name:"",
        score:0,
        year:0,
        tranType:"",
        time:"",
        address:"",
        creditCode : "",
        httpurl:"",
        errorlogo: 'this.src="' + require('../../images/userImg.png') + '"'
      }
    },
    mounted:function () {
      var _this = this;
      var pk = _this.$route.query.pk;
      $.ajax({
        type: "POST",
        url: androidIos.ajaxHttp() + "/settings/findParamValueByName ",
        data: JSON.stringify({
          userCode:sessionStorage.getItem("token"),
          source:sessionStorage.getItem("source"),
          paramName:"resourcePath"
        }),
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        timeout:30000,
        success: function(findParamValueByName){
          if(findParamValueByName.success == "1"){
            _this.httpurl = findParamValueByName.paramValue;
          }else{
            androidIos.second(findParamValueByName.message);
          }
        },
        complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
          if(status=='timeout'){//超时,status还有success,error等值的情况
            androidIos.second("当前状况下网络状态差，请检查网络！")
          }else if(status=="error"){
            androidIos.errorwife();
          }
        }
      });
      $.ajax({
        type: "POST",
        url: androidIos.ajaxHttp() + "/carrier/getCarrier",
        data: JSON.stringify({
          pk: pk,
          userCode: sessionStorage.getItem("token"),
          source:sessionStorage.getItem("source")
        }),
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        timeout: 30000,
        success: function (getCarrier) {
          if(getCarrier.success == "1"){
            _this.photo = getCarrier.carrierImg;
            _this.name =  getCarrier.carrierName;
            _this.score =  getCarrier.score * 1;
            _this.year = ((new Date()).getTime() -  (new Date(getCarrier.createTime.replace(/-/g , '/'))).getTime())/1000/60/60/24/365;
            _this.time = getCarrier.createTime;
            _this.address = getCarrier.address;
            _this.tranType = getCarrier.transType;
            _this.creditCode = getCarrier.creditCode;
            _this.$nextTick(function () {
              $("#star_grade").html("");
              $("#star_grade").markingSystem({
                num: 5,
                havePoint: true,
                haveGrade: true,
                backgroundImageInitial:require('../../images/star_hollow.png'),
                backgroundImageOver:require('../../images/star_solid.png'),
                unit: '星',
                grade:_this.score * 1,
                height: 0.4* $("html").css("font-size").replace("px", ""),
                width: 0.4* $("html").css("font-size").replace("px", ""),
              });
            })
          }else{
            androidIos.second(getCarrier.message);
          }
        },
        complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
          if(status=='timeout'){//超时,status还有success,error等值的情况
            androidIos.second("网络请求超时");
          }else if(status=='error'){
            androidIos.errorwife();
          }
        }
      })
      androidIos.bridge(_this);
    },
    methods:{
      go:function () {
        var _this = this;
      },
      lookImg:function (even,imgurl) {
        var _this = this;
        if (even.target.className != "closed") {
          var img = imgurl;
          $("#imgBigbox").remove();
          $("body").append(
            "<div id='imgBigbox'><div class='pinch-zoom'><img onerror='"+ _this.errorlogo+"' id='zoomimg'  src='"+img+"' '></div><div id='zhezhaoImg'></div></div>"
          );
          $("#imgBigbox").css({
            width: "100%",
            height: "100%",
            position: "fixed",
            top: "0",
            left: "0",
            background: "rgb(0,0,0)",
            "z-index": "999",
            display: "block"
          });
          $("#zhezhaoImg").css({
            width: "100%",
            height: "100%",
            position: "absolute",
            background: "rgba(0,0,0,0)",
            "z-index": "999",
            top: "0",
            left: "0"
          });
          $("#imgBigbox img").css({ width: "100%", position: "absolute" });
          var image = document.getElementById("zoomimg");
          image.onload = function() {
            var height = $("#imgBigbox img").height();
            $("div.pinch-zoom").each(function() {
              new PinchZoom($(this), {});
            });
            $(".pinch-zoom-container").css({
              width: "100%",
              height: "100%"
            });
            $("#imgBigbox img").css("top", "50%");
            $(".pinch-zoom").css({ width: "100%", height: "100%" });
            $("#imgBigbox img").css("margin-top", -height / 2 + "px");
            var setImgBox;
            var setImgBoxNumber = 10;
            setImgBox = setInterval(function() {
              setImgBoxNumber--;
              if (setImgBoxNumber < 9) {
                clearInterval(setImgBox);
                setImgBoxNumber = 10;
                $("#zhezhaoImg").remove();
              }
            }, 100);
          };
        }
      },
    }
  }
</script>
<style>
  #bestCarrierMore .set_image_all {
    cursor: pointer;
    position: relative;
  }
  #bestCarrierMore .set_image_top div{
    position: relative;
  }
  #bestCarrierMore .star_grade{
    margin-top: 0.25rem;
  }
  #bestCarrierMore .set_image_top img{
    position: absolute;
    top:0;
    left:0;
    height:100%;
    width:0.4rem!important;
  }
  #bestCarrierMore .set_image_all .set_image_item {
    position: relative;
    display: inline-block;
    z-index: 11;
    visibility: visible;
  }

  #bestCarrierMore .set_image_all .set_image_top {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 13;
  }

  #bestCarrierMore .set_image_all .set_image_top>div {
    display: inline-block;
    overflow: hidden;
  }

  #bestCarrierMore .set_image_all .set_image_top>div>img {
    height: 100%;
  }
  #bestCarrierMore .grade {
    vertical-align: top;
    font-size: 0.3125rem;
    line-height:0.4rem ;
  }
</style>
<style scoped>
  #bestCarrierMore{
    position: absolute;
    top:1.3rem;
    bottom:0;
    height: auto;
    width:100%;
    background: #f6f6f6;
  }
  #bestCarrierMoreBox,#companyMessage{
    width:100%;
    background: white;
    padding: 0.36rem 0 ;
    margin-top: 0.24rem;
  }
  #companyMessage{
    margin-top: 0.03125rem;
    padding: 0.36rem 0.54rem ;
  }
  #companyMessage h6{
    color:#373737;
    font-size:0.347rem ;
    margin-bottom: 0.36rem;
  }
  #bestCarrierMoreBox img{
    float: left;
    width:1.68rem;
    height:1.68rem;
    border-radius: 50%;
    margin-left: 0.54rem;
  }
  .message{
    float: left;
    margin-left: 0.44rem;
    width:6rem;
  }
  .message p {
    font-size:0.375rem ;
    color:#373737;
    line-height: 0.375rem;
  }
  .message h2 {
    font-size: 0.3125rem;
    line-height: 0.32rem;
    color: #999;
  }
  .message h1 {
    font-size: 0.32rem;
    line-height: 0.32rem;
    margin-top: 0.3rem;
    color: #373737;
  }
  #companyMessage{

  }
</style>
