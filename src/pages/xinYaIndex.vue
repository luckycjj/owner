<template>
    <div id="xinYaIndex">
      <div id="title" v-title data-title="首页"></div>
      <div id="xinYaIndexBox" style="top:1.3rem;">
         <div class="top">
            <div class="topLeft">
              <p>订单统计<br><span>时间：{{time}}</span></p>
            </div>
            <div class="topRight">
              <div class="topRightF">
                <p>{{todayOrder | toThousands}}<br><span>订单量</span></p>
              </div>
              <div class="topRightF">
                <p>￥{{todayPrice | toThousands}}<br><span>运输费用</span></p>
              </div>
              <div class="clearBoth"></div>
            </div>
           <div class="clearBoth"></div>
         </div>
         <div class="center">
           <div class="title"> 我的订单<div class="clearBoth"></div></div>
           <ul>
             <li v-for="(item,index) in iconList">
                 <div class="iconListImg">
                   <img :src="item.icon">
                 </div>
                 {{item.name}}
             </li>
             <div class="clearBoth"></div>
           </ul>
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
             time :  (new Date()).getFullYear() + "/" + ((new Date()).getMonth() + 1) + "/" + (new Date()).getDate(),
             todayOrder :  0,
             todayPrice : 0,
             iconList:[{
                name:"运输中",
                number:0,
                icon:require("../images/trackList1.png")
             },{
               name:"已完成",
               number:0,
               icon:require("../images/trackList2.png")
             },{
               name:"对账单",
               number:0,
               icon:require("../images/trackList3.png")
             },{
               name:"异常单",
               number:0,
               icon:require("../images/trackList4.png")
             }]
           }
        },
      mounted:function () {
          var _this = this;
          androidIos.judgeIphoneX("xinYaIndexBox",2);
          androidIos.judgeIphoneX("xinYaIndexBox",1);
          sessionStorage.removeItem("NEWORDERTRANTYPE");
          androidIos.noviceguidance(1);
          androidIos.bridge(_this);
      },
      methods:{
        go:function () {
            var _this = this;
            var INDEXSCROLLTOP = sessionStorage.getItem("INDEXSCROLLTOP");
            if(INDEXSCROLLTOP != null){
              $("#xinYaIndexBox").animate({scrollTop: INDEXSCROLLTOP}, 0);
              sessionStorage.removeItem("INDEXSCROLLTOP");
            }
          },
        getPageScroll:function() {
          var  yScroll;
          yScroll = document.getElementById("xinYaIndexBox").scrollTop;
          sessionStorage.setItem("INDEXSCROLLTOP",yScroll);
        }
      }
    }
</script>

<style scoped>
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
  .top{
    width:100%;
    background: white;
    padding:0.27rem 0;
    border-top: 1px solid #F5F5F5;
  }
  .topLeft{
    float: left;
    width:40%;
    padding-top: 0.3rem;
  }
  .topLeft p{
    font-size: 0.375rem;
    color:#373737;
    line-height: 0.375rem;
    text-align: center;
  }
  .topLeft p span{
    font-size: 0.3125rem;
    color:#999;
    line-height: 1rem;
  }
  .topRight{
    float: right;
    width:60%;
    padding-top: 0.3rem;
    box-sizing: border-box;
    border-left: 1px solid #dadada;
  }
  .topRightF:nth-child(1){
    float: left;
    width:40%;
  }
  .topRightF:nth-child(2){
    float: left;
    width:50%;
  }
  .topRightF p{
    font-size: 0.5rem;
    color:#373737;
    line-height: 0.375rem;
    text-align: center;
  }
  .topRightF p span{
    font-size: 0.3125rem;
    color:#999;
    line-height: 1rem;
  }
  .center{
    width:96%;
    margin:0.32rem auto 0 auto ;
    background: white;
    border-radius: 0.2rem;
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
    padding: 0.6rem 0 0.5rem 0;
  }
  .center ul li{
    width:25%;
    float: left;
    text-align: center;
    font-size: 0.32rem;
    color:#373737;
  }
  .center ul li .iconListImg{
    width:0.587rem;
    margin: 0 auto 0.175rem auto;
    position: relative;
  }
  .iconListImg img{
    width:100%;
  }
</style>
