<template>
    <div id="xinYaIndex">
      <div id="title" v-title data-title="首页"></div>
      <div id="xinYaIndexBox" style="top:0rem;">
         <div class="top">
            <div class="topLeft">
              <input type="text" @keyup="keywordUp()"  @blur="keywordblur()" placeholder="请输入订单号" v-model="keyWord"/>
            </div>
            <div class="topRight">
              <div class="topRightF">
                <p>{{todayOrder | toThousands}}<br><span>今日订单量</span></p>
              </div>
              <div class="topRightF">
                <p>￥{{todayPrice | toThousands}}<br><span>今日运输费用</span></p>
              </div>
              <div class="clearBoth"></div>
            </div>
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
             keyWord:"",
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
          androidIos.judgeIphoneX("top",0);
          androidIos.judgeIphoneX("xinYaIndexBox",1);
          sessionStorage.removeItem("NEWORDERTRANTYPE");
          _this.keyWord = sessionStorage.getItem("indexKeyword") == undefined ? "" : sessionStorage.getItem("indexKeyword");
          sessionStorage.removeItem("indexKeyword");
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
        keywordUp:function () {
          var _this = this;
          _this.keyWord = _this.keyWord.replace(/[^\a-\z\A-\Z0-9\-]/g,'');
        },
        keywordblur:function () {
          var _this = this;
          if(_this.keyWord != ""){
             androidIos.addPageList();
             sessionStorage.setItem("indexKeyword",_this.keyWord);
             _this.$router.push({path:"/orderScreen",query:{keyword:_this.keyWord}});
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
    background: -webkit-linear-gradient( #47b2e8 , #1e72b2); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(#47b2e8, #1e72b2); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(#47b2e8, #1e72b2); /* Firefox 3.6 - 15 */
    background: linear-gradient(#47b2e8 , #1e72b2); /* 标准的语法 */
  }
  .topLeft{
    width:100%;
    padding-top: 1px;
  }
  .topLeft input{
    font-size: 0.375rem;
    color:#373737;
    line-height: 0.375rem;
    text-align: left;
    padding:0.2rem 0.8rem;
    width:4.77rem;
    height: 0.4rem;
    margin: 0.7rem auto;
    display: block;
    border-radius: 0.4rem;
    background-image: url("../images/sousuo2.png");
    background-position: 0.2rem 50%;
    background-repeat: no-repeat;
    background-size: 0.375rem;
  }
  .topRight{
    width:100%;
    padding-top: 0.3rem;
  }
  .topRightF:nth-child(1){
    float: left;
    width:50%;
  }
  .topRightF:nth-child(2){
    float: left;
    width:50%;
  }
  .topRightF p{
    font-size: 0.7rem;
    color:#fff;
    line-height: 0.7rem;
    text-align: center;
  }
  .topRightF p span{
    font-size: 0.35rem;
    color:#fff;
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
