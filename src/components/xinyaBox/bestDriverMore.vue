<template>
  <div id="bestDriverMore">
    <div id="title" v-title data-title="司机详情"></div>
     <div id="bestDriverMoreBox">
       <img :src="photo" :onerror="errorlogo" @click="lookImg($event,photo)">
       <div class="message">
         <p>{{name}}</p>
         <div id="star_grade" class="star_grade"></div>
         <h2>驾驶证等级：{{licType}}</h2>
         <h1 v-html="year < 1 ? '驾龄：小于1年' : '驾龄：' +Math.floor(year) + '年'"></h1>
         <div class="clearBoth"></div>
       </div>
       <div class="clearBoth"></div>
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
        name: "best-driver-more",
       data(){
          return{
              photo:"",
              name:"",
              score:0,
              year:0,
              licType:"",
              errorlogo: 'this.src="' + require('../../images/userImg.png') + '"'
          }
       },
       mounted:function () {
          var _this = this;
          var pk = _this.$route.query.pk;
         $.ajax({
           type: "POST",
           url: androidIos.ajaxHttp() + "/driver/getDriverPage",
           data: JSON.stringify({
             pk: pk,
             page:1,
             size:1,
             userCode: sessionStorage.getItem("token"),
             source:sessionStorage.getItem("source")
           }),
           contentType: "application/json;charset=utf-8",
           dataType: "json",
           timeout: 30000,
           success: function (getDriverPage) {
             if(getDriverPage.success == "1"){
                 _this.photo = getDriverPage.list[0].driverImg;
                 _this.name =  getDriverPage.list[0].driverName;
                 _this.score =  getDriverPage.list[0].score * 1;
                 _this.year =  getDriverPage.list[0].driverAge;
                 _this.licType =  getDriverPage.list[0].licType == "" || getDriverPage.list[0].licType == null ? "暂无" : getDriverPage.list[0].licType;
             }else{
               androidIos.second(getDriverPage.message);
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
  #bestDriverMore .set_image_all {
    cursor: pointer;
    position: relative;
  }
  #bestDriverMore .set_image_top div{
    position: relative;
  }
  #bestDriverMore .star_grade{
    margin-top: 0.25rem;
  }
  #bestDriverMore .set_image_top img{
    position: absolute;
    top:0;
    left:0;
    height:100%;
    width:0.4rem!important;
  }
  #bestDriverMore .set_image_all .set_image_item {
    position: relative;
    display: inline-block;
    z-index: 11;
    visibility: visible;
  }

  #bestDriverMore .set_image_all .set_image_top {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 13;
  }

  #bestDriverMore .set_image_all .set_image_top>div {
    display: inline-block;
    overflow: hidden;
  }

  #bestDriverMore .set_image_all .set_image_top>div>img {
    height: 100%;
  }
  #bestDriverMore .grade {
    vertical-align: top;
    font-size: 0.3125rem;
    line-height:0.4rem ;
    display: none!important;
  }
</style>
<style scoped>
#bestDriverMore{
  position: absolute;
  top:1.3rem;
  bottom:0;
  height: auto;
  width:100%;
  background: #f6f6f6;
}
  #bestDriverMoreBox{
    width:100%;
    background: white;
    padding: 0.36rem 0 ;
    margin-top: 0.24rem;
  }
  #bestDriverMoreBox img{
     float: left;
     width:1.68rem;
     height:1.68rem;
     border-radius: 50%;
    margin-left: 0.76rem;
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
  font-size: 0.32rem;
  line-height: 0.32rem;
  margin-top: 0.2rem;
  color: #373737;
  float: left;
}
.message h1 {
  font-size: 0.32rem;
  line-height: 0.32rem;
  margin-top: 0.2rem;
  color: #373737;
  float: right;
}
</style>
